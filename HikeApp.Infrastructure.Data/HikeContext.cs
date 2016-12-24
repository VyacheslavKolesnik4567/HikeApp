using HikeApp.Domain.Core;
using System.Data.Entity;

namespace HikeApp.Infrastructure.Data
{
    public class HikeContext : DbContext
    {
        public HikeContext()
        { }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Tourist> Turists { get; set; }
        public DbSet<Path> Paths { get; set; }
        public DbSet<Hike> Hikes { get; set; }
        public DbSet<Head> Heads { get; set; }
        public DbSet<Kayak> Kayaks { get; set; }
        public DbSet<HikeTourist> HikeTurists { get; set; }
        public DbSet<HikePhoto> HikePhotos { get; set; }
        public DbSet<City> Cities { get; set; }
    }
}