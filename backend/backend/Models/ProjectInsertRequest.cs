namespace backend.Models
{
    public class ProjectInsertRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Location { get; set; }
        public string? Description { get; set; }
        public required string Name { get; set; }
        public bool NewClient { get; set; }
        public List<string> Images { get; set; } = [];
    }
}
