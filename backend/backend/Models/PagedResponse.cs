namespace backend.Models
{
    public class PagedResponse<T>
    {
        public List<T>? Result { get; set; }
        public int? Count { get; set; }
    }
}
