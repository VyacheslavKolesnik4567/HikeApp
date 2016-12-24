using HikeApp.Domain.Interfaces;
using System;

namespace HikeApp.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private HikeContext db;
        private bool disposed = false;
        IHikeRepository hikeRepository;
        IKayakRepository kayakRepository;
        IPathRepository pathRepository;
        IHikeTouristRepository hikeTouristRepository;
        IHeadRepository headRepository;
        IHikePhotoRepository hikePhotoRepository;
        ITouristRepository touristRepository;
        IUserProfileRepository userProfileRepository;
        ICityRepository cityRepository;

        public UnitOfWork()
        {
            this.db = new HikeContext();
        }

        public ICityRepository Cities
        {
            get
            {
                if (cityRepository == null)
                    cityRepository = new CityRepository(db);
                return cityRepository;
            }
        }

        public IUserProfileRepository UserProfiles
        {
            get
            {
                if (userProfileRepository == null)
                    userProfileRepository = new UserProfileRepository(db);
                return userProfileRepository;
            }
        }

        public ITouristRepository Tourists
        {
            get
            {
                if (touristRepository == null)
                    touristRepository = new TouristRepository(db);
                return touristRepository;
            }
        }

        public IHikePhotoRepository HikePhotos
        {
            get
            {
                if (hikePhotoRepository == null)
                    hikePhotoRepository = new HikePhotoRepository(db);
                return hikePhotoRepository;
            }
        }

        public IHeadRepository Heads
        {
            get
            {
                if (headRepository == null)
                    headRepository = new HeadRepository(db);
                return headRepository;
            }
        }

        public IHikeTouristRepository HikeTourists
        {
            get
            {
                if (hikeTouristRepository == null)
                    hikeTouristRepository = new HikeTouristRepository(db);
                return hikeTouristRepository;
            }
        }

        public IPathRepository Paths
        {
            get
            {
                if (pathRepository == null)
                    pathRepository = new PathRepository(db);
                return pathRepository;
            }
        }

        public IKayakRepository Kayaks
        {
            get
            {
                if (kayakRepository == null)
                    kayakRepository = new KayakRepository(db);
                return kayakRepository;
            }
        }

        public IHikeRepository Hikes
        {
            get
            {
                if (hikeRepository == null)
                    hikeRepository = new HikeRepository(db);
                return hikeRepository;
            }
        }

        public void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    db.Dispose();
                }
                this.disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Save()
        {
            db.SaveChanges();
        }
    }
}
