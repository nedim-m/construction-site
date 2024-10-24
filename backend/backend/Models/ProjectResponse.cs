using backend.Data;

namespace backend.Models
{
    public class ProjectResponse
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Location { get; set; }
        public string? Description { get; set; }
        public  string Name { get; set; }

        public List<string> Images { get; set; } = [];
    }
}
