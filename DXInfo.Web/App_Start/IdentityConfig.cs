using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using DXInfo.Web.Models;
using System.Linq;
using System.Collections.Generic;
using DXInfo.Identity.Dapper;
using Dapper;

namespace DXInfo.Web
{
    // 配置此应用程序中使用的应用程序用户管理器。UserManager 在 ASP.NET Identity 中定义，并由此应用程序使用。

    public class ApplicationUserManager : UserManager<ApplicationUser, int>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser, int> store)
            : base(store)
        {
        }
        public NameCode GetNameCode(string type, int value)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.QueryFirstOrDefault<NameCode>("SELECT * FROM NameCode WHERE Type =@Type AND Value=@Value",
                        new { Type = type, Value = value });
                }

            }
            return null;
        }
        public NameCode GetNameCode(string type)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.QueryFirstOrDefault<NameCode>("SELECT * FROM NameCode WHERE Type =@Type",
                        new { Type = type});
                }

            }
            return null;
        }
        public List<Func> GetFuncs()
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context as IdentityDbContext;
                    return context.Connection.Query<Func>("SELECT * FROM Funcs WHERE Invalidate=0 ORDER BY FuncType,Sort").ToList();
                }

            }
            return new List<Func>();
        }
        public Func GetFunc(string funcName)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.QueryFirstOrDefault<Func>("SELECT * FROM Funcs WHERE Invalidate=0 AND Name=@Name",
                        new { Name = funcName });
                }

            }
            return null;
        }
        public List<Func> GetUserFuncs(int userId)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.Query<Func>("SELECT DISTINCT c.* FROM RoleFuncs a"
+ " LEFT JOIN UserRoles b on a.RoleId = b.RoleId"
+ " LEFT JOIN Funcs c on a.FuncId = c.Id"
+ " WHERE b.UserId = @UserId"
+ " ORDER BY c.Id",
                        new { UserId = userId }).ToList();
                }

            }
            return new List<Func>();
        }
        public Func GetUserFunc(int userId,string funcName)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.QueryFirstOrDefault<Func>("SELECT DISTINCT c.* FROM RoleFuncs a"
+ " LEFT JOIN UserRoles b on a.RoleId = b.RoleId"
+ " LEFT JOIN Funcs c on a.FuncId = c.Id"
+ " WHERE b.UserId = @UserId AND c.Name=@Name",
                        new { UserId = userId, Name = funcName });
                }

            }
            return null;
        }
        public List<IdentityRole> GetUserRoles(int userId)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.Query<IdentityRole>("SELECT b.* FROM UserRoles a"
+ " LEFT JOIN Roles b on a.RoleId = b.Id"
+ " WHERE a.UserId = @UserId",
                        new { UserId = userId }).ToList();
                }

            }
            return new List<IdentityRole>();
        }
        public Dept GetDept(int userId)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.QueryFirstOrDefault<Dept>("SELECT b.* FROM Users a"
+ " LEFT JOIN Depts b on a.DeptId = b.Id"
+ " WHERE a.Id = @Id",
                        new { Id = userId});
                }

            }
            return null;
        }
        public Warehouse GetWarehouse(int userId)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.QueryFirstOrDefault<Warehouse>("SELECT b.* FROM Users a"
+ " LEFT JOIN Warehouse b on a.WhId = b.Id"
+ " WHERE a.Id = @Id",
                        new { Id = userId });
                }

            }
            return null;
        }
        public int? GetWhId(int userId)
        {
            if (null != this.Store)
            {
                UserStore<ApplicationUser> cus = this.Store as UserStore<ApplicationUser>;
                if (null != cus.Context)
                {
                    IdentityDbContext context = cus.Context;
                    return context.Connection.ExecuteScalar<int?>("SELECT WhId FROM Users WHERE Id=@Id",
                        new { Id = userId });
                }

            }
            return null;
        }
        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
            //manager.UserLockoutEnabledByDefault = true;
            // 配置用户名的验证逻辑
            manager.UserValidator = new UserValidator<ApplicationUser, int>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = false
            };
            // 配置密码的验证逻辑
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 1,
                RequireNonLetterOrDigit = false,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser, int>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }
    }
}
