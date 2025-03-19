using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class Image
    {
        public int Id { get; set; }

        public string ImgUrl { get; set; }

        public bool Cover { get; set; } = false;




        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
    }
}
