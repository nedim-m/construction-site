using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly IImageServices _imageService;

        public ImageController(IImageServices imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("{projectId}")]
        public async Task<IActionResult> AddImages(int projectId, [FromBody] List<string> images)
        {
            try
            {
                var result = await _imageService.AddImages(projectId, images);
                return Ok(result); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška na serveru: {ex.Message}");
            }
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteImages(int projectId, [FromBody] List<int> imageIds)
        {
            try
            {
                var result = await _imageService.DeleteImages(projectId, imageIds);
                return Ok(result); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška na serveru: {ex.Message}");
            }
        }

        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetImagesByProjectId(int projectId)
        {
            try
            {
                var images = await _imageService.GetImagesByProjectId(projectId);
                return Ok(images);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
