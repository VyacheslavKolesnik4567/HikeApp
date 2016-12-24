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

        public HikePhotoRepository(HikeContext db)
        {
            this.db = db;
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

        public IEnumerable<HikePhoto> GetHikePhotosList()
        {
            return db.HikePhotos.ToList();
        }
    }
}
