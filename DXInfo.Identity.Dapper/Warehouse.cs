using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.Identity.Dapper
{
    public class Warehouse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Principal { get; set; }
        public string Tel { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public int DeptId { get; set; }
    }
}
