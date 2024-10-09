using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class ProjectServices(DataContext context) : IProjectServices
    {
        private readonly DataContext _context = context;

        public async Task<ProjectResponse> AddProject(ProjectInsertRequest insert)
        {
     
            var project = new Project
            {
                StartDate = insert.StartDate,
                EndDate = insert.EndDate,
                Location = insert.Location,
                Description = insert.Description,
                Images = new List<Image>() 
            };

            TestBase64Conversion("iVBORw0KGgoAAAANSUhEUgAAAAUAABAAQCAIAAA8RskP1AAAAAXNSR0IArs4c6QAAAABJRU5ErkJggg==");
            foreach (var img in insert.Images)
            {
                if (string.IsNullOrWhiteSpace(img))
                {
                    throw new Exception("Jedna ili više slika je prazna ili nevalidna.");
                }

                try
                {
                    byte[] imageBytes = Convert.FromBase64String(img);
                    project.Images.Add(new Image { Img = imageBytes });
                }
                catch (FormatException ex)
                {
                    throw new Exception($"Jedna ili više slika nije validan Base64 format: {img}", ex);
                }
            }





            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

          
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

        public static void TestBase64Conversion(string base64String)
        {
            try
            {
                byte[] imageBytes = Convert.FromBase64String(base64String);
                Console.WriteLine("Base64 string je validan!");
            }
            catch (FormatException)
            {
                Console.WriteLine("Base64 string nije validan!");
            }
        }

        // Testiranje
       



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
