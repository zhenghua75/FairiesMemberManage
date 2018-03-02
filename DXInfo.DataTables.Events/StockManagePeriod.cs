using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using DataTables;

namespace DXInfo.DataTables.Events
{
    public class StockManagePeriod
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        private void CheckPeriodDateDup(DateTime beginDate,DateTime endDate)
        {
            string sql = @"SELECT COUNT(1) FROM CheckPeriod
WHERE (BeginDate >= @BeginDate AND EndDate <= @EndDate)
                OR(@BeginDate>=BeginDate AND @EndDate<=EndDate)
                OR(BeginDate>=@BeginDate AND BeginDate<=@EndDate)
                OR(EndDate>=@BeginDate AND EndDate<=@EndDate)
                OR(@BeginDate>=BeginDate AND @BeginDate<=EndDate)
                OR(@EndDate>=BeginDate AND @EndDate<=EndDate)";
            int count = conn.ExecuteScalar<int>(sql,
                new { BeginDate = beginDate, EndDate = endDate }, trans);
            if (count > 0)
            {
                throw new ArgumentException("时间段重复");
            }
        }
        public void PreStockManagePeriodCreate(object sender, PreCreateEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            Dictionary<string, object> fields = e.Values;
            CheckPeriodDateDup(Convert.ToDateTime(fields["BeginDate"]),Convert.ToDateTime(fields["EndDate"]));
        }
        public void PreStockManagePeriodEdit(object sender, PreEditEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            Dictionary<string, object> fields = e.Values;
            CheckPeriodDateDup(Convert.ToDateTime(fields["BeginDate"]), Convert.ToDateTime(fields["EndDate"]));
        }
        public void PreStockManagePeriodRemove(object sender, PreRemoveEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            int count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouch WHERE VouchType='013' AND  Period=@Period",
                new { Period = Convert.ToInt32(e.Id) }, trans);
            if (count > 0)
            {
                throw new ArgumentException("已有对应月结单");
            }
        }
    }
}
