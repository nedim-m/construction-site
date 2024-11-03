using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ImageServices : IImageServices
    {
        private readonly DataContext _context;

        public ImageServices(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> AddImages(int projectId, List<string> images)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
            {
                throw new KeyNotFoundException($"Projekat sa ID-om {projectId} nije pronađen.");
            }

            foreach (var img in images)
            {
                if (string.IsNullOrWhiteSpace(img))
                {
                    throw new ArgumentException("Jedna ili više slika su prazne ili nevalidne.");
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

            await _context.SaveChangesAsync();
            return true; // Vraća true ako su slike uspešno dodate
        }

        public async Task<bool> DeleteImages(int projectId, List<int> imageIds)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
            {
                throw new KeyNotFoundException($"Projekat sa ID-om {projectId} nije pronađen.");
            }

            var imagesToDelete = project.Images.Where(i => imageIds.Contains(i.Id)).ToList();
            if (imagesToDelete.Count == 0)
            {
                throw new Exception("Nema slika za brisanje.");
            }

            _context.Images.RemoveRange(imagesToDelete);

            try
            {
                await _context.SaveChangesAsync();
                return true; // Vraća true ako su slike uspešno obrisane
            }
            catch (Exception ex)
            {
                throw new Exception($"Greška prilikom brisanja slika: {ex.Message}", ex);
            }
        }

        public async Task<List<ImageResponse>> GetImagesByProjectId(int projectId)
        {
            var images = await _context.Images
                .Where(img => img.ProjectId == projectId)
                .Select(img => new ImageResponse
                {
                    Id = img.Id,
                    MimeType = img.MimeType,
                    Img = $"data:{img.MimeType};base64,{Convert.ToBase64String(img.Img)}"
                })
                .ToListAsync();

            return images;
        }
    }
}