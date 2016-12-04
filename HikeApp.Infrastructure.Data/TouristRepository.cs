using HikeApp.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HikeApp.Domain.Core;

namespace HikeApp.Infrastructure.Data
{
    public class TouristRepository : ITouristRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public TouristRepository()
        {
            this.db = new HikeContext();
        }

        public void Create(Tourist item)
        {
            db.Turists.Add(item);
        }

        public void Delete(int id)
        {
            Tourist turist = db.Turists.Find(id);
            if (turist != null)
                db.Turists.Remove(turist);
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

        public Tourist GetTourist(int id)
        {
            return db.Turists.Find(id);
        }

        public IEnumerable<Tourist> GetTouristsList()
        {
            return db.Turists.ToList();
        }

        public void Save()
        {
            db.SaveChanges();
        }

        public void Update(Tourist item)
        {
            db.Entry<Tourist>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
