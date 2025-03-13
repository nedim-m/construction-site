using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace backend.Services
{
    public class ImageProcessingServices : IImageProcessingServices
    {
        private const int MaxWidth = 1400;
        private const int CompressionQuality = 90;

        public byte[] OptimizeImage(byte[] imageBytes, bool convertToWebP = true)
        {
            using (var stream = new MemoryStream(imageBytes))
            {
                using (var image = Image.Load(stream))
                {
                    // Dobijanje originalnog formata
                    var format = image.Metadata.DecodedImageFormat;

                    // Postavljanje nove veličine
                    int newWidth = image.Width > MaxWidth ? MaxWidth : image.Width;
                    int newHeight = (int)((double)image.Height / image.Width * newWidth);
                    image.Mutate(x => x.Resize(newWidth, newHeight));

                    // Odabir formata
                    IImageEncoder encoder;
                    if (convertToWebP || (format != null && format.DefaultMimeType == "image/webp")) // Ako želimo WebP ili je original već WebP
                    {
                        encoder = new WebpEncoder()
                        {
                            Quality = CompressionQuality
                        };
                    }
                    else // Ostaje originalni format
                    {
                        encoder = format switch
                        {
                            JpegFormat => new JpegEncoder() { Quality = CompressionQuality },
                            PngFormat => new PngEncoder() { CompressionLevel = PngCompressionLevel.DefaultCompression },
                            _ => new JpegEncoder() { Quality = CompressionQuality } // Ako je nepoznat format, koristi JPEG
                        };
                    }

                    using (var output = new MemoryStream())
                    {
                        image.Save(output, encoder);
                        return output.ToArray();
                    }
                }
            }
        }
    }
}
