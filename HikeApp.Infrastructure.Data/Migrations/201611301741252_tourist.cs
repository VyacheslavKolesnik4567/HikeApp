namespace HikeApp.Infrastructure.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tourist : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.HikeTurist", "HikeId", "dbo.Hike");
            DropForeignKey("dbo.HikeTurist", "TuristId", "dbo.Turist");
            DropIndex("dbo.HikeTurist", new[] { "HikeId" });
            DropIndex("dbo.HikeTurist", new[] { "TuristId" });
            CreateTable(
                "dbo.HikeTourist",
                c => new
                    {
                        HikeTouristId = c.Int(nullable: false, identity: true),
                        HikeId = c.Int(nullable: false),
                        TouristId = c.Int(nullable: false),
                        KayakNumber = c.Int(nullable: false),
                        PlaceNumber = c.Int(nullable: false),
                        Confirmed = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.HikeTouristId)
                .ForeignKey("dbo.Hike", t => t.HikeId, cascadeDelete: true)
                .ForeignKey("dbo.Tourist", t => t.TouristId, cascadeDelete: true)
                .Index(t => t.HikeId)
                .Index(t => t.TouristId);
            
            CreateTable(
                "dbo.Tourist",
                c => new
                    {
                        TouristId = c.Int(nullable: false, identity: true),
                        TouristFirstName = c.String(nullable: false, maxLength: 25),
                        TouristLastName = c.String(nullable: false, maxLength: 25),
                        Phone = c.String(nullable: false, maxLength: 25),
                        Gender = c.String(nullable: false, maxLength: 6),
                        Birthday = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TouristId);
            
            AddColumn("dbo.UserProfile", "TouristId", c => c.Int());
            DropColumn("dbo.UserProfile", "TuristId");
            DropTable("dbo.Turist");
            DropTable("dbo.HikeTurist");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.HikeTurist",
                c => new
                    {
                        HikeTuristId = c.Int(nullable: false, identity: true),
                        HikeId = c.Int(nullable: false),
                        TuristId = c.Int(nullable: false),
                        KayakNumber = c.Int(nullable: false),
                        PlaceNumber = c.Int(nullable: false),
                        Confirmed = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.HikeTuristId);
            
            CreateTable(
                "dbo.Turist",
                c => new
                    {
                        TuristId = c.Int(nullable: false, identity: true),
                        TuristFirstName = c.String(nullable: false, maxLength: 25),
                        TuristLastName = c.String(nullable: false, maxLength: 25),
                        Phone = c.String(nullable: false, maxLength: 25),
                        Gender = c.String(nullable: false, maxLength: 6),
                        Birthday = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TuristId);
            
            AddColumn("dbo.UserProfile", "TuristId", c => c.Int());
            DropForeignKey("dbo.HikeTourist", "TouristId", "dbo.Tourist");
            DropForeignKey("dbo.HikeTourist", "HikeId", "dbo.Hike");
            DropIndex("dbo.HikeTourist", new[] { "TouristId" });
            DropIndex("dbo.HikeTourist", new[] { "HikeId" });
            DropColumn("dbo.UserProfile", "TouristId");
            DropTable("dbo.Tourist");
            DropTable("dbo.HikeTourist");
            CreateIndex("dbo.HikeTurist", "TuristId");
            CreateIndex("dbo.HikeTurist", "HikeId");
            AddForeignKey("dbo.HikeTurist", "TuristId", "dbo.Turist", "TuristId", cascadeDelete: true);
            AddForeignKey("dbo.HikeTurist", "HikeId", "dbo.Hike", "HikeId", cascadeDelete: true);
        }
    }
}
