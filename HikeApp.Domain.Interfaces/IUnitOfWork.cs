using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HikeApp.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        void Save();
        ICityRepository Cities { get; }
        IUserProfileRepository UserProfiles { get; }
        ITouristRepository Tourists { get; }
        IHikePhotoRepository HikePhotos { get; }
        IHikeTouristRepository HikeTourists { get; }
        IHeadRepository Heads { get; }
        IPathRepository Paths { get; }
        IKayakRepository Kayaks { get; }
        IHikeRepository Hikes { get; }
    }
}
