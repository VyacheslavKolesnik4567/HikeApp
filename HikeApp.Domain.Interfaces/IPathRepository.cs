using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IPathRepository : IDisposable
    {
        IEnumerable<Path> GetPathsList();
        Path GetPath(int id);
        void Create(Path item);
        void Update(Path item);
        void Delete(int id);
        void Save();
    }
}
