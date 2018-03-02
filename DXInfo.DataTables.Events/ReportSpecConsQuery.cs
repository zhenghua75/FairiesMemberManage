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
    public class ReportSpecConsQuery
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportSpecConsQuerySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            string strDeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "DeptId").Search.Value;
            string strBeginDate = e.Http.Columns.FirstOrDefault(f => f.Data == "BeginDate").Search.Value;
            string strEndDate = e.Http.Columns.FirstOrDefault(f => f.Data == "EndDate").Search.Value;
            
            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE Table #T ("
                        + " Id int IDENTITY(1, 1) PRIMARY KEY,"
                        + " vcConsType nvarchar(max) NULL,"
                        + " vcGoodsName nvarchar(max)NULL,"
                        + " tolCount int NULL,"
                        + " tolfee money NULL,"
                        + " tolcash money NULL"
                        + "); ";
            conn.Execute(sql);

            sql = "INSERT INTO #T(vcConsType,vcGoodsName,tolCount,tolfee,tolcash)"
+ " SELECT a.vcConsType,c.Name AS vcGoodsName,"
+ "  SUM(b.iCount) AS tolCount, SUM(b.iCount * d.Price) AS tolfee, SUM(B.nFee) AS tolcash"
+ " FROM"
+ " (SELECT * FROM tbBillOther"
+ " where {DeptId} dtConsDate BETWEEN @BeginDate AND @EndDate"
+ " AND (vcConsType = 'PT003' OR  vcConsType = 'PT004' OR vcConsType = 'PT005' OR vcConsType = 'PT006' OR vcConsType = 'PT007')"
+ " ) AS a"
+ " LEFT JOIN"
+ " (SELECT * FROM tbConsItemOther where {DeptId} dtConsDate BETWEEN @BeginDate AND @EndDate AND cFlag = '0') AS b"
+ " ON a.vcDeptID = b.vcDeptID AND a.iSerial = b.iSerial"
+ " LEFT JOIN Inventory AS c on b.vcGoodsID = c.Code"
+ " LEFT JOIN InvSale AS d on c.Id = d.Id"
+ " GROUP BY a.vcConsType, c.Name";
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{DeptId}", "vcDeptID = @DeptId AND");
            }
            else
            {
                sql = sql.Replace("{DeptId}", "");
            }
            var p = new DynamicParameters();
            if (!string.IsNullOrEmpty(strDeptId))
            {
                p.Add("DeptId", strDeptId, DbType.String);
            }
            p.Add("BeginDate", strBeginDate, DbType.DateTime);
            p.Add("EndDate", strEndDate, DbType.DateTime);
            conn.Execute(sql, p, trans);
        }
    }
}
