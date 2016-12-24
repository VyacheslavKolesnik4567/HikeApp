using HikeApp.Domain.Interfaces;
using HikeApp.Infrastructure.Data;
using Ninject;
using System;
using System.Collections.Generic;

namespace HikeApp.Util
{
    public class NinjectDependencyResolver : System.Web.Mvc.IDependencyResolver
    {
        private IKernel kernel;
 
        public NinjectDependencyResolver(IKernel kernelParam)
        {
            kernel = kernelParam;
            AddBindings();
        }

        public object GetService(Type serviceType)
        {
            return kernel.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return kernel.GetAll(serviceType);
        }

        private void AddBindings()
        {
            kernel.Bind<IUnitOfWork>().To<UnitOfWork>();
        }
    }
}