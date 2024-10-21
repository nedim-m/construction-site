using backend.Data;
using backend.Models;

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
            };

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

                    var image = new Image
                    {
                        Img = imageBytes,
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
                // Hvatanje greške i ispisivanje detalja greške
                throw new Exception($"Greška prilikom spremanja podataka u bazu: {ex.Message}", ex);
            }

            var projectResponse = new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                Images = project.Images.Select(i => Convert.ToBase64String(i.Img)).ToList()
            };

            return projectResponse;
        }









        public Task<List<ProjectResponse>> GetAllProjects(ProjectSearchRequest? searchRequest = null)
        {
            throw new NotImplementedException();
        }

        public Task<ProjectResponse> GetProjectById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
