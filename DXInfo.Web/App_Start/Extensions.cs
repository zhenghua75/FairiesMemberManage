using DXInfo.Identity.Dapper;
using DXInfo.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Collections.Generic;
using System.Security.Principal;
using System.Web;

namespace DXInfo.Web
{
    public static class Extensions
    {
        public static ApplicationUser GetUser(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.FindById(identity.GetUserId<int>());
        }
        public static Dept GetDept(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.GetDept(identity.GetUserId<int>());
        }
        public static Warehouse GetWarehouse(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.GetWarehouse(identity.GetUserId<int>());
        }
        public static int? GetWhId(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.GetWhId(identity.GetUserId<int>());
        }
        public static bool GetIsBatch(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            NameCode nc = userManager.GetNameCode("IsBatch");
            if(null != nc)
            {
                bool IsBatch;
                if (bool.TryParse(nc.Code, out IsBatch))
                {
                    return IsBatch;
                }
            }
            
            return true;
        }
        public static bool GetIsLocator(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            NameCode nc = userManager.GetNameCode("IsLocator");
            if (null != nc)
            {
                bool IsLocator;
                if (bool.TryParse(nc.Code, out IsLocator))
                {
                    return IsLocator;
                }
            }
            return true;
        }
        public static bool GetIsShelfLife(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            NameCode nc = userManager.GetNameCode("IsShelfLife");
            if (null != nc)
            {
                bool IsShelfLife;
                if (bool.TryParse(nc.Code, out IsShelfLife))
                {
                    return IsShelfLife;
                }
            }
            return true;
        }
        public static bool GetScrapVouchVerify(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            NameCode nc = userManager.GetNameCode("ScrapVouchVerify");
            if (null != nc)
            {
                bool ScrapVouchVerify;
                if (bool.TryParse(nc.Code, out ScrapVouchVerify))
                {
                    return ScrapVouchVerify;
                }
            }
            return true;
        }
        public static Func GetFunc(this IIdentity identity, string funcname)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            Func func = userManager.GetFunc(funcname);
            if(null == func)
            {
                return null;
            }
            if (!func.IsAuthorize)
            {
                return func;
            }
            return userManager.GetUserFunc(identity.GetUserId<int>(), funcname);
        }
        public static List<Func> GetUserFuncs(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.GetUserFuncs(identity.GetUserId<int>());
        }
        public static List<Func> GetFuncs(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.GetFuncs();
        }
        public static List<IdentityRole> GetUserRoles(this IIdentity identity)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            return userManager.GetUserRoles(identity.GetUserId<int>());
        }
    }
}
