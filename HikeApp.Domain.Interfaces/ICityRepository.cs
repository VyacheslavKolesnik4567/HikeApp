using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface ICityRepository : IDisposable
    {
        IEnumerable<City> GetCitiesList();
        City GetCity(int id);
        void Create(City item);
        void Update(City item);
        void Delete(int id);
        void Save();
    }
}
