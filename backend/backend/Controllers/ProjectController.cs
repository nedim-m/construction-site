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
        public IActionResult AddProject(ProjectInsertRequest insert)
        {
            var response= _services.AddProject(insert);
            return Ok(response); 
        }
    }
}
