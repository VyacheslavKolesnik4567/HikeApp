using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface ITouristRepository : IDisposable
    {
        IEnumerable<Tourist> GetTouristsList();
        Tourist GetTourist(int id);
        void Create(Tourist item);
        void Update(Tourist item);
        void Delete(int id);
        void Save();
    }
}
