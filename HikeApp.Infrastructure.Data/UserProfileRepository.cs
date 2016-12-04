using HikeApp.Domain.Interfaces;
using System.Linq;
using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Infrastructure.Data
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private HikeContext db;
        private bool disposed = false;

        public UserProfileRepository()
        {
            this.db = new HikeContext();
        }

        public void Create(UserProfile item)
        {
            db.UserProfiles.Add(item);
        }

        public void Delete(int id)
        {
            UserProfile user = db.UserProfiles.Find(id);
            if (user != null)
                db.UserProfiles.Remove(user);
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

        public UserProfile GetUserProfile(int id)
        {
            return db.UserProfiles.Find(id);
        }

        public IEnumerable<UserProfile> GetUserProfilesList()
        {
            return db.UserProfiles.ToList();
        }

        public void Save()
        {
            db.SaveChanges();
        }

        public void Update(UserProfile item)
        {
            db.Entry<UserProfile>(item).State = System.Data.Entity.EntityState.Modified;
        }
    }
}
