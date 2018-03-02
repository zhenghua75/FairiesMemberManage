using DataTables;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using Dapper;
namespace DXInfo.DataTables.Events
{
    public class InvSale
    {
        
        public void PreInvSaleCreate(object sender, PreCreateEventArgs e)
        {
            IDbConnection conn = e.Editor.Db().Conn();
            IDbTransaction trans = e.Editor.Db().Trans();

            Dictionary<string, object> fields = e.Values["Inventory"] as Dictionary<string, object>;


            string categoryCode = conn.ExecuteScalar<string>("SELECT Code FROM InvCategory WHERE Id=@Id", new {Id= Convert.ToInt32(fields["Category"]) }, trans);


            if (string.IsNullOrEmpty(categoryCode))
            {
                throw new ArgumentNullException("InvCategory");
            }


            if (!categoryCode.Any(c => c == '-'))
            {
                throw new ArgumentException("分类编码错误，应为99-99的方式");
            }
            string[] goodsTypes = categoryCode.Split('-');
            int minId = Convert.ToInt32(goodsTypes[0].PadRight(9, '0'));
            int maxId = Convert.ToInt32(goodsTypes[1].PadRight(9, '9'));

            int goodsId = conn.ExecuteScalar<int>("SELECT MAX(CAST(Code AS INT))+1 FROM Inventory WHERE Category=@Category", new { Category = Convert.ToInt32(fields["Category"]) }, trans);
            if (goodsId < minId) goodsId = minId;
            if (goodsId > maxId) throw new ArgumentException("商品编码已超过范围");
            fields.Add("Code", goodsId.ToString());
        }
    }
}
