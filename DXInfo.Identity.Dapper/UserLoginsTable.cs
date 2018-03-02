using Microsoft.AspNet.Identity;
using Dapper;
using System.Collections.Generic;
using System.Linq;

namespace DXInfo.Identity.Dapper
{
    public class UserLoginsTable
    {
        private IdentityDbContext db;
        public UserLoginsTable(IdentityDbContext database)
        {
            db = database;
        }
        public void Delete(int userId, UserLoginInfo login)
        {
            db.Connection.Execute("DELETE FROM UserLogins WHERE UserId = @UserId AND LoginProvider = @LoginProvider AND ProviderKey = @ProviderKey",
                new
                {
                    UserId = userId,
                    LoginProvider = login.LoginProvider,
                    ProviderKey = login.ProviderKey
                });
        }
        public void Delete(int userId)
        {
            db.Connection.Execute(@"DELETE FROM UserLogins WHERE UserId = @UserId",
                new
                {
                    UserId = userId
                });
        }
        public void Insert(int userId, UserLoginInfo login)
        {
            db.Connection.Execute(@"INSERT INTO UserLogins(LoginProvider, ProviderKey, UserId)VALUES(@LoginProvider, @ProviderKey, @UserId)",
                    new
                    {
                        LoginProvider = login.LoginProvider,
                        ProviderKey = login.ProviderKey,
                        UserId = userId
                    });
        }
        public int FindUserIdByLogin(UserLoginInfo MemberLogin)
        {
            return db.Connection.ExecuteScalar<int>(@"SELECT UserId FROM UserLogins WHERE LoginProvider = @LoginProvider and ProviderKey = @ProviderKey",
                        new
                        {
                            LoginProvider = MemberLogin.LoginProvider,
                            ProviderKey = MemberLogin.ProviderKey
                        });
        }
        public List<UserLoginInfo> FindByUserId(int userId)
        {
            return db.Connection.Query<UserLoginInfo>("SELECT * FROM UserLogins WHERE UserId = @UserId",
                new
                {
                    UserId = userId
                }).ToList();
        }
    }
}
