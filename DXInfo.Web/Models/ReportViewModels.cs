using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.Web.Models
{
    //public class tbAssociatorViewModel
    //{
    //    public class tbAssociator
    //    {
    //        public string vcCardID { get; set; }
    //        public string vcAssName { get; set; }
    //        public string vcLinkPhone { get; set; }
    //        public string vcSpell { get; set; }
    //        //public string vcAssType { get; set; }
    //        //public string vcAssState { get; set; }
    //        public decimal nCharge { get; set; }
    //        public decimal iIgValue { get; set; }
    //        //public string vcDeptID { get; set; }
    //        //public DateTime dtCreateDate { get; set; }
    //        public string vcAssNbr { get; set; }
    //        public string vcLinkAddress { get; set; }
    //        public string vcEmail { get; set; }
    //        //public DateTime dtOperDate { get; set; }
    //        public string vcComments { get; set; }
    //    }
        
    //    public class tbCommCodeAT
    //    {
    //        public string vcCommName { get; set; }
    //    }
    //    public class tbCommCodeAS
    //    {
    //        public string vcCommName { get; set; }
    //    }
    //    public class Depts
    //    {
    //        public string DeptName { get; set; }
    //    }
    //}
    public class vwConsDetailViewModel
    {
        public class vwConsDetail
        {
            public Int64 iSerial { get; set; }
            public string vcCardID { get; set; }
            public string vcGoodsID { get; set; }
            public decimal nPrice { get; set; }
            public int iCount { get; set; }
            public decimal nFee { get; set; }
            //public string vcConsType { get; set; }
            public string vcComments { get; set; }
            //public string cFlag { get; set; }//0 正常 9 撤销
            //public DateTime dtConsDate { get; set; }
            //public string vcOperName { get; set; }
            //public string vcDeptID { get; set; }
        }
        public class tbAssociator
        {
            public string vcAssName { get; set; }
            public string vcAssType { get; set; }
        }
        public class tbGoods
        {
            public string vcGoodsName { get; set; }
        }
        public class tbCommCodePT
        {
            public string vcCommName { get; set; }
        }
        public class tbCommCodeFlag
        {
            public string vcCommName { get; set; }
        }
        public class Depts
        {
            public string DeptName { get; set; }
        }
        public class tbCommCodeAT
        {
            public string vcCommName { get; set; }
        }
    }
}
