using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace DXInfo.Identity.Dapper
{
    public class RoleStore : IQueryableRoleStore<IdentityRole, int>
    {
        private RoleTable roleTable;
        public IdentityDbContext Database { get; private set; }
        public IQueryable<IdentityRole> Roles
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public RoleStore(IdentityDbContext database)
        {
            Database = database;
            roleTable = new RoleTable(database);
        }

        public Task CreateAsync(IdentityRole role)
        {
            if (role == null)
            {
                throw new ArgumentNullException("role");
            }

            roleTable.Insert(role.Name);

            return Task.FromResult<object>(null);
        }

        public Task DeleteAsync(IdentityRole role)
        {
            if (role == null)
            {
                throw new ArgumentNullException("user");
            }

            roleTable.Delete(role.Id);

            return Task.FromResult<Object>(null);
        }

        public Task<IdentityRole> FindByIdAsync(int roleId)
        {
            IdentityRole result = roleTable.GetRoleById(roleId);

            return Task.FromResult<IdentityRole>(result);
        }

        public Task<IdentityRole> FindByNameAsync(string roleName)
        {
            IdentityRole result = roleTable.GetRoleByName(roleName);

            return Task.FromResult<IdentityRole>(result);
        }

        public Task UpdateAsync(IdentityRole role)
        {
            if (role == null)
            {
                throw new ArgumentNullException("user");
            }

            roleTable.Update(role.Id, role.Name);

            return Task.FromResult<Object>(null);
        }

        public void Dispose()
        {
            if (Database != null)
            {
                Database.Dispose();
                Database = null;
            }
        }

    }
}
