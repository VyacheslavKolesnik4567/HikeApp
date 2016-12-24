using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IHikeRepository
    {
        IEnumerable<Hike> GetHikesList();
        Hike GetHike(int id);
        void Create(Hike item);
        void Update(Hike item);
        void Delete(int id);
    }
}
