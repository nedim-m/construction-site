using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ContactMessageService:IContactMessageService
    {
        private readonly DataContext _context;

        public ContactMessageService(DataContext context)
        {
            _context=context;
        }

        public async Task<ContactMessageResponse> InsertAsync(ContactMessageInsertRequest request)
        {
            var newMessage = new ContactMessage
            {
                Name = request.Name,
                Email = request.Email,
                Message = request.Message,
                Read = false,
                DateTime= DateTime.UtcNow,
                
            };

            _context.ContactMessages.Add(newMessage);
            await _context.SaveChangesAsync();

            return new ContactMessageResponse
            {
                Id = newMessage.Id,
                Name = newMessage.Name,
                Email = newMessage.Email,
                Message = newMessage.Message,
                Read = newMessage.Read,
                DateTime = DateTime.UtcNow,
            };
        }

        public async Task<List<ContactMessageResponse>> GetAllAsync()
        {
            return await _context.ContactMessages
                .Select(m => new ContactMessageResponse
                {
                    Id = m.Id,
                    Name = m.Name,
                    Email = m.Email,
                    Message = m.Message,
                    Read = m.Read,
                    DateTime = m.DateTime,
                })
                .ToListAsync();
        }

        public async Task<ContactMessageResponse?> GetByIdAsync(int id)
        {
            var message = await _context.ContactMessages.FindAsync(id);

            if (message == null) return null;

            return new ContactMessageResponse
            {
                Id = message.Id,
                Name = message.Name,
                Email = message.Email,
                Message = message.Message,
                Read = message.Read,
                DateTime = message.DateTime                
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var message = await _context.ContactMessages.FindAsync(id);

            if (message == null) return false;

            _context.ContactMessages.Remove(message);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateStatusAsync(int id, bool isRead)
        {
            var message = await _context.ContactMessages.FindAsync(id);

            if (message == null) return false;

            message.Read = isRead;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}

