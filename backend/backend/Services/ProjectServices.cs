using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace backend.Services
{
    public class ProjectServices : IProjectServices
    {
        private readonly DataContext _context;

        public ProjectServices(DataContext context)
        {
            _context = context;
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
            };

            foreach (var img in insert.Images)
            {
                if (string.IsNullOrWhiteSpace(img))
                {
                    throw new ArgumentException("Jedna ili više slika je prazna ili nevalidna.");
                }

                try
                {
                    var mimeType = img.Substring(5, img.IndexOf(";") - 5);
                    var base64Data = img.Substring(img.IndexOf(",") + 1);
                    byte[] imageBytes = Convert.FromBase64String(base64Data);


                    using (var image = SixLabors.ImageSharp.Image.Load(imageBytes))
                    {

                        image.Mutate(x => x.Resize(1920, 1024));


                        using (var ms = new MemoryStream())
                        {
                            image.SaveAsJpeg(ms);
                            var resizedImageBytes = ms.ToArray();

                            var imageEntity = new Data.Image
                            {
                                Img = resizedImageBytes,
                                MimeType = mimeType,
                                Project = project
                            };

                            _context.Images.Add(imageEntity);
                        }
                    }
                }
                catch (FormatException ex)
                {
                    throw new Exception($"Slika nije validan Base64 format: {img}", ex);
                }
            }

            _context.Projects.Add(project);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Greška prilikom spremanja podataka u bazu: {ex.Message}", ex);
            }

            var projectResponse = new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Name = project.Name,
                Images = project.Images.Select(i => $"data:{i.MimeType};base64,{Convert.ToBase64String(i.Img)}").ToList()
            };

            return projectResponse;
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

           
            var projectResponses = projects.Select(p => new ProjectResponse
            {
                Id = p.Id,
                Location = p.Location,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Description = p.Description,
                Name = p.Name,
                Images = p.Images
                    .OrderByDescending(i => i.Cover)
                    .Select(i => $"data:{i.MimeType};base64,{Convert.ToBase64String(i.Img)}")
                    .ToList()
            }).ToList();

            result.Result = projectResponses;

            return result;
        }


        public async Task<ProjectResponse> GetProjectById(int id)
        {

            var project = await _context.Projects
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                throw new KeyNotFoundException($"Projekat sa ID-om {id} nije pronađen.");
            }


            var projectResponse = new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Name = project.Name,
                Images = project.Images
        .OrderByDescending(i => i.Cover)  
        .Select(i => $"data:{i.MimeType};base64,{Convert.ToBase64String(i.Img)}")
        .ToList()
            };

            return projectResponse;
        }



        public async Task<bool> DeleteProject(int id)
        {

            var project = await _context.Projects
                                        .Include(p => p.Images)
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                throw new Exception("Projekat nije pronađen.");
            }


            _context.Images.RemoveRange(project.Images);


            _context.Projects.Remove(project);

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Greška prilikom brisanja podataka: {ex.Message}", ex);
            }
        }

        public async Task<ProjectResponse> UpdateProject(int id, ProjectUpdateRequest update)
        {

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                throw new KeyNotFoundException($"Projekat sa ID-om {id} nije pronađen.");
            }


            project.StartDate = DateTime.SpecifyKind(update.StartDate, DateTimeKind.Utc);
            project.EndDate = DateTime.SpecifyKind(update.EndDate, DateTimeKind.Utc);
            project.Location = update.Location;
            project.Description = update.Description;
            project.Name = update.Name;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Greška prilikom ažuriranja projekta: {ex.Message}", ex);
            }


            var projectResponse = new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Name = project.Name,
                Images = project.Images.Select(i => $"data:{i.MimeType};base64,{Convert.ToBase64String(i.Img)}").ToList()
            };

            return projectResponse;
        }

        public async Task<int> GetProjectNumber()
        {
            return await _context.Projects.CountAsync();
        }
    }
}
