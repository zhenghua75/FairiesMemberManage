using DataTables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace DXInfo.DataTables.Events
{
    public class ReportConsKindQuery
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportConsKindQuerySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            DtRequest.ColumnT vcDeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcDeptId");
            DtRequest.ColumnT vcAssType = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcAssType");
            DtRequest.ColumnT vcGoodsType = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcGoodsType");
            DtRequest.ColumnT vcGoodsName = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcGoodsName");
            DtRequest.ColumnT dtConsDateCol = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.dtConsDate");

            string dtConsDate = dtConsDateCol.Search.Value;
            dtConsDateCol.Search.Value = "";
            
            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE Table #T ("
                        + " Id int IDENTITY(1, 1) PRIMARY KEY,"
                        + " vcDeptId nvarchar(max) NULL,"
                        + " vcAssType nvarchar(max) NULL,"
                        + " vcGoodsType nvarchar(max)NULL,"
                        + " vcGoodsName nvarchar(max) NULL,"
                        + " dtConsDate datetime NULL,"
                        + " tolcount int NULL,"
                        + " tolfee money NULL"
                        + "); ";
            conn.Execute(sql,null,trans);

            sql = "INSERT INTO #T(vcDeptId,vcAssType,vcGoodsType,vcGoodsName,tolcount,tolfee)"
+ " SELECT {fields},SUM(iCount) AS tolcount, SUM(nFee)AS tolfee FROM tbConsItemOther AS a"
+ " LEFT JOIN tbAssociator AS b ON a.iAssId = b.iAssId"
+ " LEFT JOIN Inventory AS c on a.vcGoodsID = c.Code"
+ " LEFT JOIN InvCategory AS d on c.Category = d.Id"
+ " WHERE {DeptId} a.cFlag = '0' AND a.dtConsDate {dtConsDate} {vcAssType} {vcGoodsType} {vcGoodsName}";

            List<string> groupby = new List<string>();
            List<string> fields = new List<string>();
            if (vcDeptId !=null && vcDeptId.Groupable)
            {
                groupby.Add("a.vcDeptId");
                fields.Add("a.vcDeptId");
            }
            else
            {
                fields.Add("'' AS vcDeptId");
            }
            if (vcAssType != null && vcAssType.Groupable)
            {
                groupby.Add("b.vcAssType");
                fields.Add("b.vcAssType");
            }
            else
            {
                fields.Add("'' AS vcAssType");
            }
            if (vcGoodsType != null && vcGoodsType.Groupable)
            {
                groupby.Add("d.Code");
                fields.Add("d.Code AS vcGoodsType");
            }
            else
            {
                fields.Add("'' AS vcGoodsType");
            }
            if (vcGoodsName != null && vcGoodsName.Groupable)
            {
                groupby.Add("c.Name");
                fields.Add("c.Name AS vcGoodsName");
            }
            else
            {
                fields.Add("'' AS vcGoodsName");
            }
            if (groupby.Count > 0)
            {
                sql += " GROUP BY " + string.Join(",", groupby.ToArray());
            }
            sql = sql.Replace("{fields}", string.Join(",", fields.ToArray()));
            
            sql = sql.Replace("{dtConsDate}", dtConsDate);
            if (vcDeptId != null && !string.IsNullOrEmpty(vcDeptId.Search.Value))
            {
                sql = sql.Replace("{DeptId}", "a.vcDeptID "+vcDeptId.Search.Value+" AND");
                vcDeptId.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{DeptId}", "");
            }
            if (vcAssType != null && !string.IsNullOrEmpty(vcAssType.Search.Value))
            {
                sql = sql.Replace("{vcAssType}", " AND b.vcAssType "+vcAssType.Search.Value);
                vcAssType.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{vcAssType}", "");
            }
            if (vcGoodsType != null && !string.IsNullOrEmpty(vcGoodsType.Search.Value))
            {
                sql = sql.Replace("{vcGoodsType}", " AND d.Code "+vcGoodsType.Search.Value);
                vcGoodsType.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{vcGoodsType}", "");
            }
            if (vcGoodsName != null && !string.IsNullOrEmpty(vcGoodsName.Search.Value))
            {
                sql = sql.Replace("{vcGoodsName}", " AND c.Name "+vcGoodsName.Search.Value);
                vcGoodsName.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{vcGoodsName}", "");
            }
            conn.Execute(sql, null, trans);
            
        }
    }
}
