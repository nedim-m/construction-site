namespace backend.Services
{
    public interface IImageProcessingServices
    {
        byte[] OptimizeImage(byte[] imageBytes, bool convertToWebP = true);

    }
}
