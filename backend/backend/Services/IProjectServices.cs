using backend.Models;

namespace backend.Services
{
    public interface IProjectServices
    {
        Task<PagedResponse<ProjectResponse>> GetAllProjects(ProjectSearchRequest? search = null);
        Task <ProjectResponse> GetProjectById(int id);

        Task<ProjectResponse> AddProject(ProjectInsertRequest insert);

        Task<bool> DeleteProject(int id);

        Task<ProjectResponse> UpdateProject(int id, ProjectUpdateRequest update);

        Task<ProjectAndCustomerNumber> GetProjectNumber();


    }
}
