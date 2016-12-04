using HikeApp.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using HikeApp.Domain.Core;

namespace HikeApp.Infrastructure.Data
{
    public class PathRepository : IPathRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public PathRepository()
        {
            this.db = new HikeContext();
        }

        public void Create(Path item)
        {
            db.Paths.Add(item);
        }

        public void Delete(int id)
        {
            Path path = db.Paths.Find(id);
            if (path != null)
                db.Paths.Remove(path);
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

        public Path GetPath(int id)
        {
            return db.Paths.Find(id);
        }

        public IEnumerable<Path> GetPathsList()
        {
            return db.Paths.ToList();
        }

        public void Save()
        {
            db.SaveChanges();
        }

        public void Update(Path item)
        {
            db.Entry<Path>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
