namespace backend.Data
{
    public class ContactMessage
    {
        public int Id { get; set; }

        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Message { get; set; }
        public bool Read { get; set; } = false;

        public DateTime DateTime { get; set; }
    }
}
