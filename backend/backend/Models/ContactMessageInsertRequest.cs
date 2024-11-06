namespace backend.Models
{
    public class ContactMessageInsertRequest
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Message { get; set; }
    }
}
