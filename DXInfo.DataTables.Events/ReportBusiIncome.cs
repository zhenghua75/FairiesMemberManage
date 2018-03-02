using DataTables;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace DXInfo.DataTables.Events
{
    public class ReportBusiIncome
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreReportBusiIncomeSelect(object send, PreSelectEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            //准备参数
            DtRequest.ColumnT DeptId = e.Http.Columns.FirstOrDefault(f => f.Data == "tbBusiIncomeReport.vcDeptId");
            string strDeptId = DeptId.Search.Value;
            DeptId.Search.Value = "";
            string oldBeginDate = e.Http.Columns.FirstOrDefault(f => f.Data == "BeginDate").Search.Value;
            DateTime BeginDate = Convert.ToDateTime(oldBeginDate);
            string strBeginDate = BeginDate.ToString("yyyyMMdd");

            DateTime Yestody = BeginDate.AddDays(-1);
            string oldEndDate = e.Http.Columns.FirstOrDefault(f => f.Data == "EndDate").Search.Value;
            DateTime EndDate = Convert.ToDateTime(oldEndDate);
            string strEndDate = EndDate.ToString("yyyyMMdd");
            string strYestody = Yestody.ToString("yyyyMMdd");
            string strDate = strBeginDate + strEndDate;
            e.Http.Columns.RemoveAll(a => a.Data == "BeginDate" || a.Data == "EndDate");

            //准备临时表
            string sql = "IF OBJECT_ID('TEMPDB..#T') IS NOT NULL DROP TABLE dbo.#T;"
                        + " CREATE TABLE #T ("
                        + " [Id] [int] IDENTITY(1, 1) PRIMARY KEY,"
                        + " [vcDateZoom] [varchar] (max),"
                        + " [vcDeptID] [varchar] (max),"
                        + " [Type] [varchar] (max),"
                        + " [REP1] [int] NOT NULL,"
                        + " [REP2] [int] NOT NULL,"
                        + " [REP3] [numeric](12, 2) NOT NULL ,"
                        + " [REP4] [numeric](12, 2) NOT NULL ,"
                        + " [REP5] [numeric](12, 2) NOT NULL ,"
                        + " [REP6] [numeric](12, 2) NOT NULL ,"
                        + " [REP7] [int] NOT NULL ,"
                        + " [ReNo] [int] NULL ,"
                        + " [dtCreateDate] [datetime] NULL"
                        + "); ";
            conn.Execute(sql, null, trans);
            int rowno = 1;
            DateTime dtNow = DateTime.Now;

            //原状态(积分和余额不分门店，不管是查询门店或全部都只显示全部的情况)
            sql = "insert into #T"
+ " select @StrDate AS vcDateZoom, @DeptID AS vcDeptID,'OldState' AS[Type],0 AS REP1, isnull(sum(DailyIG), 0),0,isnull(sum(DailyCharge), 0),0,0,0,@rowno,@CreateDate from tbRepAssDailyIGCharge a,"
+ " (select vcCardID, max(vcDate) as maxdate from tbRepAssDailyIGCharge"
+ " where vcDate <= @YestodayDate"
+ " group by vcCardID) b,tbAssociator c"
+ " where a.vcCardID = b.vcCardID and a.vcDate = b.maxdate and a.vcCardID = c.vcCardID {vcDeptId1} ;"
+ " update #T set "
+ " REP1 = (select isnull(sum(OnlyAss), 0) from tbRepAssCount where {vcDeptId2} vcDate<= @YestodayDate)"
+ " where vcDateZoom = @StrDate {vcDeptId3} and Type = 'OldState';";
            var p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("YestodayDate", Yestody, DbType.DateTime);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId1}", " and c.vcDeptID = @DeptID");
                sql = sql.Replace("{vcDeptId2}", " vcDeptId=@DeptId AND");
                sql = sql.Replace("{vcDeptId3}", " and vcDeptID = @DeptID");
            }
            else
            {
                sql = sql.Replace("{vcDeptId1}", "");
                sql = sql.Replace("{vcDeptId2}", "");
                sql = sql.Replace("{vcDeptId3}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //现状态(积分和余额不分门店，不管是查询门店或全部都只显示全部的情况)
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'NewState',0,isnull(sum(DailyIG), 0),0,isnull(sum(DailyCharge), 0),0,0,0,2,@CreateDate from tbRepAssDailyIGCharge a,"
+ " (select vcCardID, max(vcDate) as maxdate from tbRepAssDailyIGCharge where vcDate <= @QueryEndDate group by vcCardID) b,tbAssociator c"
+ " where a.vcCardID = b.vcCardID and a.vcDate = b.maxdate and a.vcCardID = c.vcCardID {vcDeptId1}"
+ " update #T set REP1=(select isnull(sum(OnlyAss),0) from tbRepAssCount where {vcDeptId2} vcDate<=@QueryEndDate) where vcDateZoom=@StrDate {vcDeptId3} and Type='NewState'";


            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("YestodayDate", Yestody, DbType.DateTime);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId1}", " and c.vcDeptID = @DeptID");
                sql = sql.Replace("{vcDeptId2}", " vcDeptID = @DeptID and");
                sql = sql.Replace("{vcDeptId3}", " and vcDeptID=@DeptID");
                
            }
            else
            {
                sql = sql.Replace("{vcDeptId1}", "");
                sql = sql.Replace("{vcDeptId2}", "");
                sql = sql.Replace("{vcDeptId3}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //新入会员(积分和余额不分门店，不管是查询门店或全部都只显示全部的情况，指某几天的新入会员截止到某一天的积分和余额)
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'NewAss',0,isnull(sum(DailyIG), 0),0,isnull(sum(DailyCharge), 0),0,0,0,@rowno,@CreateDate from tbRepAssDailyIGCharge a,"
+ " (select vcCardID, max(vcDate) as maxdate from tbRepAssDailyIGCharge where vcDate <= @QueryEndDate and vcCardID in("
+ " select distinct vcCardID from tbAssociator where convert(char(8), dtCreateDate, 112) between @QueryBeginDate and @QueryEndDate)"
+ " group by vcCardID) b,tbAssociator c"
+ " where a.vcCardID = b.vcCardID and a.vcDate = b.maxdate and a.vcCardID = c.vcCardID {vcDeptId1}"
+ " update #T set REP1=(select isnull(sum(NewAss),0) from tbRepAssCount where {vcDeptId2} vcDate between @QueryBeginDate and @QueryEndDate) where vcDateZoom=@StrDate {vcDeptId3} and Type='NewAss'";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId1}", " and c.vcDeptID = @DeptID");
                sql = sql.Replace("{vcDeptId2}", " vcDeptID = @DeptID and");
                sql = sql.Replace("{vcDeptId3}", " and vcDeptID=@DeptID");
                
            }
            else
            {
                sql = sql.Replace("{vcDeptId1}", "");
                sql = sql.Replace("{vcDeptId2}", "");
                sql = sql.Replace("{vcDeptId3}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //挂失会员
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'LostAss',isnull(sum(LoseAss), 0),0,0,0,0,0,0,@rowno,@CreateDate from tbRepAssCount where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
                
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //回收卡会员
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'CardCycle',0,0,0,isnull(sum(FillFee), 0),isnull(sum(PromFee), 0),isnull(sum(FillCount), 0),0,@rowno,@CreateDate from tbRepAssFill"
+ " where vcType = '回收卡' {vcDeptId1} and vcDate between @QueryBeginDate and @QueryEndDate"
+ " update #T set REP1=(select isnull(sum(CardCycle),0) from tbRepAssCount where {vcDeptId2} vcDate between @QueryBeginDate and @QueryEndDate) where vcDateZoom=@StrDate {vcDeptId3} and Type='CardCycle'";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId1}", " and vcDeptID = @DeptID");
                sql = sql.Replace("{vcDeptId2}", " vcDeptID = @DeptID and");
                sql = sql.Replace("{vcDeptId3}", " and vcDeptID=@DeptID");
            }
            else
            {
                sql = sql.Replace("{vcDeptId1}", "");
                sql = sql.Replace("{vcDeptId2}", "");
                sql = sql.Replace("{vcDeptId3}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //补卡会员
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'CardAgain',isnull(sum(CardAgain), 0),0,0,0,0,0,0,@rowno,@CreateDate from tbRepAssCount where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", " ");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //总充值(现金)
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'FillFee',isnull(sum(AssCount), 0),0,0,isnull(sum(FillFee), 0),isnull(sum(PromFee), 0),isnull(sum(FillCount), 0),0,@rowno,@CreateDate from tbRepAssFill where vcType = '现金充值'  {vcDeptId} and vcDate between @QueryBeginDate and @QueryEndDate";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " and vcDeptID = @DeptID");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);


            if (!string.IsNullOrEmpty(strDeptId))
            {
                //本店会员在本店充值
                //他店会员在本店充值
                //本店会员在他店充值
                sql = "insert into #T"
+ " select @StrDate,@DeptID,'FillFee-L',isnull(sum(AssCount),0),0,0,isnull(sum(FillFee),0),isnull(sum(PromFee),0),isnull(sum(FillCount),0),0,@rowno,@CreateDate from tbRepAssFill where (vcType='现金充值' or vcType='银行卡充值') and vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept=@DeptID;"
+ " insert into #T"
+ " select @StrDate,@DeptID,'FillFee-O',isnull(sum(AssCount),0),0,0,isnull(sum(FillFee),0),isnull(sum(PromFee),0),isnull(sum(FillCount),0),0,@rowno,@CreateDate from tbRepAssFill where (vcType='现金充值' or vcType='银行卡充值') and vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept<>@DeptID;"
+ " insert into #T"
+ " select @StrDate,@DeptID,'FillFee-X',isnull(sum(AssCount),0),0,0,isnull(sum(FillFee),0),isnull(sum(PromFee),0),isnull(sum(FillCount),0),0,@rowno,@CreateDate from tbRepAssFill where (vcType='现金充值' or vcType='银行卡充值') and vcDeptID <> @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept=@DeptID;";
                p = new DynamicParameters();
                p.Add("rowno", rowno, DbType.Int32);
                p.Add("StrDate", strDate, DbType.String);
                p.Add("CreateDate", dtNow, DbType.DateTime);
                p.Add("QueryBeginDate", strBeginDate, DbType.String);
                p.Add("QueryEndDate", strEndDate, DbType.String);
                p.Add("DeptId", strDeptId, DbType.String);
                conn.Execute(sql, p, trans);
            }
            //各种会员类型消费
            sql = "insert into #T"
+ " select @StrDate,@DeptID,vcAssType,isnull(sum(AssCount),0),0,0,isnull(sum(nFee),0),isnull(sum(iIgValue),0),isnull(sum(ConsTimes),0),"
+ " isnull(sum(GoodsCount),0),@rowno,@CreateDate "
+ " from tbRepAssConsDaily "
+ " where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate AND vcAssType not in ('AT999','ATMAS')"
+ " AND vcAssType in (SELECT Code FROM NameCode WHERE Type='AT')"
+ " GROUP BY vcAssType";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and ");
                
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            if (!string.IsNullOrEmpty(strDeptId))
            {
                //本店会员在本店消费
                //他店会员在本店消费
                //本店会员在他店消费
                sql = "insert into #T"
+ " select @StrDate,@DeptID,vcAssType+'-L',isnull(sum(AssCount),0),0,0,isnull(sum(nFee),0),isnull(sum(iIgValue),0),"
+ " isnull(sum(ConsTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate "
+ " from tbRepAssConsDaily "
+ " where vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept=@DeptID AND vcAssType not in ('AT999','ATMAS')"
+ " GROUP BY vcAssType"
+ " insert into #T"
+ " select @StrDate,@DeptID,vcAssType+'-O',isnull(sum(AssCount),0),0,0,isnull(sum(nFee),0),isnull(sum(iIgValue),0),"
+ " isnull(sum(ConsTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate "
+ " from tbRepAssConsDaily "
+ " where vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept<>@DeptID AND vcAssType not in ('AT999','ATMAS')"
+ " GROUP BY vcAssType"
+ " insert into #T"
+ " select @StrDate,@DeptID,vcAssType+'-X',isnull(sum(AssCount),0),0,0,isnull(sum(nFee),0),isnull(sum(iIgValue),0),"
+ " isnull(sum(ConsTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate "
+ " from tbRepAssConsDaily "
+ " where vcDeptID <> @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept=@DeptID AND vcAssType not in ('AT999','ATMAS')"
+ " GROUP BY vcAssType";

                p = new DynamicParameters();
                p.Add("rowno", rowno, DbType.Int32);
                p.Add("StrDate", strDate, DbType.String);
                p.Add("CreateDate", dtNow, DbType.DateTime);
                p.Add("QueryBeginDate", strBeginDate, DbType.String);
                p.Add("QueryEndDate", strEndDate, DbType.String);
                p.Add("DeptId", strDeptId, DbType.String);
                conn.Execute(sql, p, trans);
            }

            //零售
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'Retail',isnull(sum(AssCount), 0),0,0,isnull(sum(nFee), 0),0,isnull(sum(ConsTimes), 0),isnull(sum(GoodsCount), 0),@rowno,@CreateDate from tbRepAssConsDaily where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate and vcAssType = 'AT999'";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //总会员赠送
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'Larg',0,0,0,isnull(sum(nFee), 0),0,isnull(sum(LargTimes), 0),isnull(sum(GoodsCount), 0),@rowno,@CreateDate from tbRepAssLarg where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            if (!string.IsNullOrEmpty(strDeptId))
            {
                //本店会员在本店赠送
                //他店会员在本店赠送
                //本店会员在他店赠送
                sql = "insert into #T"
+ " select @StrDate,@DeptID,'Larg-L',0,0,0,isnull(sum(nFee),0),0,isnull(sum(LargTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate from tbRepAssLarg where vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept=@DeptID"
+ " insert into #T"
+ " select @StrDate,@DeptID,'Larg-O',0,0,0,isnull(sum(nFee),0),0,isnull(sum(LargTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate from tbRepAssLarg where vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept<>@DeptID"
+ " insert into #T"
+ " select @StrDate,@DeptID,'Larg-X',0,0,0,isnull(sum(nFee),0),0,isnull(sum(LargTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate from tbRepAssLarg where vcDeptID <> @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssBelongDept=@DeptID";

                p = new DynamicParameters();
                p.Add("rowno", rowno, DbType.Int32);
                p.Add("StrDate", strDate, DbType.String);
                p.Add("CreateDate", dtNow, DbType.DateTime);
                p.Add("QueryBeginDate", strBeginDate, DbType.String);
                p.Add("QueryEndDate", strEndDate, DbType.String);
                p.Add("DeptId", strDeptId, DbType.String);
                conn.Execute(sql, p, trans);
            }

            //总积分兑换
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'IgChange',isnull(sum(AssCount), 0),0,isnull(sum(iIgValue), 0),0,0,isnull(sum(ConsTimes), 0),isnull(sum(GoodsCount), 0),@rowno,@CreateDate from tbRepAssConsDaily where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate and vcAssType = 'IgChange'";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            if (!string.IsNullOrEmpty(strDeptId))
            {
                //本店会员在本店积分兑换
                //他店会员在本店积分兑换
                //本店会员在他店积分兑换
                sql = "insert into #T"
+ " select @StrDate,@DeptID,'IgChange-L',isnull(sum(AssCount),0),0,isnull(sum(iIgValue),0),0,0,isnull(sum(ConsTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate from tbRepAssConsDaily where vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssType='IgChange' and vcAssBelongDept=@DeptID"
+ " insert into #T"
+ " select @StrDate,@DeptID,'IgChange-O',isnull(sum(AssCount),0),0,isnull(sum(iIgValue),0),0,0,isnull(sum(ConsTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate from tbRepAssConsDaily where vcDeptID = @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssType='IgChange' and vcAssBelongDept<>@DeptID"
+ " insert into #T"
+ " select @StrDate,@DeptID,'IgChange-X',isnull(sum(AssCount),0),0,isnull(sum(iIgValue),0),0,0,isnull(sum(ConsTimes),0),isnull(sum(GoodsCount),0),@rowno,@CreateDate from tbRepAssConsDaily where vcDeptID <> @DeptID and vcDate between @QueryBeginDate and @QueryEndDate and vcAssType='IgChange' and vcAssBelongDept=@DeptID";

                p = new DynamicParameters();
                p.Add("rowno", rowno, DbType.Int32);
                p.Add("StrDate", strDate, DbType.String);
                p.Add("CreateDate", dtNow, DbType.DateTime);
                p.Add("QueryBeginDate", strBeginDate, DbType.String);
                p.Add("QueryEndDate", strEndDate, DbType.String);
                p.Add("DeptId", strDeptId, DbType.String);
                conn.Execute(sql, p, trans);
            }

            //银行卡零售
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'BankRetail',isnull(sum(AssCount), 0),0,0,isnull(sum(nFee), 0),0,isnull(sum(ConsTimes), 0),isnull(sum(GoodsCount), 0),@rowno,@CreateDate from tbRepAssConsDaily where {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate and vcAssType = 'Bank'";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //银行卡充值
            sql = "insert into #T"
+ " select @StrDate, @DeptID,'BankFillFee',isnull(sum(AssCount), 0),0,0,isnull(sum(FillFee), 0),isnull(sum(PromFee), 0),isnull(sum(FillCount), 0),0,@rowno,@CreateDate from tbRepAssFill where vcType = '银行卡充值' and {vcDeptId} vcDate between @QueryBeginDate and @QueryEndDate";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " vcDeptID = @DeptID and");
            }
            else
            {
                sql = sql.Replace("{vcDeptId}", "");
            }
            p.Add("DeptId", strDeptId, DbType.String);
            conn.Execute(sql, p, trans);

            //总计
            sql = "insert into #T select @StrDate,@DeptID,'Total',0,0,0,0,0,0,0,@rowno,@CreateDate ";
            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            if (string.IsNullOrEmpty(strDeptId))
            {
                p.Add("DeptId", "ALL", DbType.String);
            }
            else
            {
                p.Add("DeptId", strDeptId, DbType.String);
            }
            
            conn.Execute(sql, p, trans);

            sql = "update #T set REP1=ISNULL((select REP1 from #T where vcDateZoom=@StrDate {vcDeptId} and Type='NewAss'),0) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'"
+ " update #T set REP2=ISNULL((select REP2 from #T where vcDateZoom=@StrDate {vcDeptId} and Type='NewState'),0)-ISNULL((select REP2 from #T where vcDateZoom=@StrDate {vcDeptId} and Type='OldState'),0) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'"
+ " update #T set REP3=ISNULL((select ISNULL(SUM(REP4+REP5),0) as REP4 from #T where vcDateZoom=@StrDate {vcDeptId} and Type like '%FillFee%'),0)-ISNULL((select ISNULL(REP4,0) from #T where vcDateZoom=@StrDate {vcDeptId} and Type='AT001'),0) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'"
+ " update #T set REP4=(select isnull(sum(REP4),0) from #T where vcDateZoom=@StrDate {vcDeptId} and Type in('FillFee','Retail','BankRetail','BankFillFee')) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'"
+ " update #T set REP5=ISNULL((select REP5 from #T where vcDateZoom=@StrDate {vcDeptId} and Type='FillFee'),0) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'"
+ " update #T set REP6=(select isnull(sum(REP4),0) from #T where vcDateZoom=@StrDate {vcDeptId} and( Type like 'AT___' or Type in ('Retail','BankRetail'))) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'"
+ " update #T set REP7=(select isnull(sum(REP7),0) from #T where vcDateZoom=@StrDate {vcDeptId} and (Type like 'AT___' or Type in('Retail','IgChange','Larg','BankRetail'))) where vcDateZoom=@StrDate {vcDeptId1} and Type='Total'";

            rowno += 1;
            p = new DynamicParameters();
            p.Add("rowno", rowno, DbType.Int32);
            p.Add("StrDate", strDate, DbType.String);
            p.Add("CreateDate", dtNow, DbType.DateTime);
            p.Add("QueryBeginDate", strBeginDate, DbType.String);
            p.Add("QueryEndDate", strEndDate, DbType.String);
            sql = sql.Replace("{vcDeptId1}", " and vcDeptID=@DeptID1");
            
            if (!string.IsNullOrEmpty(strDeptId))
            {
                sql = sql.Replace("{vcDeptId}", " and vcDeptID=@DeptID1");
                p.Add("DeptId", strDeptId, DbType.String);
                p.Add("DeptId1", strDeptId, DbType.String);
            }
            else
            {
                p.Add("DeptId1", "ALL", DbType.String);
                sql = sql.Replace("{vcDeptId}", "");
            }
            conn.Execute(sql, p, trans);
        }
    }
}
