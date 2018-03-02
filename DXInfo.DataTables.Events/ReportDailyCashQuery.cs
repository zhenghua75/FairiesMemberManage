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
    public class ReportDailyCashQuery
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportDailyCashQuerySelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            DtRequest.ColumnT vcDeptID = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcDeptID");
            DtRequest.ColumnT dtConsDate = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.dtConsDate");
            DtRequest.ColumnT vcOperName = e.Http.Columns.FirstOrDefault(f => f.Data == "Cons.vcOperName");

            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE Table #T ("
                        + " Id int IDENTITY(1, 1) PRIMARY KEY,"
                        + " vcOperName nvarchar(max) NULL,"
                        + " vcConsType nvarchar(max)NULL,"
                        + " vcDeptId nvarchar(max)NULL,"
                        + " dtConsDate nvarchar(max)NULL,"
                        + " ConsCount int NULL,"
                        + " ConsFee money NULL"
                        + "); ";
            conn.Execute(sql,null,trans);

            sql = "INSERT INTO #T(vcOperName,vcConsType,ConsCount,ConsFee)"
+ " SELECT vcOperName, vcConsType, COUNT(1) AS ConsCount, SUM(nPay - nBalance) AS ConsFee FROM tbBillOther"
+ " WHERE 1=1 {vcDeptId} {dtConsDate} {vcOperName}"
+ " AND iSerial IN(SELECT iSerial FROM tbConsItemOther WHERE cFlag != '9' {vcDeptId} {dtConsDate} {vcOperName})"
+ " GROUP BY vcOperName, vcConsType; ";
            if (vcDeptID!=null && !string.IsNullOrEmpty(vcDeptID.Search.Value))
            {
                sql = sql.Replace("{vcDeptId}", " AND vcDeptID "+vcDeptID.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            
            if (dtConsDate!=null && !string.IsNullOrEmpty(dtConsDate.Search.Value))
            {
                sql = sql.Replace("{dtConsDate}", " AND dtConsDate "+dtConsDate.Search.Value);
            }
            else
            {
                sql = sql.Replace("{dtConsDate}", "");
            }
            if(vcOperName !=null && !string.IsNullOrEmpty(vcOperName.Search.Value))
            {
                sql = sql.Replace("{vcOperName}", " AND vcOperName " + vcOperName.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcOperName}", "");
            }
            conn.Execute(sql, null, trans);

            sql = "INSERT INTO #T(vcOperName,vcConsType,ConsCount,ConsFee)"
+ " SELECT vcOperName,'Fill' AS vcConsType, COUNT(1) AS ConsCount, SUM(nFillFee) AS ConsFee FROM tbFillFeeOther"
+ " WHERE  {vcDeptId} nFillFee > 0 {dtFillDate} {vcOperName}"
+ " AND vcComments != '银行卡'"
+ " AND CHARINDEX('补卡', vcComments, 0) = 0"
+ " AND CHARINDEX('补充值', vcComments, 0) = 0"
+ " AND CHARINDEX('回收卡', vcComments, 0) = 0"
+ " AND CHARINDEX('合并', vcComments, 0) = 0"
+ " AND CHARINDEX('撤消', vcComments, 0) = 0"
+ " GROUP BY vcOperName; ";

            if (vcDeptID != null && !string.IsNullOrEmpty(vcDeptID.Search.Value))
            {
                sql = sql.Replace("{vcDeptId}", "vcDeptID "+vcDeptID.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }

            if (dtConsDate != null && !string.IsNullOrEmpty(dtConsDate.Search.Value))
            {
                sql = sql.Replace("{dtFillDate}", " AND dtFillDate "+dtConsDate.Search.Value);
            }
            else
            {
                sql = sql.Replace("{dtFillDate}", "");
            }
            if (vcOperName != null && !string.IsNullOrEmpty(vcOperName.Search.Value))
            {
                sql = sql.Replace("{vcOperName}", " AND vcOperName " + vcOperName.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcOperName}", "");
            }
            conn.Execute(sql, null, trans);

            sql = "INSERT INTO #T(vcOperName,vcConsType,ConsCount,ConsFee)"
+ " SELECT vcOperName,'FillBank' AS vcConsType, COUNT(1) AS ConsCount, SUM(nFillFee) AS ConsFee FROM tbFillFeeOther"
+ " WHERE  {vcDeptId} nFillFee > 0 {dtFillDate} {vcOperName}"
+ " AND vcComments = '银行卡'"
+ " GROUP BY vcOperName; ";

            if (vcDeptID != null && !string.IsNullOrEmpty(vcDeptID.Search.Value))
            {
                sql = sql.Replace("{vcDeptId}", "vcDeptID "+vcDeptID.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }

            if (dtConsDate != null && !string.IsNullOrEmpty(dtConsDate.Search.Value))
            {
                sql = sql.Replace("{dtFillDate}", " AND dtFillDate "+dtConsDate.Search.Value);
            }
            else
            {
                sql = sql.Replace("{dtFillDate}", "");
            }
            if (vcOperName != null && !string.IsNullOrEmpty(vcOperName.Search.Value))
            {
                sql = sql.Replace("{vcOperName}", " AND vcOperName " + vcOperName.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcOperName}", "");
            }
            conn.Execute(sql, null, trans);

            sql = "INSERT INTO #T(vcOperName,vcConsType,ConsCount,ConsFee)"
+ " SELECT vcOperName,'CradRoll' AS vcConsType, COUNT(1) AS ConsCount, SUM(nFillFee) AS ConsFee FROM tbFillFeeOther"
+ " WHERE 1=1 {vcDeptId} {dtFillDate} {vcOperName}"
+ " AND LEFT(vcComments, 3) = '回收卡'"
+ " GROUP BY vcOperName; ";

            if (vcDeptID != null && !string.IsNullOrEmpty(vcDeptID.Search.Value))
            {
                sql = sql.Replace("{vcDeptId}", " AND vcDeptID "+vcDeptID.Search.Value);
                vcDeptID.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }

            if (dtConsDate != null && !string.IsNullOrEmpty(dtConsDate.Search.Value))
            {
                sql = sql.Replace("{dtFillDate}", " AND dtFillDate "+dtConsDate.Search.Value);
                dtConsDate.Search.Value = "";
            }
            else
            {
                sql = sql.Replace("{dtFillDate}", "");
            }
            if (vcOperName != null && !string.IsNullOrEmpty(vcOperName.Search.Value))
            {
                sql = sql.Replace("{vcOperName}", " AND vcOperName " + vcOperName.Search.Value);
            }
            else
            {
                sql = sql.Replace("{vcOperName}", "");
            }
            conn.Execute(sql, null, trans);
        }
    }
}
