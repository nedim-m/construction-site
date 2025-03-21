﻿using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectServices _services;

        public ProjectController(IProjectServices services)
        {
            _services=services;
        }


        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectUpdateRequest updateRequest)
        {
            if (updateRequest == null)
            {
                return BadRequest("Podaci za ažuriranje nisu poslani.");
            }

            try
            {
                var updatedProject = await _services.UpdateProject(id, updateRequest);
                return Ok(updatedProject);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Greška na serveru: {ex.Message}");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var result = await _services.DeleteProject(id);
            if (!result) return NotFound(new { Message = "Project not found" });

            return Ok(new { Message = "Project deleted successfully" });
        }
        [HttpGet("projectNumber")]
        public async Task<ActionResult<ProjectAndCustomerNumber>> GetProjectNumber()
        {
            try
            {
                var projectData = await _services.GetProjectNumber();
                return Ok(projectData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Greška pri dobijanju broja projekata.", Error = ex.Message });
            }
        }




    }
}
