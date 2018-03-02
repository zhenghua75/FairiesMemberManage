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
    public class ReportSaleBalance
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        private string ReplaceDeptId(DtRequest.ColumnT vcDeptId, string sql)
        {
            if (vcDeptId != null && !string.IsNullOrEmpty(vcDeptId.Search.Value))
            {
                return sql.Replace("{vcDeptId}", "AND vcDeptId = @vcDeptId");
            }
            return sql.Replace("{vcDeptId}", "");
        }
        private DynamicParameters GetPara(DtRequest.ColumnT vcDeptId,DtRequest.ColumnT BalanceDate)
        {
            var p = new DynamicParameters();
            if(vcDeptId!=null && !string.IsNullOrEmpty(vcDeptId.Search.Value))
            {
                p.Add("vcDeptId", vcDeptId.Search.Value);
            }
            if (BalanceDate==null || string.IsNullOrEmpty(BalanceDate.Search.Value))
            {
                throw new ArgumentNullException("BalanceDate");
            }
            string balanceDate = BalanceDate.Search.Value;
            string dtNext = Convert.ToDateTime(balanceDate).AddDays(1).ToString("yyyy-MM-dd");
            string dtLast = Convert.ToDateTime(balanceDate).AddDays(-1).ToString("yyyy-MM-dd");

            p.Add("BalanceDate", BalanceDate.Search.Value);
            p.Add("dtNext", dtNext);
            p.Add("dtLast", dtLast);
            return p;
        }
        private void executeSql(DtRequest.ColumnT vcDeptId, DtRequest.ColumnT BalanceDate,string sql)
        {
            sql = ReplaceDeptId(vcDeptId, sql);
            conn.Execute(sql, GetPara(vcDeptId, BalanceDate), trans);
        }
        public void PreReportSaleBalanceSelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT vcDeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "vcDeptId");
            DtRequest.ColumnT BalanceDate = e.Http.Columns.FirstOrDefault(f => f.Data == "BalanceDate");

            string sql = "IF OBJECT_ID('TEMPDB..#T1') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T1 ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [vcDeptID] [varchar] (max) NULL,"
                        + " [vcGoodsId] [varchar] (max) NULL,"
                        + " [BalanceDate] [varchar] (10) NULL,"
                        + " [LastCheckQuantity] [int] NULL,"
                        + " [InQuantity] [int] NOT NULL ,"
                        + " [Quantity] [int] NULL ,"
                        + " [CheckQuantity] [int] NULL"
                        + "); ";
            conn.Execute(sql, null, trans);

            sql = "INSERT INTO #T1(vcDeptId,vcGoodsId,BalanceDate,LastCheckQuantity)"
+ " SELECT vcDeptId, vcGoodsId, @BalanceDate, SUM(Quantity)AS LastCheckQuantity FROM SaleCheck"
+ " WHERE CheckDate = @dtLast {vcDeptId}"
+ " GROUP BY vcDeptId, vcGoodsId";
            executeSql(vcDeptId, BalanceDate, sql);

            sql = "INSERT INTO #T1(vcDeptId,vcGoodsId,BalanceDate,InQuantity)"
+ " SELECT vcDeptId, vcGoodsId, @BalanceDate, SUM(Quantity)AS InQuantity FROM ProductionInStorage"
+ " WHERE InDate = @BalanceDate {vcDeptId}"
+ " GROUP BY vcDeptId, vcGoodsId";
            executeSql(vcDeptId, BalanceDate, sql);

            sql = "INSERT INTO #T1(vcDeptId,vcGoodsId,BalanceDate,Quantity)"
+ " SELECT vcDeptID, vcCardID, CONVERT(VARCHAR(10), dtConsDate, 121) AS SaleDate, Sum(iCount)AS Quantity FROM tbConsItemOther"
+ " WHERE cFlag = '0' AND CONVERT(VARCHAR(10), dtConsDate, 121) = @BalanceDate {vcDeptId}"
+ " GROUP BY vcDeptID, vcCardID, CONVERT(VARCHAR(10), dtConsDate, 121)";
            executeSql(vcDeptId, BalanceDate, sql);

            sql = "INSERT INTO #T1(vcDeptId,vcGoodsId,BalanceDate,CheckQuantity)"
+ " SELECT vcDeptId, vcGoodsId, @BalanceDate, SUM(Quantity)AS CheckQuantity FROM SaleCheck"
+ " WHERE CheckDate = @BalanceDate {vcDeptId}"
+ " GROUP BY vcDeptId, vcGoodsId";
            executeSql(vcDeptId, BalanceDate, sql);


            sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [vcDeptID] [varchar] (max) NULL,"
                        + " [vcGoodsId] [varchar] (max) NULL,"
                        + " [BalanceDate] [varchar] (10) NULL,"
                        + " [LastCheckQuantity] [int] NULL,"
                        + " [InQuantity] [int] NOT NULL ,"
                        + " [Quantity] [int] NULL ,"
                        + " [CheckQuantity] [int] NULL,"
                        + " [Differences] [int] NULL,"
                        + "); ";
            conn.Execute(sql, null, trans);

            sql = "INSERT INTO #T(vcDeptId,vcGoodsId,BalanceDate,LastCheckQuantity,InQuantity,Quantity,CheckQuantity,Differences)"
+ " SELECT vcDeptId, vcGoodsId, BalanceDate, ISNULL(SUM(LastCheckQuantity), 0) AS LastCheckQuantity,"
+ " ISNULL(SUM(InQuantity), 0) AS InQuantity,"
+ " ISNULL(SUM(Quantity), 0) AS Quantity,"
+ " ISNULL(SUM(CheckQuantity), 0) AS CheckQuantity,"
+ " SUM(ISNULL(LastCheckQuantity, 0) + ISNULL(InQuantity, 0) - ISNULL(Quantity, 0)) AS Differences"
+ " FROM #T"
+ " GROUP BY vcDeptId, vcGoodsId, BalanceDate"
+ " ORDER BY vcDeptId, vcGoodsId, BalanceDate";
            conn.Execute(sql, null, trans);
        }
    }
}
