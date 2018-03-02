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
    public class ReportSalesChart
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportSalesChartSelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT DeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "tbConsItemOther.vcDeptId");
            DtRequest.ColumnT year = e.Http.Columns.FirstOrDefault(f => f.Data == "tbConsItemOther.year");
            DtRequest.ColumnT month = e.Http.Columns.FirstOrDefault(f => f.Data == "tbConsItemOther.month");

            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE Table #T ("
                        + " Id int IDENTITY(1, 1) PRIMARY KEY,"
                        + " vcDeptId nvarchar(max) NULL,"
                        + " year int NULL,"
                        + " month int NULL,"
                        + " day int NULL,"
                        + " SaleFee money NULL"
                        + "); ";
            conn.Execute(sql, null, trans);

            sql = "INSERT INTO #T(vcDeptId,year,month,day,SaleFee)"
+ " SELECT vcDeptId,DATENAME(YYYY,dtConsDate) AS year,DATENAME(MM,dtConsDate) AS month,"
+ " DATENAME(DD, dtConsDate) AS day, SUM(nFee)AS SaleFee FROM tbConsItemOther"
+ " WHERE cFlag = '0' {vcDeptId} {year} {month}"
+ " GROUP BY vcDeptId, DATENAME(YYYY, dtConsDate), DATENAME(MM, dtConsDate), DATENAME(DD, dtConsDate)";

            var p = new DynamicParameters();
            if(DeptId!=null && !string.IsNullOrEmpty(DeptId.Search.Value))
            {
                sql = sql.Replace("{vcDeptId}", " AND vcDeptId=@vcDeptId");
                p.Add("vcDeptId", DeptId.Search.Value, DbType.String);
                DeptId.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }

            if (year != null && !string.IsNullOrEmpty(year.Search.Value))
            {
                sql = sql.Replace("{year}", " AND DATENAME(YYYY,dtConsDate)=@year");
                p.Add("year", year.Search.Value, DbType.String);
                year.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{year}", "");
            }

            if (month != null && !string.IsNullOrEmpty(month.Search.Value))
            {
                sql = sql.Replace("{month}", " AND DATENAME(MM,dtConsDate)=@month");
                p.Add("month", month.Search.Value, DbType.String);
                month.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{month}", "");
            }
            conn.Execute(sql, p, trans);
        }
    }
}
