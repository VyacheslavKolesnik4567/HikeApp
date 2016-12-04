using HikeApp.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using HikeApp.Domain.Core;

namespace HikeApp.Infrastructure.Data
{
    public class HikePhotoRepository : IHikePhotoRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public HikePhotoRepository()
        {
            this.db = new HikeContext();
        }

        public void Create(HikePhoto item)
        {
            db.HikePhotos.Add(item);
        }

        public void Delete(int id)
        {
            HikePhoto hikePhoto = db.HikePhotos.Find(id);
            if (hikePhoto != null)
                db.HikePhotos.Remove(hikePhoto);
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

        public IEnumerable<HikePhoto> GetHikePhotosList()
        {
            return db.HikePhotos.ToList();
        }

        public void Save()
        {
            db.SaveChanges();
        }
    }
}
