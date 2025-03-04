using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public virtual DbSet<Project>Projects  { get; set; }
        public virtual DbSet<Image> Images { get; set; }
        public virtual DbSet<ContactMessage> ContactMessages { get; set; }
    }
}
