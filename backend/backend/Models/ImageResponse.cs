using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ImageResponse
    {

        public int Id { get; set; }

        public string Img { get; set; }


        public required string MimeType { get; set; }
    }
}
