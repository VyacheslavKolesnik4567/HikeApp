using HikeApp.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using HikeApp.Domain.Core;

namespace HikeApp.Infrastructure.Data
{
    public class HikeTouristRepository : IHikeTouristRepository
    {
        private HikeContext db;

        public HikeTouristRepository(HikeContext db)
        {
            this.db = db;
        }

        public void Create(HikeTourist item)
        {
            db.HikeTurists.Add(item);
        }

        public void Delete(int id)
        {
            HikeTourist hikeTurist = db.HikeTurists.Find(id);
            if (hikeTurist != null)
                db.HikeTurists.Remove(hikeTurist);
        }

        public HikeTourist GetHikeTourist(int id)
        {
            return db.HikeTurists.Find(id);
        }

        public IEnumerable<HikeTourist> GetHikeTouristsList()
        {
            return db.HikeTurists.ToList();
        }

        public void Update(HikeTourist item)
        {
            var target = db.HikeTurists.Find(item.HikeTouristId);

            target.TouristId = item.TouristId;
            target.KayakNumber = item.KayakNumber;
            target.PlaceNumber = item.PlaceNumber;
            target.Confirmed = item.Confirmed;
            db.Entry<HikeTourist>(target).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
