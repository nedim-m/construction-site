namespace backend.Models
{
    public class ProjectUpdateRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Location { get; set; }
        public string? Description { get; set; }
        public required string Name { get; set; }
        public bool NewClient { get; set; }
    }
}
