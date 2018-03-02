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
    public class StockManageLocatorSummary
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        private string ReplacePara(DtRequest.ColumnT WhId,DtRequest.ColumnT LocatorId, string sql)
        {
            if (WhId != null && !string.IsNullOrEmpty(WhId.Search.Value))
            {
                sql =  sql.Replace("{WhId}", "AND b.ToWhId = @WhId");
            }
            else
            {
                sql = sql.Replace("{WhId}", "");
            }
            if (LocatorId != null && !string.IsNullOrEmpty(LocatorId.Search.Value))
            {
                sql = sql.Replace("{LocatorId}", "AND a.ToLocatorId = @LocatorId");
            }
            else
            {
                sql = sql.Replace("{LocatorId}", "");
            }
            return sql;
        }
        private DynamicParameters GetPara(DtRequest.ColumnT WhId,DtRequest.ColumnT LocatorId, DtRequest.ColumnT BeginDate, DtRequest.ColumnT EndDate)
        {
            var p = new DynamicParameters();
            if (WhId != null && !string.IsNullOrEmpty(WhId.Search.Value))
            {
                p.Add("WhId", WhId.Search.Value, DbType.Int32);
            }
            if (LocatorId != null && !string.IsNullOrEmpty(LocatorId.Search.Value))
            {
                p.Add("LocatorId", LocatorId.Search.Value, DbType.Int32);
            }
            if (BeginDate == null || string.IsNullOrEmpty(BeginDate.Search.Value))
            {
                throw new ArgumentNullException("BeginDate");
            }
            if (EndDate == null || string.IsNullOrEmpty(EndDate.Search.Value))
            {
                throw new ArgumentNullException("EndDate");
            }

            p.Add("BeginDate", Convert.ToDateTime(BeginDate.Search.Value), DbType.Date);
            p.Add("EndDate", Convert.ToDateTime(EndDate.Search.Value), DbType.Date);
            return p;
        }
        private void executeSql(DtRequest.ColumnT WhId,DtRequest.ColumnT LocatorId, DtRequest.ColumnT BeginDate, DtRequest.ColumnT EndDate, string sql)
        {
            sql = ReplacePara(WhId,LocatorId, sql);
            conn.Execute(sql, GetPara(WhId, LocatorId, BeginDate, EndDate), trans);
        }
        public void PreStockManageLocatorSummarySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT WhId = e.Http.Columns.FirstOrDefault(f => f.Data == "WhId");
            DtRequest.ColumnT BeginDate = e.Http.Columns.FirstOrDefault(f => f.Data == "BeginDate");
            DtRequest.ColumnT EndDate = e.Http.Columns.FirstOrDefault(f => f.Data == "EndDate");
            DtRequest.ColumnT LocatorId = e.Http.Columns.FirstOrDefault(f => f.Data == "LocatorId");

            string sql = "IF OBJECT_ID('TEMPDB..#T1') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T1 ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [WhId] [int] NOT NULL,"
                        + " [InvId] [int] NOT NULL,"
                        + " [LocatorId] [int] NOT NULL,"
                        + " [InitNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [InNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [OutNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [Num] [numeric](24, 9) NOT NULL DEFAULT(0)"
                        + "); ";
            conn.Execute(sql, null, trans);

            //--期初
            sql = "INSERT INTO #T1(WhId,InvId,LocatorId,InitNum)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num * c.Value) AS InitNum FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate < @BeginDate AND c.Value != 0 {WhId} {LocatorId}"
+ " GROUP BY b.ToWhId,a.InvId,a.LocatorId";
            executeSql(WhId,LocatorId, BeginDate, EndDate, sql);
            //--收
            sql = "INSERT INTO #T1(WhId,InvId,LocatorId,InNum)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num) AS InNum FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate BETWEEN @BeginDate AND @EndDate AND c.Value > 0 {WhId} {LocatorId}"
+ " GROUP BY b.ToWhId,a.InvId,a.LocatorId";
            executeSql(WhId, LocatorId, BeginDate, EndDate, sql);
            //--发
            sql = "INSERT INTO #T1(WhId,InvId,LocatorId,OutNum)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num) AS OutNum FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate BETWEEN @BeginDate AND @EndDate AND c.Value < 0 {WhId} {LocatorId}"
+ " GROUP BY b.ToWhId,a.InvId,a.LocatorId";
            executeSql(WhId, LocatorId, BeginDate, EndDate, sql);
            //--存
            sql = "INSERT INTO #T1(WhId,InvId,LocatorId,Num)"
+ " SELECT b.ToWhId,a.InvId,SUM(a.Num * c.Value) AS Num FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " LEFT JOIN (SELECT * FROM NameCode WHERE Type = 'VouchType') AS c ON b.VouchType = c.Code"
+ " WHERE b.VouchDate <= @EndDate AND c.Value != 0 {WhId} {LocatorId}"
+ " GROUP BY b.ToWhId,a.InvId,a.LocatorId";
            executeSql(WhId, LocatorId, BeginDate, EndDate, sql);
            sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [WhId] [int] NOT NULL,"
                        + " [InvId] [int] NOT NULL,"
                        + " [LocatorId] [int] NOT NULL,"
                        + " [InitNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [InNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [OutNum] [numeric](24, 9) NOT NULL DEFAULT(0),"
                        + " [Num] [numeric](24, 9) NOT NULL DEFAULT(0)"
                        + "); ";
            conn.Execute(sql, null, trans);

            //汇总数据
            sql = "INSERT INTO #T(WhId,InvId,LocatorId,InitNum,InNum,OutNum,Num)"
+ " SELECT WhId,InvId,LocatorId,SUM(InitNum) AS InitNum,"
+ " SUM(InNum) AS InNum,"
+ " SUM(OutNum)AS OutNum,"
+ " SUM(Num) AS Num FROM #T1"
+ " GROUP BY WhId, InvId,LocatorId"
+ " ORDER BY WhId, InvId,LocatorId";
            conn.Execute(sql, null, trans);

            e.Http.Columns.RemoveAll(a => a.Data == "WhId" || a.Data == "BeginDate" || a.Data == "EndDate");
        }
    }
}
