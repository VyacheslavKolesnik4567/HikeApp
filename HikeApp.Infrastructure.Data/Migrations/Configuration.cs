namespace HikeApp.Infrastructure.Data.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<HikeApp.Infrastructure.Data.HikeContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(HikeContext context)
        {

        }
    }
}
