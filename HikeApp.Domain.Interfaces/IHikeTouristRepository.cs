using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IHikeTouristRepository : IDisposable
    {
        IEnumerable<HikeTourist> GetHikeTouristsList();
        HikeTourist GetHikeTourist(int id);
        void Create(HikeTourist item);
        void Update(HikeTourist item);
        void Delete(int id);
        void Save();
    }
}
