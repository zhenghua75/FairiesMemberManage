using Dapper;
using DataTables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.DataTables.Events
{
    public class StockManageRdSummary
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        private string ReplaceWhId(DtRequest.ColumnT WhId, string sql)
        {
            if (WhId != null && !string.IsNullOrEmpty(WhId.Search.Value))
            {
                return sql.Replace("{WhId}", "AND b.ToWhId = @WhId");
            }
            return sql.Replace("{WhId}", "");
        }
        private DynamicParameters GetPara(DtRequest.ColumnT WhId, DtRequest.ColumnT BeginDate,DtRequest.ColumnT EndDate)
        {
            var p = new DynamicParameters();
            if (WhId != null && !string.IsNullOrEmpty(WhId.Search.Value))
            {
                p.Add("WhId", WhId.Search.Value,DbType.Int32);
            }
            if (BeginDate == null || string.IsNullOrEmpty(BeginDate.Search.Value))
            {
                throw new ArgumentNullException("BeginDate");
            }
            if (EndDate == null || string.IsNullOrEmpty(EndDate.Search.Value))
            {
                throw new ArgumentNullException("EndDate");
            }
            
            p.Add("BeginDate", Convert.ToDateTime(BeginDate.Search.Value),DbType.Date);
            p.Add("EndDate", Convert.ToDateTime(EndDate.Search.Value), DbType.Date);
            return p;
        }
        private void executeSql(DtRequest.ColumnT WhId, DtRequest.ColumnT BeginDate,DtRequest.ColumnT EndDate, string sql)
        {
            sql = ReplaceWhId(WhId, sql);
            conn.Execute(sql, GetPara(WhId, BeginDate,EndDate), trans);
        }
        public void PreStockManageRdSummarySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT WhId = e.Http.Columns.FirstOrDefault(f => f.Data == "WhId");
            DtRequest.ColumnT BeginDate = e.Http.Columns.FirstOrDefault(f => f.Data == "BeginDate");
            DtRequest.ColumnT EndDate = e.Http.Columns.FirstOrDefault(f => f.Data == "EndDate");

            string sql = "IF OBJECT_ID('TEMPDB..#T1') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T1 ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [WhId] [int] NOT NULL,"
                        + " [InvId] [int] NOT NULL,"
                        + " [InitNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [InNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [OutNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [Num] [numeric](24, 9) NOT NULL DEFAULT(0)"
                        + "); ";
            conn.Execute(sql, null, trans);

            //--期初
            sql = "INSERT INTO #T1(WhId,InvId,InitNum)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num * c.Value) AS InitNum FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate < @BeginDate AND c.Value != 0 {WhId}"
+ " GROUP BY b.ToWhId,a.InvId";
            executeSql(WhId, BeginDate,EndDate, sql);
            //--收
            sql = "INSERT INTO #T1(WhId,InvId,InNum)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num) AS InNum FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate BETWEEN @BeginDate AND @EndDate AND c.Value > 0 {WhId}"
+ " GROUP BY b.ToWhId,a.InvId";
            executeSql(WhId, BeginDate, EndDate, sql);
            //--发
            sql = "INSERT INTO #T1(WhId,InvId,OutNum)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num) AS OutNum FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate BETWEEN @BeginDate AND @EndDate AND c.Value < 0 {WhId}"
+ " GROUP BY b.ToWhId,a.InvId";
            executeSql(WhId, BeginDate, EndDate, sql);
            //--存
            sql = "INSERT INTO #T1(WhId,InvId,Num)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num * c.Value) AS Num FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate <= @EndDate AND c.Value != 0 {WhId}"
+ " GROUP BY b.ToWhId,a.InvId";
            executeSql(WhId, BeginDate, EndDate, sql);
            sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [WhId] [int] NOT NULL,"
                        + " [InvId] [int] NOT NULL,"
                        + " [InitNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [InNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [OutNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [Num] [numeric](24, 9) NOT NULL DEFAULT(0)"
                        + "); ";
            conn.Execute(sql, null, trans);

            //汇总数据
            sql = "INSERT INTO #T(WhId,InvId,InitNum,InNum,OutNum,Num)"
+ " SELECT WhId,InvId,SUM(InitNum) AS InitNum,"
+ " SUM(InNum) AS InNum,"
+ " SUM(OutNum)AS OutNum,"
+ " SUM(Num) AS Num FROM #T1"
+ " GROUP BY WhId, InvId"
+ " ORDER BY WhId, InvId";
            conn.Execute(sql, null, trans);

            e.Http.Columns.RemoveAll(a => a.Data == "WhId" || a.Data == "BeginDate" || a.Data == "EndDate");
        }
    }
}
