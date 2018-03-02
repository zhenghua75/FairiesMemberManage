using Dapper;
using DXInfo.Web.Models;
using System;
using System.Data;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace DXInfo.Web.Controllers
{
    public class Vouch
    {
        public int Sn { get; set; }
        public int Id { get; set; }
        public string Code { get; set; }
        public string FromWhName { get; set; }
        public string ToWhName { get; set; }
        public string FullName { get; set; }
        public DateTime MakeTime { get; set; }
    }
    [RoutePrefix("api/App")]
    public class AppController : ApiController
    {
        private IDbConnection conn;
        //private IDbTransaction trans;
        public AppController()
        {
            conn = ApplicationDbContext.Create().Connection;
        }
        [Route("GetVouch")]
        [HttpGet]
        public IHttpActionResult GetVouch(string vouchType,bool isVerify, DateTime? vouchDate)
        {
            ApplicationUser user = User.Identity.GetUser();
            string sql = "";
            string strVerify = isVerify ? "1" : "0";
            string strVouchDate = vouchDate.HasValue ? "'"+vouchDate.Value.ToString("yyyy-MM-dd")+ "'" : "Convert(VARCHAR(10), GETDATE(), 121)";
            string strDeptId = user.DeptId.HasValue ? user.DeptId.Value.ToString() : "0";
            string strWhId = user.WhId.HasValue ? user.WhId.Value.ToString() : "0";
            string strAuthorityType = user.AuthorityType == 0 ? "" :
                user.AuthorityType == 1 ? " AND b.DeptId = " + strDeptId :
                user.AuthorityType == 2 ? " AND b.Id = " + strWhId :
                user.AuthorityType == 3 ? " AND a.Maker = " + user.Id.ToString():"";
            switch (vouchType)
            {
                case "012"://叫货 配料单
                    sql = "SELECT ROW_NUMBER() OVER(ORDER BY a.MakeTime DESC) AS Sn,a.Id,a.Code,"
+ " b.Name AS FromWhName,d.Name AS ToWhName,c.FullName,a.MakeTime FROM Vouch a"
+ " LEFT JOIN Warehouse b on a.FromWhId = b.Id"
+ " LEFT JOIN Users c on a.Maker = c.Id"
+ " LEFT JOIN Warehouse d on a.ToWhId = d.Id"
+ " WHERE a.VouchType = '012'"
+ " AND a.IsVerify = "+strVerify
+ " AND VouchDate = "+strVouchDate+strAuthorityType
+ " ORDER BY a.MakeTime DESC";
                    break;
                case "006"://备货 产成品入库单
                    sql = "SELECT ROW_NUMBER() OVER(ORDER BY a.MakeTime DESC) AS Sn,a.Id,a.Code,"
+ " b.Name AS ToWhName,c.FullName,a.MakeTime FROM Vouch a"
+ " LEFT JOIN Warehouse b on a.ToWhId = b.Id"
+ " LEFT JOIN Users c on a.Maker = c.Id"
+ " WHERE a.VouchType = '006'"
+ " AND a.IsVerify = "+strVerify
+ " AND VouchDate = "+strVouchDate+strAuthorityType
+ " ORDER BY a.MakeTime DESC";
                    break;
                case "009"://发货 调拨单
                    sql = "SELECT ROW_NUMBER() OVER(ORDER BY a.MakeTime DESC) AS Sn,a.Id,a.Code,"
+ " b.Name AS FromWhName,d.Name AS ToWhName,c.FullName,a.MakeTime FROM Vouch a"
+ " LEFT JOIN Warehouse b on a.FromWhId = b.Id"
+ " LEFT JOIN Users c on a.Maker = c.Id"
+ " LEFT JOIN Warehouse d on a.ToWhId = d.Id"
+ " WHERE a.VouchType = '009'"
+ " AND a.IsVerify = "+strVerify+strAuthorityType
+ " ORDER BY a.MakeTime DESC";
                    break;
                case "003"://收货 其它入库单
                    sql = "SELECT ROW_NUMBER() OVER(ORDER BY a.MakeTime DESC) AS Sn,a.Id,a.Code,"
+ " b.Name AS ToWhName,c.FullName,a.MakeTime FROM Vouch a"
+ " LEFT JOIN Warehouse b on a.ToWhId = b.Id"
+ " LEFT JOIN Users c on a.Maker = c.Id"
+ " WHERE a.VouchType = '003' AND a.BusType = '003'"
+ " AND a.IsVerify = "+strVerify+strAuthorityType
+ " ORDER BY a.MakeTime DESC";
                    break;
            }
            return Json(conn.Query<Vouch>(sql));
        }
        private string getSql(string sql,string vcDeptId,string field,string type)
        {
            if (!string.IsNullOrEmpty(vcDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " AND vcDeptId= " + vcDeptId);
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            switch (type)
            {
                case "day"://昨日
                    sql = sql.Replace("{"+ field + "}", " AND CONVERT(VARCHAR(10),"+ field + ",121)=CONVERT(VARCHAR(10),DATEADD(DD,-1,GETDATE()),121)");
                    break;
                case "week"://上周昨日
                    sql = sql.Replace("{" + field + "}", " AND CONVERT(VARCHAR(10)," + field + ",121)=CONVERT(VARCHAR(10),DATEADD(WW,-1,DATEADD(DD,-1,GETDATE())),121)");
                    break;
                case "month"://本月至昨日
                    sql = sql.Replace("{" + field + "}", " AND CONVERT(VARCHAR(10)," + field + ",121) BETWEEN CONVERT(VARCHAR(10),DATEADD(DD,1-DATEPART(DD,GETDATE()),GETDATE()),121) AND CONVERT(VARCHAR(10),DATEADD(DD,-1,GETDATE()),121)");
                    break;
                case "lastMonth"://上月至昨日
                    sql = sql.Replace("{" + field + "}", " AND CONVERT(VARCHAR(10)," + field + ", 121) BETWEEN DATEADD(DD,1-DATEPART(DD,DATEADD(MM,-1,GETDATE())),DATEADD(MM,-1,GETDATE())) AND CONVERT(VARCHAR(10),DATEADD(MM,-1,DATEADD(DD,-1,GETDATE())),121)");
                    break;
            }
            return sql;
        }
        
        public class SaleSummaryResult
        {
            public string vcConsType { get; set; }
            public int ConsCount { get; set; }
            public decimal ConsFee { get; set; }
        }
        [Route("SaleFillSummary")]
        [HttpGet]
        public IHttpActionResult SaleFillSummary(string vcDeptId)
        {
            //销售 昨日 当月 环比 上周  上月
            //充值
            string sql = "SELECT vcConsType, COUNT(1) AS ConsCount, SUM(nPay - nBalance) AS ConsFee FROM tbBillOther"
+ " WHERE 1 = 1 {vcDeptId} {dtConsDate}"
+ " AND iSerial IN(SELECT iSerial FROM tbConsItemOther WHERE cFlag != '9')"
+ " GROUP BY vcConsType";
            var days = conn.Query<SaleSummaryResult>(getSql(sql,vcDeptId, "dtConsDate", "day")).ToList();
            var weeks = conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtConsDate", "week")).ToList();
            var months = conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtConsDate", "month")).ToList();
            var LastMonths = conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtConsDate", "lastMonth")).ToList();

            sql = "SELECT 'Fill' AS vcConsType, COUNT(1) AS ConsCount, SUM(nFillFee) AS ConsFee FROM tbFillFeeOther"
+ " WHERE nFillFee > 0 {vcDeptId} {dtFillDate}"
+ " AND vcComments != '银行卡'"
+ " AND CHARINDEX('补卡', vcComments, 0) = 0"
+ " AND CHARINDEX('补充值', vcComments, 0) = 0"
+ " AND CHARINDEX('回收卡', vcComments, 0) = 0"
+ " AND CHARINDEX('合并', vcComments, 0) = 0"
+ " AND CHARINDEX('撤消', vcComments, 0) = 0";
            days.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "day")).ToList());
            weeks.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "week")).ToList());
            months.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "month")).ToList());
            LastMonths.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "lastMonth")).ToList());

            sql = "SELECT 'FillBank' AS vcConsType, COUNT(1) AS ConsCount, SUM(nFillFee) AS ConsFee FROM tbFillFeeOther"
+ " WHERE nFillFee > 0 {vcDeptId} {dtFillDate}"
+ " AND vcComments = '银行卡'";
            days.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "day")).ToList());
            weeks.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "week")).ToList());
            months.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "month")).ToList());
            LastMonths.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "lastMonth")).ToList());

            //回收卡
            sql = "SELECT 'CradRoll' AS vcConsType, COUNT(1) AS ConsCount, SUM(nFillFee) AS ConsFee FROM tbFillFeeOther"
+ " WHERE 1 = 1 {vcDeptId} {dtFillDate}"
+ " AND LEFT(vcComments, 3) = '回收卡'";
            days.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "day")).ToList());
            weeks.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "week")).ToList());
            months.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "month")).ToList());
            LastMonths.AddRange(conn.Query<SaleSummaryResult>(getSql(sql, vcDeptId, "dtFillDate", "lastMonth")).ToList());

            return Json(new
            {
                Yesterday = days,
                LastWeek = weeks,
                Month =months,
                LastMonth = LastMonths,
            });
        }
    }
}