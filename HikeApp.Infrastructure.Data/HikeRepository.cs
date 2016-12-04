using System;
using System.Collections.Generic;
using HikeApp.Domain.Core;
using HikeApp.Domain.Interfaces;
using System.Linq;

namespace HikeApp.Infrastructure.Data
{
    public class HikeRepository : IHikeRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public HikeRepository ()
        {
            this.db = new HikeContext();
        }

        public void Create(Hike item)
        {
            db.Hikes.Add(item);
        }

        public void Delete(int id)
        {
            Hike hike = db.Hikes.Find(id);
            if (hike != null)
                db.Hikes.Remove(hike);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    db.Dispose();
                }
            }
            this.disposed = true;
        }

        public Hike GetHike(int id)
        {
            return db.Hikes.Find(id);
        }

        public IEnumerable<Hike> GetHikesList()
        {
            return db.Hikes.ToList();
        }

        public void Save()
        {
            db.SaveChanges();
        }

        public void Update(Hike item)
        {
            db.Entry<Hike>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
