using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;

namespace backend.Services
{
    public class ProjectServices : IProjectServices
    {
        private readonly DataContext _context;
        private readonly HttpClient _httpClient;
        private readonly IImageProcessingServices _imageProcessingServices;
        private const string BunnyCdnStorageZone = "jaric-storage"; // testni
        private const string BunnyCdnApiKey = "27700f23-8334-4a95-bb85901c637b-6bf8-43ef"; // testni
        private const string BunnyCdnBaseUrl = "https://storage.bunnycdn.com/jaric-storage/"; //testni

        public ProjectServices(DataContext context, HttpClient httpClient, IImageProcessingServices imageProcessingServices)
        {
            _context = context;
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("AccessKey", BunnyCdnApiKey);
            _imageProcessingServices=imageProcessingServices;
        }

        public async Task<ProjectResponse> AddProject(ProjectInsertRequest insert)
        {
            var project = new Project
            {
                StartDate = DateTime.SpecifyKind(insert.StartDate, DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(insert.EndDate, DateTimeKind.Utc),
                Location = insert.Location,
                Description = insert.Description,
                Name = insert.Name,
                NewClient=insert.NewClient
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            foreach (var img in insert.Images)
            {
                if (string.IsNullOrWhiteSpace(img))
                {
                    throw new ArgumentException("Jedna ili više slika je prazna ili nevalidna.");
                }

                try
                {
                    var base64Data = img.Substring(img.IndexOf(",") + 1);
                    byte[] imageBytes = Convert.FromBase64String(base64Data);

                    byte[] optimizedImage = _imageProcessingServices.OptimizeImage(imageBytes);


                    string fileName = $"{Guid.NewGuid()}.jpg";
                    string uploadUrl = BunnyCdnBaseUrl + fileName;

                    using (var content = new ByteArrayContent(optimizedImage))
                    {
                        content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
                        var response = await _httpClient.PutAsync(uploadUrl, content);

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception("Greška prilikom otpremanja slike na BunnyCDN.");
                        }
                    }

                    var imageEntity = new Data.Image
                    {
                        ImgUrl = $"https://{BunnyCdnStorageZone}.b-cdn.net/{fileName}",
                        Project = project
                    };

                    _context.Images.Add(imageEntity);
                }
                catch (FormatException ex)
                {
                    throw new Exception("Slika nije validan Base64 format.", ex);
                }
            }

            await _context.SaveChangesAsync();

            return new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Name = project.Name,
                NewClient=project.NewClient,
                Images = project.Images.Select(i => i.ImgUrl).ToList()
            };
        }

        public async Task<bool> DeleteProject(int id)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                throw new Exception("Projekat nije pronađen.");
            }

            foreach (var image in project.Images)
            {
                var fileName = image.ImgUrl.Split('/').Last();
                var deleteUrl = BunnyCdnBaseUrl + fileName;
                var request = new HttpRequestMessage(HttpMethod.Delete, deleteUrl);
                request.Headers.Add("AccessKey", BunnyCdnApiKey);
                await _httpClient.SendAsync(request);
            }

            _context.Images.RemoveRange(project.Images);
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ProjectResponse> GetProjectById(int id)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                throw new KeyNotFoundException("Projekat nije pronađen.");
            }

            return new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Name = project.Name,
                NewClient= project.NewClient,
                Images = project.Images
                .OrderByDescending(i => i.Cover)
                .Select(i => i.ImgUrl)
                .ToList()

            };
        }

        public async Task<PagedResponse<ProjectResponse>> GetAllProjects(ProjectSearchRequest? searchRequest = null)
        {
            IQueryable<Project> query = _context.Projects.Include(p => p.Images);

            PagedResponse<ProjectResponse> result = new();


            if (searchRequest != null && !string.IsNullOrWhiteSpace(searchRequest.ProjectLocation))
            {
                query = query.Where(p => p.Location.Contains(searchRequest.ProjectLocation));
            }


            if (!string.IsNullOrWhiteSpace(searchRequest?.SortBy))
            {
                query = searchRequest.SortBy.ToLower() switch
                {
                    "startdate" => query.OrderBy(p => p.StartDate),
                    "startdate_desc" => query.OrderByDescending(p => p.StartDate),
                    "enddate" => query.OrderBy(p => p.EndDate),
                    "enddate_desc" => query.OrderByDescending(p => p.EndDate),
                    "location" => query.OrderBy(p => p.Location),
                    "location_desc" => query.OrderByDescending(p => p.Location),
                    _ => query
                };
            }


            result.Count = await query.CountAsync();


            if (searchRequest?.Page.HasValue == true && searchRequest?.PageSize.HasValue == true)
            {
                query = query
                    .Skip((searchRequest.Page.Value - 1) * searchRequest.PageSize.Value)
                    .Take(searchRequest.PageSize.Value);
            }


            var projects = await query.ToListAsync();

            result.Result = projects.Select(p => new ProjectResponse
            {
                Id = p.Id,
                Location = p.Location,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Description = p.Description,
                Name = p.Name,
                NewClient= p.NewClient,
                Images = p.Images.OrderByDescending(i => i.Cover).Select(i => i.ImgUrl).ToList()
            }).ToList();

            return result;
        }

        public async Task<ProjectResponse> UpdateProject(int id, ProjectUpdateRequest update)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                throw new KeyNotFoundException($"Projekat sa ID-om {id} nije pronađen.");
            }

            project.StartDate = DateTime.SpecifyKind(update.StartDate, DateTimeKind.Utc);
            project.EndDate = DateTime.SpecifyKind(update.EndDate, DateTimeKind.Utc);
            project.Location = update.Location;
            project.Description = update.Description;
            project.Name = update.Name;
            project.NewClient= update.NewClient;

            await _context.SaveChangesAsync();

            return new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Name = project.Name,
               NewClient= project.NewClient,
                Images = project.Images.Select(i => i.ImgUrl).ToList()
            };
        }

        public async Task<ProjectAndCustomerNumber> GetProjectNumber()
        {
            var numberOfProjects = await _context.Projects.CountAsync();
            var numberOfClients = await _context.Projects
                .Where(x => x.NewClient)
                .CountAsync();

            return new ProjectAndCustomerNumber
            {
                NumberOfClients = numberOfClients,
                NumberOfProjects = numberOfProjects
            };
        }


    }
}
