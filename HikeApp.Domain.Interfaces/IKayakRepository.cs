using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IKayakRepository
    {
        IEnumerable<Kayak> GetKayaksList();
        Kayak GetKayak(int id);
        void Create(Kayak item);
        void Update(Kayak item);
        void Delete(int id);
    }
}
