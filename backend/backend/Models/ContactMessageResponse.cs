namespace backend.Models
{
    public class ContactMessageResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Message { get; set; }

        public bool Read { get; set; }
        public DateTime DateTime { get; set; }
    }
}
