using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class ProjectServices(DataContext context) : IProjectServices
    {
        private readonly DataContext _context = context;

        public async Task<ProjectResponse> AddProject(ProjectInsertRequest insert)
        {
            // Kreiramo novi projekat na osnovu podataka iz insert requesta
            var project = new Project
            {
                StartDate = insert.StartDate,
                EndDate = insert.EndDate,
                Location = insert.Location,
                Description = insert.Description,
                Images = new List<Image>() // Inicijalizujemo praznu listu za slike
            };

            // Obrada svake slike
            foreach (var img in insert.Images)
            {
                // Ukloni prefiks ako postoji
                var base64Data = img.Substring(img.IndexOf(",") + 1);

                try
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Data);
                    project.Images.Add(new Image { Img = imageBytes });
                }
                catch (FormatException ex)
                {
                    throw new Exception($"Jedna ili više slika nije validan Base64 format: {img}", ex);
                }
            }


            // Dodavanje projekta u bazu podataka
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Priprema odgovora koji se vraća klijentu
            var projectResponse = new ProjectResponse
            {
                Id = project.Id,
                Location = project.Location,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                Description = project.Description,
                // Konverzija slika nazad u Base64 format za vraćanje klijentu (ako je potrebno)
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
