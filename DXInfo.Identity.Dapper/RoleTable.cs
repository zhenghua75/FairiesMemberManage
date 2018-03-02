using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Linq;

namespace DXInfo.Identity.Dapper
{
    public class RoleTable
    {
        private IdentityDbContext db;
        public RoleTable(IdentityDbContext database)
        {
            db = database;
        }
        public void Delete(int id)
        {
            db.Connection.Execute(@"DELETE FROM Roles WHERE Id = @Id", new { Id = id });
        }
        public void Insert(string name)
        {
            db.Connection.Execute(@"INSERT INTO Roles (Name) VALUES (@Name)",
                new { Name = name });
        }
        public string GetRoleName(int id)
        {
            return db.Connection.ExecuteScalar<string>("SELECT Name FROM Roles WHERE Id=@Id", new { Id = id });
        }
        public int GetRoleId(string name)
        {
            return db.Connection.ExecuteScalar<int>("SELECT Id FROM Role WHERE Name=@Name", new { name = name });
        }
        public IdentityRole GetRoleById(int id)
        {
            return db.Connection.QueryFirstOrDefault<IdentityRole>("SELEC * FROM Roles WHERE Id=@Id", new { Id = id });
        }
        public IdentityRole GetRoleByName(string name)
        {
            return db.Connection.QueryFirstOrDefault<IdentityRole>("SELEC * FROM Roles WHERE Name=@Name", new { Name = name });
        }
        public void Update(int id, string name)
        {
            db.Connection.Execute("UPDATE Role SET Name = @Name WHERE Id = @Id", new { Name = name, Id = id });
        }
    }
}
