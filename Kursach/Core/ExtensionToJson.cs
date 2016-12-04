using Newtonsoft.Json;
using System;

namespace HikeApp.Core
{
    public static class ExtensionMethods
    {
            public static string ToJson(this Object obj)
            {
                return JsonConvert.SerializeObject(obj);
            }
    }
}
