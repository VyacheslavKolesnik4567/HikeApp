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

        public TouristRepository(HikeContext db)
        {
            this.db = db;
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

        public Tourist GetTourist(int id)
        {
            return db.Turists.Find(id);
        }

        public IEnumerable<Tourist> GetTouristsList()
        {
            return db.Turists.ToList();
        }

        public void Update(Tourist item)
        {
            db.Entry<Tourist>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
