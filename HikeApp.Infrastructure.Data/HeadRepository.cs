using HikeApp.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using HikeApp.Domain.Core;

namespace HikeApp.Infrastructure.Data
{
    public class HeadRepository : IHeadRepository
    {
        private HikeContext db;

        public HeadRepository(HikeContext db)
        {
            this.db = db;
        }

        public void Create(Head item)
        {
            db.Heads.Add(item);
        }

        public void Delete(int id)
        {
            Head head = db.Heads.Find(id);
            if (head != null)
                db.Heads.Remove(head);
        }

        public Head GetHead(int id)
        {
            return db.Heads.Find(id);
        }

        public IEnumerable<Head> GetHeadsList()
        {
            return db.Heads.ToList();
        }

        public void Update(Head item)
        {
            db.Entry<Head>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
