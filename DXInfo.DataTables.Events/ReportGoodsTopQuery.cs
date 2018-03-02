using Dapper;
using DataTables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.DataTables.Events
{
    public class ReportGoodsTopQuery
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportGoodsTopQuerySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT DeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcDeptId");
            DtRequest.ColumnT dtConsDate = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.dtConsDate");
            
            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE Table #T ("
                        + " Id int IDENTITY(1, 1) PRIMARY KEY,"
                        + " vcDeptId nvarchar(max)NULL,"
                        + " vcGoodsId nvarchar(max)NULL,"
                        + " vcGoodsName nvarchar(max) NULL,"
                        + " vcGoodsType nvarchar(max) NULL,"
                        + " SaleCount int NULL,"
                        + " nFee money NULL,"
                        + " dtConsDate datetime NULL"
                        + "); ";
            conn.Execute(sql,null,trans);

            sql = "INSERT INTO #T(vcGoodsId,vcGoodsName,vcGoodsType,SaleCount,nFee)"
+ " SELECT a.vcGoodsId,c.Name AS vcGoodsName,c.Name AS vcGoodsType,SUM(iCount) AS SaleCount, SUM(nFee)AS nFee "
+ " FROM tbConsItemOther AS a"
+ " LEFT JOIN Inventory AS b on a.vcGoodsID = b.Code"
+ " LEFT JOIN InvCategory AS c on b.Category = c.Id"
+ " WHERE {DeptId} a.cFlag = '0' {dtConsDate}"
+ " GROUP BY a.vcGoodsID, b.Name, c.Name";
            
            if (DeptId !=null && !string.IsNullOrEmpty(DeptId.Search.Value))
            {
                sql = sql.Replace("{DeptId}", "a.vcDeptID "+DeptId.Search.Value+" AND");
                DeptId.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{DeptId}", "");
            }
            if(dtConsDate !=null && !string.IsNullOrEmpty(dtConsDate.Search.Value))
            {
                sql = sql.Replace("{dtConsDate}", "AND a.dtConsDate " + dtConsDate.Search.Value);
                dtConsDate.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{dtConsDate}", "");
            }
            
            conn.Execute(sql, null, trans);
        }
    }
}
