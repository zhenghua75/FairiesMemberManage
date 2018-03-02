using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.Identity.Dapper
{
    public class Dept
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? Manager { get; set; }
        public string Comment { get; set; }
        public bool IsDeptPrice { get; set; }
        public int DeptType { get; set; }
        public int? ParentId { get; set; }
    }
}
