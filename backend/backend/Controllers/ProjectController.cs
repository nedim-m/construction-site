using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController:ControllerBase
    {
        private readonly IProjectServices _services;

        public ProjectController(IProjectServices services)
        {
            _services=services;
        }

        [HttpPost]
        public async Task<IActionResult> AddProject(ProjectInsertRequest insert)
        {
            try
            {
                var response = await _services.AddProject(insert); 
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); 
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProjects([FromQuery] ProjectSearchRequest? searchRequest)
        {
            try
            {
                var projects = await _services.GetAllProjects(searchRequest);
                return Ok(projects); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); 
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            try
            {
                var project = await _services.GetProjectById(id);
                return Ok(project); 
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
