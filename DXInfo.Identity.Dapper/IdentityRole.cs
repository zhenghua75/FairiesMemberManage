using Microsoft.AspNet.Identity;
using System;

namespace DXInfo.Identity.Dapper
{
    public class IdentityRole : IRole<int>
    {
        public IdentityRole()
        {
        }
        public IdentityRole(string name) : this()
        {
            Name = name;
        }

        public IdentityRole(string name, int id)
        {
            Name = name;
            Id = id;
        }

        public int Id { get; set; }

        public string Name { get; set; }
    }
}
