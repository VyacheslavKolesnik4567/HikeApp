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

        public CityRepository(HikeContext db)
        {
            this.db = db;
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

        public IEnumerable<City> GetCitiesList()
        {
            return db.Cities.ToList();
        }

        public City GetCity(int id)
        {
            return db.Cities.Find(id);
        }

        public void Update(City item)
        {
            db.Entry<City>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
