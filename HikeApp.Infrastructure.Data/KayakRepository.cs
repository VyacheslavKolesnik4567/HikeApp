using HikeApp.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using HikeApp.Domain.Core;

namespace HikeApp.Infrastructure.Data
{
    public class KayakRepository : IKayakRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public KayakRepository()
        {
            this.db = new HikeContext();
        }

        public void Create(Kayak item)
        {
            db.Kayaks.Add(item);
        }

        public void Delete(int id)
        {
            Kayak kayak = db.Kayaks.Find(id);
            if (kayak != null)
                db.Kayaks.Remove(kayak);
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

        public Kayak GetKayak(int id)
        {
            return db.Kayaks.Find(id);
        }

        public IEnumerable<Kayak> GetKayaksList()
        {
            return db.Kayaks.ToList();
        }

        public void Save()
        {
            db.SaveChanges();
        }

        public void Update(Kayak item)
        {
            db.Entry<Kayak>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
