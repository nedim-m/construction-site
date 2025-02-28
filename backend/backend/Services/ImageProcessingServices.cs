using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.PixelFormats;
using System.IO;

namespace backend.Services
{
    public class ImageProcessingServices : IImageProcessingServices
    {
        private const int MaxWidth = 1400;
        private const int CompressionQuality = 90;

        public byte[] OptimizeImage(byte[] imageBytes)
        {
            using (var stream = new MemoryStream(imageBytes))
            using (var image = Image.Load(stream)) 
            {
                int newWidth = image.Width > MaxWidth ? MaxWidth : image.Width;
                int newHeight = (int)((double)image.Height / image.Width * newWidth);

               
                image.Mutate(x => x.Resize(newWidth, newHeight));

                var encoder = new JpegEncoder()
                {
                    Quality = CompressionQuality
                };

                using (var output = new MemoryStream())
                {
                    image.Save(output, encoder);  
                    return output.ToArray();      
                }
            }
        }
    }
}
