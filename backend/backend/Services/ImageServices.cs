using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Net.Http.Headers;
using System.Text;

namespace backend.Services
{
    public class ImageServices : IImageServices
    {
        private readonly DataContext _context;
        private readonly HttpClient _httpClient;
        private const string BunnyCdnStorageZone = "jaric-storage"; // testni
        private const string BunnyCdnApiKey = "27700f23-8334-4a95-bb85901c637b-6bf8-43ef"; // testni
        private const string BunnyCdnBaseUrl = "https://storage.bunnycdn.com/jaric-storage/"; //testni


        public ImageServices(DataContext context)
        {
            _context = context;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("AccessKey", BunnyCdnApiKey);
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

                    using (var image = SixLabors.ImageSharp.Image.Load(imageBytes))
                    {
                        image.Mutate(x => x.Resize(1920, 1024));

                        using (var ms = new MemoryStream())
                        {
                            image.SaveAsJpeg(ms);
                            var resizedImageBytes = ms.ToArray();

                            
                            var fileName = $"{Guid.NewGuid()}.jpg";
                            var uploadUrl = BunnyCdnBaseUrl + fileName;
                            var content = new ByteArrayContent(resizedImageBytes);
                            content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

                            var response = await _httpClient.PutAsync(uploadUrl, content);
                            if (!response.IsSuccessStatusCode)
                            {
                                throw new Exception("Greška pri otpremanju slike na BunnyCDN");
                            }

                            var imageEntity = new Data.Image
                            {
                                ImgUrl = $"https://{BunnyCdnStorageZone}.b-cdn.net/{fileName}",
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

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteImages(int projectId, List<int> imageIds)
        {
            var project = await _context.Projects.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == projectId);
            if (project == null)
            {
                throw new KeyNotFoundException($"Projekat sa ID-om {projectId} nije pronađen.");
            }

            var imagesToDelete = project.Images.Where(i => imageIds.Contains(i.Id)).ToList();
            if (!imagesToDelete.Any())
            {
                throw new Exception("Nema slika za brisanje.");
            }

            foreach (var image in imagesToDelete)
            {
                var fileName = image.ImgUrl.Split('/').Last();
                var deleteUrl = BunnyCdnBaseUrl + fileName;
                var request = new HttpRequestMessage(HttpMethod.Delete, deleteUrl);
                request.Headers.Add("AccessKey", BunnyCdnApiKey);
                await _httpClient.SendAsync(request);
            }

            _context.Images.RemoveRange(imagesToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ImageResponse>> GetImagesByProjectId(int projectId)
        {
            var images = await _context.Images
                .Where(img => img.ProjectId == projectId)
                .Select(img => new ImageResponse
                {
                    Id = img.Id,
                    ImgUrl = img.ImgUrl,
                    Cover=img.Cover
                })
                .ToListAsync();

            return images;
        }

        public async Task<bool> SetAsCover(int projectId, int imageId)
        {
            var coverImage = await _context.Images
                .FirstOrDefaultAsync(i => i.ProjectId == projectId && i.Id == imageId);

            if (coverImage == null)
                throw new Exception("Slika sa datim ID-jem nije pronađena.");

            await _context.Images
                .Where(i => i.ProjectId == projectId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(i => i.Cover, false));

            coverImage.Cover = true;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška pri čuvanju: {ex.Message}");
                return false;
            }
        }

    }
}
