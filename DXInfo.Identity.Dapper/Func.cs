using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.Identity.Dapper
{
    public class Func
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public int? ParentId { get; set; }
        public int FuncType { get; set; }
        public bool IsAuthorize { get; set; }
        public bool IsMenu { get; set; }
        public int Sort { get; set; }
        public bool Invalidate { get; set; }
    }
}
