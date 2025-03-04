using backend.Models;

namespace backend.Services
{
    public interface IAuthServices
    {
        Task<bool> RegisterUserAsync(AuthModel.RegisterModel model);
        Task<string?> LoginUserAsync(AuthModel.LoginModel model);

    }
}
