using System;
using System.Collections.Generic;
using HikeApp.Domain.Core;
using HikeApp.Domain.Interfaces;
using System.Linq;

namespace HikeApp.Infrastructure.Data
{
    public class CityRepository : ICityRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public CityRepository()
        {
            this.db = new HikeContext();
        }

        public void Create(City item)
        {
            db.Cities.Add(item);
        }

        public void Delete(int id)
        {
            City city = db.Cities.Find(id);
            if (city != null)
                db.Cities.Remove(city);
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

        public IEnumerable<City> GetCitiesList()
        {
            return db.Cities.ToList();
        }

        public City GetCity(int id)
        {
            return db.Cities.Find(id);
        }

        public void Save()
        {
            db.SaveChanges();
        }

        public void Update(City item)
        {
            db.Entry<City>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
