﻿using backend.Models;

namespace backend.Services
{
    public interface IProjectServices
    {
        Task<List<ProjectResponse>> GetAllProjects(ProjectSearchRequest? search = null);
        Task <ProjectResponse> GetProjectById(int id);

        Task<ProjectResponse> AddProject(ProjectInsertRequest insert);

    }
}
