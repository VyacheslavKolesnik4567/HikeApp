using HikeApp.Domain.Core;
using System;
using System.Collections.Generic;

namespace HikeApp.Domain.Interfaces
{
    public interface IUserProfileRepository: IDisposable
    {
        IEnumerable<UserProfile> GetUserProfilesList();
        UserProfile GetUserProfile(int id);
        void Create(UserProfile item);
        void Update(UserProfile item);
        void Delete(int id);
        void Save();
    }
}
