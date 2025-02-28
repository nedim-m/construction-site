namespace backend.Services
{
    public interface IImageProcessingServices
    {
        byte[] OptimizeImage(byte[] imageBytes);

    }
}
