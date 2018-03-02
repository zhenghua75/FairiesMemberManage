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
    public class ReportCardTopQuery
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportCardTopQuerySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT vcDeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "tbConsItemOther..vcDeptId");
            DtRequest.ColumnT dtConsDate = e.Http.Columns.FirstOrDefault(f => f.Data == "tbConsItemOther..dtConsDate");

            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE Table #T ("
                        + " Id int IDENTITY(1, 1) PRIMARY KEY,"
                        + " vcCardID nvarchar(max) NULL,"
                        + " vcDeptId nvarchar(max) NULL,"
                        + " dtConsDate datetime NULL,"
                        + " SaleFee money NULL"
                        + "); ";
            conn.Execute(sql,null,trans);

            sql = "INSERT INTO #T(vcCardID,SaleFee)"
+" SELECT vcCardID, SUM(nFee)AS SaleFee FROM tbConsItemOther"
+ " WHERE {DeptId} cFlag = '0' {AND dtConsDate BETWEEN @BeginDate AND @EndDate}"
+ " GROUP BY vcCardID";

            var p = new DynamicParameters();
            if (vcDeptId!=null && !string.IsNullOrEmpty(vcDeptId.Search.Value))
            {
                sql = sql.Replace("{DeptId}", "vcDeptID = @DeptId AND");
                p.Add("DeptId", vcDeptId.Search.Value, DbType.String);
                vcDeptId.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{DeptId}", "");
            }
            if (dtConsDate!=null && !string.IsNullOrEmpty(dtConsDate.Search.Value))
            {
                sql = sql.Replace("{dtConsDate}", dtConsDate.Search.Value);
                dtConsDate.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{dtConsDate}", "");
            }
            conn.Execute(sql, p, trans);


        }
    }
}
