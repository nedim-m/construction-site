using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

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

                    
                    var image = new Image
                    {
                        Img = imageBytes,
                        MimeType = mimeType, 
                        Project = project
                    };

                    _context.Images.Add(image);
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

        public async Task<List<ProjectResponse>> GetAllProjects(ProjectSearchRequest? searchRequest = null)
        {
            IQueryable<Project> query = _context.Projects.Include(p => p.Images);

       
            if (searchRequest != null && !string.IsNullOrWhiteSpace(searchRequest.ProjectLocation))
            {
                query = query.Where(p => p.Location.Contains(searchRequest.ProjectLocation));
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
                Images = p.Images.Select(i => $"data:{i.MimeType};base64,{Convert.ToBase64String(i.Img)}").ToList()
            }).ToList();

            return projectResponses;
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
                Name= project.Name,
                Images = project.Images.Select(i => $"data:{i.MimeType};base64,{Convert.ToBase64String(i.Img)}").ToList()
            };

            return projectResponse;
        }
    }
}
