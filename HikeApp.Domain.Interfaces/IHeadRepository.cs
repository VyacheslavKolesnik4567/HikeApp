using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IHeadRepository : IDisposable
    {
        IEnumerable<Head> GetHeadsList();
        Head GetHead(int id);
        void Create(Head item);
        void Update(Head item);
        void Delete(int id);
        void Save();
    }
}
