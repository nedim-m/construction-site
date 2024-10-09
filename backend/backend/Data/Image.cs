using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class Image
    {
        public int Id { get; set; }

        public required byte[] Img { get; set; }

        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
    }
}


