using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace DXInfo.Identity.Dapper
{
    public class UserRolesTable
    {
        private IdentityDbContext db;
        public UserRolesTable(IdentityDbContext database)
        {
            db = database;
        }
        public List<string> FindByUserId(int userId)
        {
            return db.Connection.Query<string>("SELECT b.Name FROM UserRoles a"
+ " LEFT JOIN Roles b on a.RoleId = b.Id"
+ " WHERE a.UserId = @UserId",new { UserId = userId }).ToList();
        }
        public void Delete(int memberId)
        {
            db.Connection.Execute(@"DELETE FROM UserRoles WHERE Id = @MemberId", new { MemberId = memberId });
        }
        public void Insert(int userId, int roleId)
        {
            db.Connection.Execute(@"ISNERT INTO UserRoles (UserId, RoleId) values (@UserId, @RoleId",
                new { UserId = userId, RoleId = roleId });
        }
    }
}
