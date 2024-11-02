namespace backend.Services
{
    public interface IImageServices
    {
        Task<bool> AddImages(int projectId, List<string> images);
        Task<bool> DeleteImages(int projectId, List<int> imageIds);

    }
}
