using DataTables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DataTables.DtRequest;
using Dapper;
using NLog;

namespace DXInfo.DataTables.Events
{
    public class VouchAll
    {
        public string vcDeptId { get; set; }
        public string Code { get; set; }
        public int ToWhId { get; set; }
        public int Maker { get; set; }
        public int InvId { get; set; }
        public decimal Num { get; set; }
        public decimal Price { get; set; }
        public string vcConsType { get; set; }
        public DateTime dtConsDate { get; set; }
    }
    public class CurrentStock
    {
        public int Id { get; set; }
        public int InvId { get; set; }
        public decimal Num { get; set; }
        public decimal Price { get; set; }
        public int? LocatorId { get; set; }
        public string Batch { get; set; }
        public DateTime? MadeDate { get; set; }
        public DateTime? InvalidDate { get; set; }
    }
    public class Vouchs
    {
        public int Id { get; set; }
        public int InvId { get; set; }
        public decimal Num { get; set; }
    }
    public class Vouch
    {
        private IDbConnection conn;
        private IDbTransaction trans;
        public void PreVouchCreate(object sender, PreCreateEventArgs e)
        {
            Dictionary<string, object> fields = e.Values["Vouch"] as Dictionary<string, object>;
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            string vouchType = fields["VouchType"].ToString();
            switch (vouchType)
            {
                case "013":
                    #region 月结单
                    var checkPeriod = conn.Query<dynamic>("SELECT * FROM CheckPeriod WHERE Id=@Id",
                        new { Id = Convert.ToInt32(fields["Period"]) }, trans).FirstOrDefault();
                    if(null == checkPeriod)
                    {
                        throw new ArgumentNullException("没找到月结单");
                    }
                    int count1 = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouch WHERE VouchType!='013' AND ToWhId=1 AND IsVerify=0 AND VouchDate>=@BeginDate AND VouchDate<=@EndDate",
                        new { BeginDate = checkPeriod.BeginDate, EndDate = checkPeriod.EndDate }, trans);
                    if (count1 > 0)
                    {
                        throw new ArgumentException("有单据未审核，不能月结");
                    }
                    //月结 一条月结记录对应一条
                    int count2 = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouch WHERE VouchType='013' AND ToWhId=1 AND Period=@Period AND IsVerify=1",
                        new { ToWhId = Convert.ToInt32(fields["ToWhId"]),Period=Convert.ToInt32(fields["Period"]) }, trans);

                    if (count2 > 0)
                    {
                        throw new ArgumentException("对应月结周期已月结");
                    }
                    #endregion
                    break;
            }
            fields["Code"] = GetVouchCode(vouchType);

            fields.Add("Maker", e.Editor.UserId());
            fields.Add("MakeDate", DateTime.Now);
            fields.Add("MakeTime", DateTime.Now);
        }
        #region VouchsLink
        private void InsertVouchsLink(int id,int vouchId,int sourceVouchId)
        {
            int count = conn.Execute("INSERT INTO VouchsLink(Id,VouchId,SourceVouchId)VALUES(@Id,@VouchId,@SourceVouchId)", new { Id = id, VouchId = vouchId, SourceVouchId = sourceVouchId }, trans);
            if(count == 0)
            {
                throw new ArgumentException("关联叫货单异常，请再次生成生产计划单");
            }
        }
        private void UpdateStep(int id,string step)
        {
            int count = conn.Execute("UPDATE Vouch SET Step=@Step WHERE Id=@Id", new { Id = id, Step = step }, trans);
            if (count == 0)
            {
                throw new ArgumentException("更新步骤失败，请再次操作");
            }
        }
        #endregion

        #region VouchLink
        private void InsertVouchLink(List<int> ids,int sourceId)
        {
            foreach(int id in ids)
            {
                int count = conn.Execute("INSERT INTO VouchLink(Id,SourceId)VALUES(@Id,@SourceId)", new { Id = id, SourceId = sourceId }, trans);
                if (count == 0)
                {
                    throw new ArgumentException("关联叫货单异常，请再次生成生产计划单");
                }
            }
        }
        private void UpdateMemo(int id)
        {
            int count = conn.Execute("UPDATE Vouch SET Memo=NULL WHERE Id=@Id", new { Id = id }, trans);
            if (count == 0)
            {
                throw new ArgumentException("生产计划单生成异常，请再次生成生产计划单");
            }
        }
        #endregion

        public void PostVouchCreate(object sender, PostCreateEventArgs e)
        {
            Dictionary<string, object> fields = e.Values["Vouch"] as Dictionary<string, object>;
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();

            string vouchType = fields["VouchType"].ToString();
            string sql = string.Empty;
            switch (vouchType)
            {
                case "010":
                    #region 盘点单
                    sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[CNum]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate])"
     + " SELECT"
           + " @VouchId"
           + ",InvId"
           + ",LocatorId"
           + ",Batch"
           + ",Num"
           + ",Num as CNum"
           + ",Price"
           + ",MadeDate"
           + ",InvalidDate FROM dbo.CurrentStock WHERE Num!=0 AND WhId=@WhId";
                    conn.Execute(sql, new { VouchId = Convert.ToInt32(e.Id), WhId = Convert.ToInt32(fields["ToWhId"]) },trans);
                    #endregion
                    break;
                case "013":
                    #region 月结单
                    sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate])"
     + " SELECT"
           + " @VouchId"
           + ",InvId"
           + ",LocatorId"
           + ",Batch"
           + ",Num"
           + ",Price"
           + ",MadeDate"
           + ",InvalidDate FROM dbo.CurrentStock WHERE Num!=0 AND WhId=@WhId";
                    conn.Execute(sql, 
                        new { VouchId = Convert.ToInt32(e.Id), WhId = Convert.ToInt32(fields["ToWhId"]) }, 
                        trans);
                    #endregion
                    break;
                case "014":
                    #region 生产计划单
                    //关联叫货单
                    if(fields.Any(a=>a.Key=="Memo"))
                    {
                        string vouchLink = fields["Memo"].ToString();
                        if (!string.IsNullOrEmpty(vouchLink))
                        {
                            int Id = Convert.ToInt32(e.Id);
                            List<string> vouchLinks = vouchLink.Split(',').ToList();
                            List<int> ids = new List<int>();
                            foreach(string id in vouchLinks)
                            {
                                string strid = id.Replace("'", "");
                                ids.Add(Convert.ToInt32(strid));
                            }
                            if (ids.Count > 0)
                            {
                                InsertVouchLink(ids, Id);
                            }
                            UpdateMemo(Id);
                        }
                        
                    }
                    #endregion
                    break;
            }
        }
        private object GetDeptIdByWarehouse(int whId)
        {
            return conn.ExecuteScalar<int>("SELECT DeptId FROM Warehouse WHERE Id=@Id",new { Id = whId },trans);
        }
        public void PreVouchEdit(object sender, PreEditEventArgs e)
        {
            Dictionary<string, object> fields = e.Values["Vouch"] as Dictionary<string, object>;
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            int Id = Convert.ToInt32(e.Id);
            string vouchType = fields["VouchType"].ToString();
            if (vouchType != "013" && IsBalance(Id))
            {
                throw new ArgumentNullException("已月结不能操作单据");
            }

            bool isVerify = conn.ExecuteScalar<bool>("SELECT IsVerify FROM Vouch WHERE Id=@Id", new { Id = Id }, trans);

            if (e.Editor.InData().RequestType == RequestTypes.EditorVerify||
                e.Editor.InData().RequestType == RequestTypes.EditorUnVerify)
            {
                
                if (e.Editor.InData().RequestType == RequestTypes.EditorUnVerify)
                {
                    #region 弃审
                    if (!isVerify)
                        throw new ArgumentException("未审核");
                    fields.Add("Verifier", null);
                    fields.Add("VerifyDate", null);
                    fields.Add("VerifyTime", null);
                    //弃审
                    switch (vouchType)
                    {
                        case "001"://采购入库单
                            CurrentStock(e.Editor, Id, true);
                            break;
                        case "002"://销售出库单
                            CurrentStock(e.Editor, Id, false);
                            break;
                        case "003"://其它入库单
                            CurrentStock(e.Editor, Id, true);
                            break;
                        case "004"://其它出库单
                            CurrentStock(e.Editor, Id, false);
                            break;
                        case "005"://材料出库单
                            CurrentStock(e.Editor, Id, false);
                            break;
                        case "006"://产成品入库单
                            CurrentStock(e.Editor, Id, true);
                            break;
                        case "007"://期初库存
                            CurrentStock(e.Editor, Id, true);
                            break;
                        case "015"://零售出库单
                            CurrentStock(e.Editor, Id, false);
                            break;
                        case "008"://不合格品记录单
                        case "009"://调拨单
                        case "010"://盘点单
                        case "011"://货位调整单
                        case "012"://配料单
                        //case "014"://生产计划单
                        case "016"://门店盘点单
                            UnVerifyVouch(e.Editor,Id, vouchType);
                            break;
                        case "013":
                            int count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouch WHERE MakeDate>(SELECT MakeDate FROM Vouch WHERE Id=@Id) AND ToWhId=(SELECT ToWhId FROM Vouch WHERE Id=@Id)",
                                new { Id = Id }, trans);
                            if (count > 0)
                            {
                                throw new ArgumentException("已有新单据，不能弃审月结单");
                            }
                            break;
                        
                    }
                    #endregion
                }
                else
                {
                    if (isVerify)
                        throw new ArgumentException("已审核");
                    switch (vouchType)
                    {
                        case "001"://采购入库单
                        case "006"://产成品入库单
                        case "009"://调拨单
                            #region 价格判断
                            if (vouchType == "001")
                            {
                                var zeroCount = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouchs WHERE VouchId=@VouchId AND Price<=0", new { VouchId = Id }, trans);
                                if (zeroCount > 0)
                                {
                                    throw new ArgumentNullException("请输入价格");
                                }
                            }
                            
                            string sql = "SELECT c.Name,a.Batch,a.Price AS CurPrice,b.Price AS OldPrice FROM "
+ " (SELECT b."+(vouchType=="009"?"From":"To")+"WhId AS WhId, a.InvId, a.Batch, a.Price FROM Vouchs a"
+ " LEFT JOIN Vouch b ON a.VouchId = b.Id"
+ " WHERE a.VouchId = @VouchId) a"
+ "   INNER JOIN CurrentStock b ON a.WhId = b.WhId AND a.InvId = b.InvId"
+ " AND a.Batch = b.Batch AND a.Price != b.Price"
+ " LEFT JOIN Inventory c ON a.InvId = c.Id";
                            var priceCount = conn.Query<dynamic>(sql, new { VouchId = Id }, trans).ToList();
                            if (priceCount.Count > 0)
                            {
                                string exStr = "价格不统一：";
                                foreach(var item in priceCount)
                                {
                                    exStr += item.Name + "(" + item.Batch + ")=>" + "现价" + item.CurPrice.ToString("F2") + "－原价：" + item.OldPrice.ToString("F2") + "\b";
                                }
                                throw new ArgumentException(exStr);
                            }
                            #endregion
                            break;
                        case "013":
                            #region 月结
                            int count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouch WHERE VouchType='013' AND ToWhId=1 AND IsVerify=1 AND Period=(SELECT Period FROM Vouch WHERE VouchType='013' AND Id=@Id)",
                                new { Id = Id }, trans);
                            if (count > 0)
                            {
                                throw new ArgumentException("对应月结周期已月结");
                            }
                            #endregion
                            break;
                    }
                    fields.Add("Verifier", e.Editor.UserId());
                    fields.Add("VerifyDate", DateTime.Now);
                    fields.Add("VerifyTime", DateTime.Now);
                }
            }
            else
            {
                if (isVerify)
                {
                    throw new ArgumentException("已审核不能修改");
                }
            }
            fields.Add("Modifier", e.Editor.UserId());
            fields.Add("ModifyDate", DateTime.Now);
            fields.Add("ModifyTime", DateTime.Now);
        }
        private string GetVouchCode(string vouchType)
        {
            DateTime dtNow = DateTime.Now;
            int yearMonth = Convert.ToInt32(dtNow.ToString("yyyyMM"));
            int icount = 1;
            int? sn = conn.ExecuteScalar<int?>("SELECT Sn FROM VouchCodeSn WHERE VouchCode=@VouchCode AND YearMonth=@YearMonth",
                new { VouchCode =vouchType, YearMonth =yearMonth},trans);
            
            if (!sn.HasValue)
            {
                conn.Execute("INSERT INTO VouchCodeSn(VouchCode,YearMonth,Sn)VALUES(@VouchCode,@YearMonth,@Sn)",
                    new { VouchCode = vouchType, YearMonth = yearMonth, Sn = 1 },trans);
            }
            else
            {
                icount = sn.Value + 1;
                conn.Execute("UPDATE VouchCodeSn SET Sn=@Sn WHERE VouchCode=@VouchCode AND YearMonth=@YearMonth",
                    new { VouchCode = vouchType, YearMonth = yearMonth, Sn = icount },trans);
            }
            var vouchCodeRule = conn.QueryFirst<dynamic>("SELECT * FROM VouchCodeRule WHERE VouchType=@VouchType",
                new { VouchType = vouchType }, trans);
            
            if(null == vouchCodeRule)
            {
                throw new ArgumentNullException("VouchCodeRule");
            }
            string prefix = vouchCodeRule.Prefix;
            string middle = vouchCodeRule.Middle;
            string suffix = vouchCodeRule.Suffix;
            string vouchCode = prefix + dtNow.ToString(middle)  + icount.ToString().PadLeft(Convert.ToInt32(suffix), '0');
            return vouchCode;
        }
        private bool IsBalance(int id)
        {
            string sql = "SELECT COUNT(1) FROM CheckPeriod WHERE Id =("
+ " SELECT TOP 1 Id FROM Vouch WHERE VouchType = '013'"
+ " AND IsVerify = 1"
+ " AND ToWhId = (SELECT ToWhId FROM Vouch WHERE Id = @Id))"
+ " AND GETDATE() BETWEEN BeginDate AND EndDate";

            return conn.ExecuteScalar<bool>(sql,new { Id = id },trans);
        }
        public void PostVouchEdit(object sender,PostEditEventArgs e)
        {
            Dictionary<string, object> fields = e.Values["Vouch"] as Dictionary<string, object>;
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            int Id = Convert.ToInt32(e.Id);
            string vouchType = fields["VouchType"].ToString();
            if (e.Editor.InData().RequestType == RequestTypes.EditorVerify)
            {
                #region 审核
                switch (vouchType)
                {
                    case "001"://采购入库单
                        CurrentStock(e.Editor, Id, false);
                        break;
                    case "002"://销售出库单
                        CurrentStock(e.Editor, Id, true);
                        break;
                    case "003"://其它入库单
                        CurrentStock(e.Editor, Id, false);
                        break;
                    case "004"://其它出库单
                        CurrentStock(e.Editor, Id, true);
                        break;
                    case "005"://材料出库单
                        CurrentStock(e.Editor, Id, true);
                        break;
                    case "006"://产成品入库单
                        CurrentStock(e.Editor, Id, false);
                        break;
                    case "007"://期初库存
                        CurrentStock(e.Editor, Id, false);
                        break;
                    case "015"://零售出库单
                        CurrentStock(e.Editor, Id, true);
                        break;
                    case "008"://不合格品记录单
                    case "009"://调拨单
                    case "010"://盘点单
                    case "011"://货位调整单
                    case "012"://配料单
                        VerifyVouch(e.Editor, Id, vouchType);
                        break;
                    case "016"://门店盘点单
                        string busType = fields["BusType"].ToString();
                        VerifyVouch(e.Editor, Id, vouchType,busType);
                        break;
                    case "014"://生产计划单
                    case "013"://月结
                        break;
                }
                #endregion
            }
        }
        #region 生成SQL
        private string ToVouchSql(bool isVerify)
        {
            string sql = "DECLARE @T TABLE(Id int);INSERT INTO [dbo].[Vouch]"
           + "([Code]"
           + ",[VouchType]"
           + ",[BusType]"
           + ",[VouchDate]"
           + ",[ToWhId]"
           + ",[Memo]"
           + ",[Maker]"
           + ",[MakeDate]"
           + ",[MakeTime]"
           + (isVerify ?
           ",[IsVerify]"
           + ",[Verifier]"
           + ",[VerifyDate]"
           + ",[VerifyTime]"
           : "")
           + ",[SourceId])"
     + " OUTPUT INSERTED.Id INTO @T "
     + "SELECT "
           + "@Code"
           + ", @VouchType"
           + ", @BusType"
           + ", GETDATE() AS VouchDate"
           + ", ToWhId"
           + ", Memo"
           + ", @Maker"
           + ", GETDATE() AS MakeDate"
           + ", GETDATE() AS MakeTime"
           + (isVerify?
           ", 1"
           + ", @Verifier"
           + ", GETDATE() AS VerifyDate"
           + ", GETDATE() AS VerifyTime"
           : "")
           + ", Id as SourceId FROM Vouch WHERE Id=@Id;"
           + "SELECT @OutID=Id FROM @T";
            return sql;
        }
        private string ToVouchSqlByValue(bool isVerify)
        {
            string sql = "DECLARE @T TABLE(Id int);INSERT INTO [dbo].[Vouch]"
           + "([Code]"
           + ",[VouchType]"
           + ",[BusType]"
           + ",[VouchDate]"
           + ",[ToWhId]"
           //+ ",[Memo]"
           + ",[Maker]"
           + ",[MakeDate]"
           + ",[MakeTime]"
           + (isVerify ?
           ",[IsVerify]"
           + ",[Verifier]"
           + ",[VerifyDate]"
           + ",[VerifyTime]"
           : "")
           + ",[SourceId])"
     + " OUTPUT INSERTED.Id INTO @T "
     + "VALUES( "
           + "@Code"
           + ", @VouchType"
           + ", @BusType"
           + ", GETDATE()"
           + ", @ToWhId"
           //+ ", Memo"
           + ", @Maker"
           + ", GETDATE()"
           + ", GETDATE()"
           + (isVerify ?
           ", 1"
           + ", @Verifier"
           + ", GETDATE()"
           + ", GETDATE()"
           : "")
           + ", @SourceId);"
           + "SELECT @OutID=Id FROM @T";
            return sql;
        }
        private string FromVouchSql(bool isVerify)
        {
            string sql = "INSERT INTO [dbo].[Vouch]"
           + "([Code]"
           + ",[VouchType]"
           + ",[BusType]"
           + ",[VouchDate]"
           + ",[ToWhId]"
           + ",[Memo]"
           + ",[Maker]"
           + ",[MakeDate]"
           + ",[MakeTime]"
           + (isVerify ?
           ",[IsVerify]"
           + ",[Verifier]"
           + ",[VerifyDate]"
           + ",[VerifyTime]"
           : "")
           + ",[SourceId])"
     + "SELECT "
           + "@Code"
           + ", @VouchType"
           + ", @BusType"
           + ", GETDATE() AS VouchDate"
           + ", FromWhId"
           + ", Memo"
           + ", @Maker"
           + ", GETDATE() AS MakeDate"
           + ", GETDATE() AS MakeTime"
           + (isVerify ?
           ", 1"
           + ", @Verifier"
           + ", GETDATE() AS VerifyDate"
           + ", GETDATE() AS VerifyTime"
           : "")
           + ", Id as SourceId FROM Vouch WHERE Id=@Id;"
           + "SELECT @OutID = @@identity";
            return sql;
        }
        private string FromToVouchSql(bool isVerify)
        {
            string sql = "INSERT INTO [dbo].[Vouch]"
           + "([Code]"
           + ",[VouchType]"
           + ",[BusType]"
           + ",[VouchDate]"
           + ",[FromWhId]"
           + ",[ToWhId]"
           + ",[Memo]"
           + ",[Maker]"
           + ",[MakeDate]"
           + ",[MakeTime]"
           + (isVerify ?
           ",[IsVerify]"
           + ",[Verifier]"
           + ",[VerifyDate]"
           + ",[VerifyTime]"
           : "")
           + ",[SourceId])"
     + "SELECT "
           + "@Code"
           + ", @VouchType"
           + ", @BusType"
           + ", GETDATE() AS VouchDate"
           + ", FromWhId"
           + ", ToWhId"
           + ", Memo"
           + ", @Maker"
           + ", GETDATE() AS MakeDate"
           + ", GETDATE() AS MakeTime"
           + (isVerify ?
           ", 1"
           + ", @Verifier"
           + ", GETDATE() AS VerifyDate"
           + ", GETDATE() AS VerifyTime"
           : "")
           + ", Id as SourceId FROM Vouch WHERE Id=@Id;"
           + "SELECT @OutID = @@identity";
            return sql;
        }
        private string ToVouchsSql()
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate]"
           + ",[Memo]"
           + ",[SourceId])"
+ "SELECT "
           + "@VouchId"
           + ", InvId"
           + ", ToLocatorId"
           + ", Batch"
           + ", Num"
           + ", Price"
           + ", MadeDate"
           + ", InvalidDate"
           + ", Memo"
           + ", Id as SourceId"
+ " FROM [dbo].[Vouchs] WHERE VouchId = @Id";
            return sql;
        }
        private string ToInVouchsSql()
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate]"
           + ",[Memo]"
           + ",[SourceId])"
+ "SELECT "
           + "@VouchId"
           + ", InvId"
           + ", ToLocatorId"
           + ", Batch"
           + ", CNum-Num"
           + ", Price"
           + ", MadeDate"
           + ", InvalidDate"
           + ", Memo"
           + ", Id as SourceId"
+ " FROM [dbo].[Vouchs] WHERE VouchId = @Id AND Num<CNum";
            return sql;
        }
        private string ToOutVouchsSql()
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate]"
           + ",[Memo]"
           + ",[SourceId])"
+ "SELECT "
           + "@VouchId"
           + ", InvId"
           + ", ToLocatorId"
           + ", Batch"
           + ", Num-CNum"
           + ", Price"
           + ", MadeDate"
           + ", InvalidDate"
           + ", Memo"
           + ", Id as SourceId"
+ " FROM [dbo].[Vouchs] WHERE VouchId = @Id AND Num>CNum";
            return sql;
        }
        private string ToVouchsSqlByValue()
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate])"
//+ ",[Memo]"
//+ ",[SourceId])"
+ "VALUES( "
           + "@VouchId"
           + ", @InvId"
           + ", @ToLocatorId"
           + ", @Batch"
           + ", @Num"
           + ", @Price"
           + ", @MadeDate"
           + ", @InvalidDate)";
           //+ ", @Memo)";
           //+ ", Id as SourceId"
//+ " FROM [dbo].[Vouchs] WHERE VouchId = @Id AND Num>CNum";
            return sql;
        }
        private string FromVouchsSql()
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[ToLocatorId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate]"
           + ",[Memo]"
           + ",[SourceId])"
+ "SELECT "
           + "@VouchId"
           + ", InvId"
           + ", FromLocatorId"
           + ", Batch"
           + ", Num"
           + ", Price"
           + ", MadeDate"
           + ", InvalidDate"
           + ", Memo"
           + ", Id as SourceId"
+ " FROM [dbo].[Vouchs] WHERE VouchId = @Id";
            return sql;
        }
        private string VouchsSql()
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
           + "([VouchId]"
           + ",[InvId]"
           + ",[Batch]"
           + ",[Num]"
           + ",[Price]"
           + ",[MadeDate]"
           + ",[InvalidDate]"
           + ",[Memo]"
           + ",[SourceId])"
+ "SELECT "
           + "@VouchId"
           + ", InvId"
           + ", Batch"
           + ", Num"
           + ", Price"
           + ", MadeDate"
           + ", InvalidDate"
           + ", Memo"
           + ", Id as SourceId"
+ " FROM [dbo].[Vouchs] WHERE VouchId = @Id";
            return sql;
        }
        #endregion
        private void DeleteVouch(int id)
        {
            conn.Execute("DELETE FROM Vouchs WHERE VouchId=@VouchId",new { VouchId = id },trans);
            conn.Execute("DELETE FROM Vouch WHERE Id=@Id",new { Id = id },trans);
        }
        private int VerifyVouch(Editor editor,int id, string vouchType,string busType=null)
        {
            DynamicParameters p = null;
            int o = 0;
            int userId = editor.UserId();
            int count = 0;
            switch (vouchType)
            {
                case "008"://不合格品记录单
                    #region 生成其它出库单
                    bool scrapVouchVerify = editor.ScrapVouchVerify();
                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("004"), DbType.String);
                    p.Add("VouchType", "004", DbType.String);
                    p.Add("BusType", "008", DbType.String);
                    p.Add("Maker", userId, DbType.Int32);
                    p.Add("Verifier", userId, DbType.Int32);
                    p.Add("Id", id,DbType.Int32);
                    p.Add("@OutID", null, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(ToVouchSql(scrapVouchVerify), p, trans);
                    o = p.Get<int>("OutID");
                    
                    conn.Execute(ToVouchsSql(), new { Id = id, VouchId = o });

                    #endregion

                    if (scrapVouchVerify)
                    {
                        CurrentStock(editor, o, true);
                    }
                    break;
                case "009"://调拨单
                    #region  生成其它出库单

                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("004"), DbType.String);
                    p.Add("VouchType", "004", DbType.String);
                    p.Add("BusType", "006", DbType.String);
                    p.Add("Maker", userId,DbType.Int32);
                    p.Add("Id", id,DbType.Int32);
                    p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                    p.Add("Verifier", userId,DbType.Int32);
                    conn.Execute(FromVouchSql(true), p, trans);
                    o = p.Get<int>("OutID");

                    conn.Execute(ToVouchsSql(), new { Id = id, VouchId = o },trans);
                    #endregion

                    CurrentStock(editor, o, true);

                    #region  生成其它入库单

                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("003"), DbType.String);
                    p.Add("VouchType", "003", DbType.String);
                    p.Add("BusType", "003", DbType.String);
                    p.Add("Maker", userId,DbType.Int32);
                    p.Add("Id", id, DbType.Int32);
                    p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(ToVouchSql(false), p, trans);
                    o = p.Get<int>("@OutID");
                    
                    conn.Execute(VouchsSql(), new { Id = id, VouchId = o },trans);

                    #endregion
                    break;
                case "010"://盘点单
                    CanCheck(id);

                    #region  生成其它出库单

                    count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouchs WHERE VouchId = @Id AND Num>CNum", new { Id = id }, trans);
                    if (count > 0)
                    {
                        p = new DynamicParameters();
                        p.Add("Code", GetVouchCode("004"), DbType.String);
                        p.Add("VouchType", "004", DbType.String);
                        p.Add("BusType", "007", DbType.String);
                        p.Add("Maker", userId, DbType.Int32);
                        p.Add("Verifier", userId, DbType.Int32);
                        p.Add("Id", id, DbType.Int32);
                        p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                        conn.Execute(ToVouchSql(true), p, trans);
                        o = p.Get<int>("@OutID");

                        conn.Execute(ToOutVouchsSql(), new { Id = id, VouchId = o }, trans);

                        CurrentStock(editor, o, true);
                    }

                    #endregion

                    
                    #region  生成其它入库单

                    count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouchs WHERE VouchId = @Id AND Num<CNum", new { Id = id }, trans);
                    if (count > 0)
                    {
                        p = new DynamicParameters();
                        p.Add("Code", GetVouchCode("003"), DbType.String);
                        p.Add("VouchType", "003", DbType.String);
                        p.Add("BusType", "004", DbType.String);
                        p.Add("Maker", userId, DbType.Int32);
                        p.Add("Verifier", userId, DbType.Int32);
                        p.Add("Id", id, DbType.Int32);
                        p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                        conn.Execute(ToVouchSql(true), p, trans);
                        o = p.Get<int>("@OutID");
                        
                        conn.Execute(ToInVouchsSql(), new { Id = id, VouchId = o }, trans);

                        CurrentStock(editor, o, false);
                    }
                    
                    #endregion

                    
                    break;
                case "011"://货位调整单
                    #region  生成其它出库单

                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("004"), DbType.String);
                    p.Add("VouchType", "004", DbType.String);
                    p.Add("BusType", "014", DbType.String);
                    p.Add("Maker", userId, DbType.Int32);
                    p.Add("Verifier", userId, DbType.Int32);
                    p.Add("Id", id, DbType.Int32);
                    p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(ToVouchSql(true), p, trans);
                    o = p.Get<int>("@OutID");

                    conn.Execute(FromVouchsSql(), new { Id = id, VouchId = o }, trans);
                    #endregion

                    CurrentStock(editor, o, true);

                    #region  生成其它入库单

                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("003"), DbType.String);
                    p.Add("VouchType", "003", DbType.String);
                    p.Add("BusType", "013", DbType.String);
                    p.Add("Maker", userId, DbType.Int32);
                    p.Add("Verifier", userId, DbType.Int32);
                    p.Add("Id", id, DbType.Int32);
                    p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(ToVouchSql(true), p, trans);
                    o = p.Get<int>("@OutID");

                    conn.Execute(ToVouchsSql(), new { Id = id, VouchId = o }, trans);
                    #endregion

                    CurrentStock(editor, o, false);
                    break;
                case "012"://配料单
                    #region  生成调拨单

                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("009"), DbType.String);
                    p.Add("VouchType", "009", DbType.String);
                    p.Add("BusType", "016", DbType.String);
                    p.Add("Maker", userId, DbType.Int32);
                    p.Add("Id", id, DbType.Int32);
                    p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(FromToVouchSql(false), p, trans);
                    o = p.Get<int>("@OutID");

                    conn.Execute(VouchsSql(), new { Id = id, VouchId = o }, trans);
                    #endregion
                    break;
                case "014"://生产计划单
                    #region  生成产成品入库单

                    p = new DynamicParameters();
                    p.Add("Code", GetVouchCode("006"), DbType.String);
                    p.Add("VouchType", "006", DbType.String);
                    p.Add("BusType", "011", DbType.String);
                    p.Add("Maker", userId, DbType.Int32);
                    p.Add("Id", id, DbType.Int32);
                    p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
                    conn.Execute(ToVouchSql(false), p, trans);
                    o = p.Get<int>("@OutID");

                    conn.Execute(VouchsSql(), new { Id = id, VouchId = o }, trans);
                    #endregion
                    break;
                case "016"://门店盘点单
                    CanCheck(id);
                    int categoryType = 1;
                    switch (busType)
                    {
                        case "023"://产成品
                            categoryType = 1;
                            break;
                        case "024"://半成品
                            categoryType = 2;
                            break;
                        case "025"://原材料
                            categoryType = 0;
                            break;
                    }
                    ShopCheck(id, categoryType);

                    break;
            }
            return 0;
        }
        private void CanCheck(int id)
        {
            //有新单不给审核
            int max = conn.ExecuteScalar<int>("SELECT MAX(a.Id) FROM Vouch a"
+ " LEFT JOIN(SELECT * FROM NameCode WHERE Type = 'VouchType') b"
+ " on a.VouchType = b.Code"
+ " WHERE a.ToWhId = (SELECT ToWhId FROM Vouch WHERE Id = @Id)"
+ " AND (a.SourceId IS NULL OR a.SourceId!=@Id)"
+ " AND a.IsVerify = 1"
+ " AND b.Value != 0", new { Id = id }, trans);
            if (max > id)
            {
                throw new ArgumentException("当前库存有变动，请重新盘点");
            }
        }
        private void ShopCheck(int id,int categoryType)
        {
            var vouch = conn.QueryFirstOrDefault<dynamic>("SELECT * FROM Vouch WHERE Id=@Id", new { Id = id }, trans);
            var vouchs = conn.Query<Vouchs>("SELECT * FROM Vouchs WHERE VouchId=@VouchId ORDER BY Id", new { VouchId = id }, trans).ToList();
            if (vouch == null)
            {
                throw new ArgumentNullException("未找到盘点单" + id.ToString());
            }
            if(vouchs==null || vouchs.Count == 0)
            {
                throw new ArgumentNullException("未找到盘点单明细" + id.ToString());
            }
            var count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouchs a"
+ " LEFT JOIN Inventory b on a.InvId = b.Id"
+ " LEFT JOIN InvCategory c on b.Category = c.Id"
+ " WHERE a.VouchId = @VouchId AND c.CategoryType != @CategoryType", new { VouchId = id, CategoryType = categoryType }, trans);
            if (count > 0)
            {
                throw new ArgumentNullException("盘点单明细,产品类型不正确" + id.ToString());
            }
            count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouchs "
+ " WHERE VouchId = @VouchId"
+ " GROUP BY InvId"
+ " HAVING(COUNT(1) > 1)", new { VouchId = id }, trans);
            if (count > 0)
            {
                throw new ArgumentNullException("盘点单明细,重复：" + id.ToString());
            }
            int whId = vouch.ToWhId;

            string sql = "SELECT COUNT(1) FROM Vouch "
+ " WHERE IsVerify = 0"
+ " AND VouchType IN('004', '015')"
+ " AND BusType IN('020', '021', '022')"
+ " AND ToWhId = @ToWhId";
            count = conn.ExecuteScalar<int>(sql, new { ToWhId = whId }, trans);
            if (count > 0)
            {
                throw new ArgumentException("有零售出库单、其它出库单（门店报损、门店品尝、门店退货)没有审核，需要全部审核完才能盘点");
            }

            int userId = vouch.Maker;
            var cs = conn.Query<CurrentStock>("SELECT a.* FROM CurrentStock a"
+ " LEFT JOIN Inventory b on a.InvId = b.Id"
+ " LEFT JOIN InvCategory c on b.Category = c.Id"
+ " WHERE a.WhId = @WhId AND c.CategoryType = @CategoryType ORDER BY a.Id", new { WhId = whId, CategoryType = categoryType }, trans).ToList();
            
            

            DynamicParameters p = new DynamicParameters();
            p.Add("Code", GetVouchCode("004"), DbType.String);
            p.Add("VouchType", "004", DbType.String);
            p.Add("BusType", "007", DbType.String);
            p.Add("ToWhId", whId, DbType.Int32);
            p.Add("Maker", userId, DbType.Int32);
            p.Add("Verifier", userId, DbType.Int32);
            p.Add("SourceId", id, DbType.Int32);
            p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
            conn.Execute(ToVouchSqlByValue(true), p, trans);
            int o = p.Get<int>("@OutID");

            p = new DynamicParameters();
            p.Add("Code", GetVouchCode("003"), DbType.String);
            p.Add("VouchType", "003", DbType.String);
            p.Add("BusType", "004", DbType.String);
            p.Add("ToWhId", whId, DbType.Int32);
            p.Add("Maker", userId, DbType.Int32);
            p.Add("Verifier", userId, DbType.Int32);
            p.Add("SourceId", id, DbType.Int32);
            p.Add("OutID", null, DbType.Int32, ParameterDirection.Output);
            conn.Execute(ToVouchSqlByValue(true), p, trans);
            int i = p.Get<int>("@OutID");
            

            int outCount = 0;
            int inCount = 0;
            #region 没盘到
            var zerocs = cs.Where(w => !vouchs.Exists(e => e.InvId == w.InvId)).ToList();
            foreach (var item in zerocs)
            {
                conn.Execute(ToVouchsSqlByValue(), new {
                    VouchId = o,
                    InvId=item.InvId,
                    ToLocatorId=item.LocatorId,
                    Batch=item.Batch,
                    Num=item.Num,
                    Price=item.Price,
                    MadeDate=item.MadeDate,
                    InvalidDate=item.InvalidDate
                }, trans);
                DeleteCurrentStock(item.Id);
                ++outCount;
            }
            #endregion

            foreach (var subs in vouchs)
            {
                int invId = subs.InvId;
                decimal num = subs.Num;
                var invcs = cs.Where(w => w.InvId == invId).ToList();
                if (invcs.Count == 0)
                {
                    #region 没有的
                    var inventory = conn.QueryFirstOrDefault("SELECT * FROM Inventory WHERE Id=@Id", new { Id = invId }, trans);
                    string invName = "";
                    if (inventory != null)
                    {
                        invName = inventory.Name;
                    }
                    //多盘的
                    throw new ArgumentNullException("盘点单明细,无记录,请通过其它入库单添加：" + invId.ToString() + ":" + invName);
                    #endregion
                }
                decimal sum = invcs.Sum(s => s.Num);
                if (num > sum)
                {
                    #region 多的
                    var item = invcs.Last();
                    //多了，要入库,入到最新
                    conn.Execute(ToVouchsSqlByValue(), new
                    {
                        VouchId = i,
                        InvId = item.InvId,
                        ToLocatorId = item.LocatorId,
                        Batch = item.Batch,
                        Num = num - sum,
                        Price = item.Price,
                        MadeDate = item.MadeDate,
                        InvalidDate = item.InvalidDate
                    }, trans);
                    UpdateCurrentStock(item.Id, item.Num + num - sum);

                    ++inCount;
                    #endregion
                }
                else if (num < sum)
                {
                    #region 少的
                    //少了，要出库,先进先出
                    decimal outnum = 0;
                    foreach (var item in invcs)
                    {
                    	++outCount;
                        outnum = outnum + item.Num;//将出库量
                        if (sum - num < outnum)//应出库量
                        {
                            conn.Execute(ToVouchsSqlByValue(), new
                            {
                                VouchId = o,
                                InvId = item.InvId,
                                ToLocatorId = item.LocatorId,
                                Batch = item.Batch,
                                Num = item.Num - (outnum - (sum - num)),
                                Price = item.Price,
                                MadeDate = item.MadeDate,
                                InvalidDate = item.InvalidDate
                            }, trans);
                            UpdateCurrentStock(item.Id, outnum - (sum - num));
                            break;
                        }
                        else
                        {
                            //多次出完
                            conn.Execute(ToVouchsSqlByValue(), new
                            {
                                VouchId = o,
                                InvId = item.InvId,
                                ToLocatorId = item.LocatorId,
                                Batch = item.Batch,
                                Num = item.Num,
                                Price = item.Price,
                                MadeDate = item.MadeDate,
                                InvalidDate = item.InvalidDate
                            }, trans);
                            DeleteCurrentStock(item.Id);
                        }
                    }
                    #endregion
                }
                else
                {
                    //刚好 不做处理
                }
            }
            if (outCount == 0)
            {
                DeleteVouch(o);
            }
            if (inCount == 0)
            {
                DeleteVouch(i);
            }
        }
        private void UnVerifyVouch(Editor editor,int id,string vouchType)
        {
            int o = 0;
            switch (vouchType)
            {
                case "010":
                case "016":
                    CanCheck(id);
                    break;
            }
            switch (vouchType)
            {
                case "008"://不合格品记录单
                    o= conn.ExecuteScalar<int>("SELECT Id FROM Vouch WHERE SourceId=@SourceId",new { SourceId = id },trans);
                    if (o>0)
                    {
                        bool scrapVouchVerify = editor.ScrapVouchVerify();
                        if (scrapVouchVerify)
                        {
                            CurrentStock(editor, o, false);
                        }
                        DeleteVouch(o);
                    }
                    break;
                case "009"://调拨单
                    bool isVerify = conn.ExecuteScalar<bool>("SELECT IsVerify FROM Vouch WHERE SourceId=@SourceId AND VouchType='003'",
                        new { SourceId = id }, trans);
                        if (isVerify)
                        {
                            throw new ArgumentException("已收货，不能弃审，必须先把收货单弃审");
                        }

                    o=conn.ExecuteScalar<int>("SELECT Id FROM Vouch WHERE SourceId=@SourceId AND VouchType='004'",
                        new { SourceId = id },trans);
                    
                    if (o>0)
                    {
                        CurrentStock(editor, o, false);
                        DeleteVouch(o);
                    }
                    
                    o=conn.ExecuteScalar<int>("SELECT Id FROM Vouch WHERE SourceId=@SourceId AND VouchType='003'",
                        new { SourceId = id },trans);
                    if (o>0)
                    {
                        DeleteVouch(o);
                    }
                    break;
                case "010"://盘点单
                case "011"://货位调整单
                case "016"://门店盘点单
                    o = conn.ExecuteScalar<int>("SELECT Id FROM Vouch WHERE SourceId=@SourceId AND VouchType='003'",
                        new { SourceId = id },trans);
                    if (o>0)
                    {
                        CurrentStock(editor, o, true);
                        DeleteVouch(o);
                    }

                    o = conn.ExecuteScalar<int>("SELECT Id FROM Vouch WHERE SourceId=@SourceId AND VouchType='004'",
                        new { SourceId = id },trans);
                    if (o>0)
                    {
                        CurrentStock(editor, o, false);
                        DeleteVouch(o);
                    }
                    break;
                case "012"://配料单
                    var vouch = conn.QueryFirstOrDefault<dynamic>("SELECT Id,IsVerify FROM Vouch WHERE SourceId=@SourceId",
                        new { SourceId = id }, trans);
                    if (null != vouch)
                    {
                        bool isVerfiy = vouch.IsVerify;
                        if (isVerfiy)
                        {
                            throw new ArgumentException("已安排生产计划，请先弃审调拨单");
                        }
                        DeleteVouch(vouch.Id);
                    }
                    break;
                case "014"://生产计划单
                    var vouch2 = conn.QueryFirstOrDefault<dynamic>("SELECT Id,IsVerify FROM Vouch WHERE SourceId=@SourceId",
                        new { SourceId = id },trans);
                    if (null != vouch2)
                    {
                        bool isVerfiy = vouch2.IsVerify;
                        if (isVerfiy)
                        {
                            throw new ArgumentException("产成品已入库，请先弃审产成品入库单");
                        }
                        DeleteVouch(vouch2.Id);
                    }
                    break;
            }
        }
        private int InsertCurrentStock(int whId,int? locatorId,int invId,
            string batch,decimal num,decimal price,DateTime? madeDate,DateTime? invalidDate,
            bool isLocator,bool isBatch,bool isShelfLife)
        {

            string sql = "INSERT INTO [dbo].[CurrentStock]"
           + "([WhId]"
           + (isLocator?",[LocatorId]":"")
           + ",[InvId]"
           + (isBatch?",[Batch]":"")
           + ",[Num],[Price]"
           + (isShelfLife?",[MadeDate],[InvalidDate]":"")
           + ",[StopFlag])"
     + "VALUES"
           + "(@WhId"
           + (isLocator?", @LocatorId":"")
           + ", @InvId"
           + (isBatch?", @Batch":"")
           + ", @Num,@Price"
           + (isShelfLife?", @MadeDate"
           + ", @InvalidDate":"")
           + ",0)";
            if(isLocator && !locatorId.HasValue)
            {
                throw new ArgumentNullException("LocatorId");
            }
            if (isBatch && string.IsNullOrEmpty(batch))
            {
                throw new ArgumentNullException("Batch");
            }
            if (isShelfLife && !madeDate.HasValue)
            {
                throw new ArgumentNullException("MadeDate");
            }
            if (isShelfLife && !invalidDate.HasValue)
            {
                throw new ArgumentNullException("InvalidDate");
            }
            var p = new DynamicParameters();
            p.Add("WhId", whId,DbType.Int32);
            if (isLocator)
            {
                p.Add("LocatorId", locatorId,DbType.Int32);
            }

            p.Add("InvId", invId,DbType.Int32);
            if (isBatch)
            {
                p.Add("Batch", batch, DbType.String);
            }

            p.Add("Num", num,DbType.Decimal);
            p.Add("Price", price, DbType.Decimal);
            if (isShelfLife)
            {
                p.Add("MadeDate", madeDate, DbType.Date);
                p.Add("InvalidDate", invalidDate, DbType.Date);
            }
            return conn.Execute(sql, p, trans);
        }
        private int UpdateCurrentStock(int id,decimal num)
        {
            if(num == 0)
            {
                return DeleteCurrentStock(id);
            }
            else
            {
                return conn.Execute("UPDATE [dbo].[CurrentStock] SET [Num] =@Num WHERE [Id] = @Id", 
                    new { Id = id, Num = num }, trans);
            }
            
        }
        private int DeleteCurrentStock(int id)
        {
            return conn.Execute("DELETE FROM [dbo].[CurrentStock] WHERE [Id] = @Id", new { Id = id }, trans);
        }
        private void CurrentStock(Editor editor,int id, bool isOut)
        {
            var vouch = conn.QueryFirst<dynamic>("SELECT * FROM Vouch WHERE Id=@Id",
                new { Id = id }, trans);
            if (null == vouch)
            {
                throw new ArgumentNullException("Vouch");
            }
            bool isVerify = vouch.IsVerify;
            if (!isVerify)
            {
                throw new ArgumentException("单据未审核");
            }
            bool globalIsBatch = editor.IsBatch();
            bool globalIsLocator = editor.IsLocator();
            bool globalIsShelfLife = editor.IsShelfLife();
            

            int vouchId = vouch.Id;
            int whId = vouch.ToWhId;

            
            var vouchs = conn.Query<dynamic>("SELECT * FROM Vouchs WHERE VouchId=@VouchId",
                new { VouchId = vouchId }, trans).ToList();
            if (null == vouchs || vouchs.Count() == 0)
            {
                throw new ArgumentNullException("没有存货");
            }
            foreach (dynamic item in vouchs)
            {
                int invId = item.InvId;

                bool invIsShelfLife = conn.ExecuteScalar<bool>("SELECT IsShelfLife FROM InvStock WHERE Id=@Id",
                    new { Id = invId }, trans);
                bool isShelfLife = globalIsShelfLife && invIsShelfLife;

                string batch = item.Batch;
                DateTime? madeDate = item.MadeDate;
                DateTime? invalidDate = item.InvalidDate;
                int? locatorId = item.ToLocatorId;

                bool isBatch = globalIsBatch && !string.IsNullOrEmpty(batch);
                bool isLocator = globalIsLocator && locatorId.HasValue;
                decimal? price = item.Price;
                string sql = "SELECT * FROM CurrentStock WHERE WhId=@WhId AND InvId=@InvId";
                var p = new DynamicParameters();
                p.Add("WhId", whId, DbType.Int32);
                p.Add("InvId", invId, DbType.Int32);
                if (!string.IsNullOrEmpty(batch))
                {
                    sql += "  AND Batch=@Batch";
                    p.Add("Batch", batch, DbType.String);
                }
                
                if (price.HasValue)
                {
                    sql += " AND Price!=@Price";
                    p.Add("Price", price.Value, DbType.Decimal);
                }
                if (madeDate.HasValue)
                {
                    sql += " AND MadeDate!=@MadeDate";
                    p.Add("MadeDate", madeDate, DbType.Date);
                }
                if (invalidDate.HasValue)
                {
                    sql += " AND InvalidDate!=@InvalidDate";
                    p.Add("InvalidDate", invalidDate, DbType.Date);
                }
                var havCount = conn.QueryFirstOrDefault<dynamic>(sql, p, trans);
                if (havCount != null)
                {
                    var inv = conn.QueryFirstOrDefault<dynamic>("SELECT * FROM Inventory WHERE Id=@Id", new { Id = invId }, trans);
                    if (inv != null)
                    {
                        DateTime? oldMadeDate = havCount.MadeDate;
                        DateTime? oldInvalidDate = havCount.InvalidDate;
                        string exStr = "不统一：";
                        exStr += inv.Name + "(" + batch + ")=>" + "现:"
                    + (price.HasValue ? "单价："+price.Value.ToString("F2") : "")
                    + (madeDate.HasValue ? "生产日期："+madeDate.Value.ToString("yyyy-MM-dd") : "")
                    + (invalidDate.HasValue ? "失效日期"+invalidDate.Value.ToString("yyyy-MM-dd") : "")
                    + "－原：" + "单价：" + havCount.Price.ToString("F2")
                    + (oldMadeDate.HasValue ? "生产日期：" + oldMadeDate.Value.ToString("yyyy-MM-dd") : "")
                    + (oldInvalidDate.HasValue ? "失效日期" + oldInvalidDate.Value.ToString("yyyy-MM-dd") : "")
                    + "\b";
                        throw new ArgumentException(exStr);
                    }
                }

                sql = "SELECT * FROM CurrentStock WHERE WhId=@WhId AND InvId=@InvId";
                if (isShelfLife)
                {
                    sql += " AND MadeDate=@MadeDate AND InvalidDate=@InvalidDate";
                }
                else
                {
                    sql += " AND MadeDate IS NULL AND InvalidDate IS NULL";
                }
                if (isBatch)
                {
                    sql += " AND Batch=@Batch";
                }
                else
                {
                    sql += " AND Batch IS NULL";
                }
                if (isLocator)
                {
                    sql += " AND LocatorId=@LocatorId";
                }
                else
                {
                    sql += " AND LocatorId IS NULL";
                }
                p = new DynamicParameters();
                p.Add("WhId", whId, DbType.Int32);
                p.Add("InvId", invId, DbType.Int32);
                if (isShelfLife)
                {
                    p.Add("InvalidDate", invalidDate, DbType.Date);
                    p.Add("MadeDate", madeDate, DbType.Date);
                }

                if (isBatch)
                {
                    p.Add("Batch", batch, DbType.String);
                }
                
                if(isLocator)
                {
                    p.Add("LocatorId", locatorId, DbType.Int32);
                }

                var d = conn.Query<dynamic>(sql, p, trans).ToList();
                decimal num = item.Num;

                if (null == d)
                {
                    if (isOut)
                    {
                        throw new ArgumentException("库存现存量不足");
                    }
                    if(!price.HasValue || price <= 0)
                    {
                        throw new ArgumentException("价格异常");
                    }
                    InsertCurrentStock(whId, locatorId, invId, batch, num,price.Value, madeDate, invalidDate,isLocator,isBatch,isShelfLife);
                }
                else
                {
                    if (d.Count > 1)
                    {
                        throw new ArgumentException("当前库存有误");
                    }
                    if (d.Count > 0)
                    {
                        dynamic currentStock = d.First();
                        int currentStockid = currentStock.Id;
                        decimal currentStockNum = currentStock.Num;
                        if (isOut && num > currentStockNum)
                        {
                            var inv = conn.QueryFirstOrDefault<dynamic>("SELECT * FROM Inventory WHERE Id=@Id", new { Id = invId }, trans);
                            string invName = "";
                            if (inv != null)
                            {
                                invName = inv.Name;
                            }
                            throw new ArgumentException(invName+"库存现存量不足");
                        }
                        
                        UpdateCurrentStock(currentStockid, isOut ? (currentStockNum - num) : (currentStockNum + num));
                    }
                    else
                    {
                        if (isOut)
                        {
                            var inv = conn.QueryFirstOrDefault<dynamic>("SELECT * FROM Inventory WHERE Id=@Id", new { Id = invId }, trans);
                            string invName = "";
                            if(inv !=null)
                            {
                                invName = inv.Name;
                            }
                            throw new ArgumentException(invName+"库存现存量不足");
                        }
                        if (!price.HasValue || price <= 0)
                        {
                            var categoryType = conn.ExecuteScalar<int>("SELECT c.Value FROM Inventory a"
+ " LEFT  JOIN InvCategory b ON a.Category = b.Id"
+ " LEFT JOIN(SELECT * FROM NameCode WHERE Type = 'CategoryType') c ON b.CategoryType = c.Value"
+ " WHERE a.Id = @Id",new { Id = invId },trans);
                            if(categoryType != 2)
                            {
                               throw new ArgumentException("价格异常");
                            }
                            
                        }
                        InsertCurrentStock(whId, locatorId, invId, batch, num,price.Value, madeDate, invalidDate,isLocator,isBatch,isShelfLife);
                    }
                }
            }
        }
        public void PreVouchRemove(object sender, PreRemoveEventArgs e)
        {
            conn = e.Editor.Db().Conn();
            trans = e.Editor.Db().Trans();
            int Id = Convert.ToInt32(e.Id);
            if (IsBalance(Id))
            {
                throw new ArgumentException("已月结不能操作单据");
            }

            int count = conn.ExecuteScalar<int>("SELECT Count(1) FROM Vouch WHERE Id=@Id AND IsVerify=1", new { Id = Id }, trans);
            if (count>0)
            {
                throw new ArgumentException("已审核，不能删除");
            }
            conn.Execute("DELETE FROM Vouchs WHERE VouchId=@Id", new { Id = Id },trans);

            Dictionary<string, object> fields = e.Values["Vouch"] as Dictionary<string, object>;
            string vouchType = fields["VouchType"].ToString();
            if(vouchType == "014")
            {
                //conn.Execute("DELETE FROM VouchsLink WHERE SourceVouchId=@Id", new { Id = Id }, trans);
                conn.Execute("DELETE FROM VouchLink WHERE SourceId=@Id", new { Id = Id }, trans);
                count = conn.ExecuteScalar<int>("SELECT COUNT(1) FROM Vouch WHERE SourceId=@SourceId", new { SourceId = Id }, trans);
                if (count > 0)
                {
                    throw new ArgumentNullException("SourceId","已关联产成品入库单，不能删除");
                }
            }

        }
        public void PostVouchRemove(object sender,PostRemoveEventArgs e)
        {
        }
        #region 零售
        private int InsertSaleOutVouch(bool isVerify,string vcConsType,string Code,int Maker,int ToWhId,DateTime dtConsDate)
        {
            string busType = "018";
            string vouchType = "015";
            switch (vcConsType)
            {
                case "PT005"://-- 门店报损
                    busType = "020";
                    vouchType = "004";
                    break;
                case "PT006"://-- 门店品尝
                    busType = "022";
                    vouchType = "004";
                    break;
                case "PT007"://-- 门店退货
                    busType = "021";
                    vouchType = "004";
                    break;
            }

            string sql = "DECLARE @T TABLE(Id int);INSERT INTO [dbo].[Vouch]"
       + "([Code]"
       + ",[VouchType]"
       + ",[BusType]"
       + ",[VouchDate]"
       + ",[ToWhId]"
       + ",[Maker]"
       + ",[MakeDate]"
       + ",[MakeTime]"
       + (isVerify ?
       ",[IsVerify]"
       + ",[Verifier]"
       + ",[VerifyDate]"
       + ",[VerifyTime]"
       : "")
       + ")"
 + " OUTPUT INSERTED.Id INTO @T "
 + "VALUES( "
       + "@Code"
       + ", @VouchType"
       + ", @BusType"
       + ", @dtConsDate"
       + ", @ToWhId"
       + ", @Maker"
       + ", @dtConsDate"
       + ", @dtConsTime"
       + (isVerify ?
       ", 1"
       + ", @Verifier"
       + ", @dtConsDate"
       + ", @dtConsTime"
       : "")
       + ");"
       + "SELECT @OutID=Id FROM @T";

            DynamicParameters p = new DynamicParameters();


            p.Add("Code", vouchType + Code, DbType.String);
            p.Add("VouchType", vouchType, DbType.String);

            p.Add("BusType", busType, DbType.String);
            p.Add("Maker", Maker, DbType.Int32);
            p.Add("Verifier", Maker, DbType.Int32);
            p.Add("ToWhId", ToWhId, DbType.Int32);
            p.Add("dtConsDate", dtConsDate, DbType.Date);
            p.Add("dtConsTime", dtConsDate, DbType.DateTime);
            p.Add("@OutID", null, DbType.Int32, ParameterDirection.Output);
            conn.Execute(sql, p, trans);
            int o = p.Get<int>("OutID");
            return o;
        }
        private void InsertSaleOutVouchs(int o,int InvId,decimal Num,decimal Price)
        {
            string sql = "INSERT INTO [dbo].[Vouchs]"
               + "([VouchId]"
               + ",[InvId]"
               + ",[Num]"
               + ",[Price]"
    + ")VALUES( "
               + "@VouchId"
               + ", @InvId"
               + ", @Num"
               + ", @Price)";
            DynamicParameters p = new DynamicParameters();
            p.Add("VouchId", o, DbType.Int32);
            p.Add("InvId", InvId, DbType.Int32);
            p.Add("Num", Num, DbType.Decimal);
            p.Add("Price", Price, DbType.Currency);

            conn.Execute(sql, p, trans);
        }
        public void SaleOutVouch(IDbConnection _conn)
        {
            conn = _conn;
            
            try
            {
                conn.Open();
                trans = _conn.BeginTransaction();

                #region 获取可出库零售

                string sql = "SELECT DISTINCT a.iSerial FROM "
+ " (SELECT TOP 100 iSerial"
+ " FROM tbConsItemOther a"
+ " LEFT JOIN Vouch b on b.Code = '015' + a.vcDeptId + Convert(VARCHAR(20), a.iSerial) OR b.Code = '004' + a.vcDeptId + Convert(VARCHAR(20), a.iSerial)"
+ " LEFT JOIN Users c on a.vcOperName = c.FullName"
+ " WHERE a.cFlag = '0' AND b.Id IS NULL AND c.WhId IS NOT NULL"
+ " ORDER BY iSerial) a";

                List<long> serials = conn.Query<long>(sql, null, trans).ToList();
                #endregion

                foreach (long serial in serials)
                {
                    #region 出库
                    sql = "SELECT a.vcDeptId+Convert(VARCHAR(20),a.iSerial) AS Code,"
    + " c.WhId AS ToWhId,c.Id AS Maker,"
    + " e.Id AS InvId,iCount AS Num,a.nPrice AS Price,"
    + " f.vcConsType,a.dtConsDate"
    + " FROM tbConsItemOther a"
    + " LEFT JOIN Vouch b on b.Code = '015' + a.vcDeptId + Convert(VARCHAR(20), a.iSerial) OR b.Code = '004' + a.vcDeptId + Convert(VARCHAR(20), a.iSerial)"
    + " LEFT JOIN Users c on a.vcOperName = c.FullName"
    + " LEFT JOIN Depts d on a.vcDeptID = d.Code"
    + " LEFT JOIN Inventory e on a.vcGoodsId = e.Code"
    + " LEFT JOIN  tbBillOther f ON a.iSerial=f.iSerial AND a.vcDeptId=f.vcDeptId"
    + " WHERE a.cFlag = '0' AND a.iSerial=@iSerial"
    + " AND b.Id IS NULL AND c.WhId IS NOT NULL AND c.DeptId = d.Id AND a.iSerial IS NOT NULL";

                    List<VouchAll> vouchAll = conn.Query<VouchAll>(sql, new { iSerial = serial },trans).ToList();
                    #endregion

                    if (vouchAll.Count > 0)
                    {
                        var vouchs = vouchAll.Select(s => new { s.ToWhId, s.Code, s.Maker, s.vcConsType, s.dtConsDate }).Distinct().ToList();
                        foreach (var vouch in vouchs)
                        {
                            var subVouch = vouchAll.Where(w => w.Code == vouch.Code).ToList();
                            int o = InsertSaleOutVouch(true, vouch.vcConsType, vouch.Code, vouch.Maker, vouch.ToWhId,vouch.dtConsDate);
                            foreach (var sub in subVouch)
                            {
                                InsertSaleOutVouchs(o, sub.InvId, sub.Num, sub.Price);
                            }
                        }
                    }
                }
                
                
                trans.Commit();
            }
            catch (Exception ex)
            {
                LogManager.GetLogger("SaleOutVouch").Error(ex);
                if (trans != null)
                {
                    trans.Rollback();
                }
                
            }
            finally
            {
                conn.Close();
            }
        }
        public void SaleCancel(IDbConnection _conn)
        {
            conn = _conn;
            try
            {
                conn.Open();
                trans = conn.BeginTransaction();

                string sql = "SELECT b.Id FROM tbConsItemOther a"
+ " LEFT JOIN Vouch b on b.Code = '015' + a.vcDeptId + Convert(VARCHAR(20), a.iSerial)"
+ " WHERE a.cFlag = '9' AND b.Id IS NOT NULL";
                List<int> vouchIds = conn.Query<int>(sql, null, trans).ToList();
                if (vouchIds.Count > 0)
                {
                    foreach(int vouchId in vouchIds)
                    {
                        DeleteVouch(vouchId);
                    }
                    
                }
                trans.Commit();
            }
            catch(Exception ex)
            {
                LogManager.GetLogger("SaleCancel").Error(ex);
                if (trans != null)
                {
                    trans.Rollback();
                }
            }
            finally
            {
                conn.Close();
            }
        }
        #endregion
    }
}
