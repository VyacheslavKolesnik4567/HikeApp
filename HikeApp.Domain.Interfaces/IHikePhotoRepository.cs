using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IHikePhotoRepository
    {
        IEnumerable<HikePhoto> GetHikePhotosList();
        void Create(HikePhoto item);
        void Delete(int id);
    }
}
