using backend.Models;

namespace backend.Services
{
    public interface IContactMessageService
    {
        Task<ContactMessageResponse> InsertAsync(ContactMessageInsertRequest request);
        Task<List<ContactMessageResponse>> GetAllAsync();
        Task<ContactMessageResponse?> GetByIdAsync(int id);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateStatusAsync(int id, bool isRead);
        Task<int> GeUnreadMessageCount();
    }
}
