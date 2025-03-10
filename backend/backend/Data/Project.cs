namespace backend.Data
{
    public class Project
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string Location { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public bool NewClient { get; set; }

        public ICollection<Image> Images { get; set; } = [];

    }
}
