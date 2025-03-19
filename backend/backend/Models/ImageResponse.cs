using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ImageResponse
    {

        public int Id { get; set; }

        public string ImgUrl { get; set; }


        public bool Cover { get; set; }



    }
}
