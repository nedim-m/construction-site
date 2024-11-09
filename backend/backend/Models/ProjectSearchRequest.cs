namespace backend.Models
{
    public class ProjectSearchRequest
    {
        public string? ProjectName { get; set; } = null;
        public string? ProjectLocation { get; set; } = null;

        public int? Page { get; set; }
        public int? PageSize { get; set; }

        public string? SortBy { get; set; }
    }
}
