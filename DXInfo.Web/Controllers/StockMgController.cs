using Dapper;
using DXInfo.Identity.Dapper;
using DXInfo.Web.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DXInfo.Web.Controllers
{
    [Authorize]
    public class StockMgController : Controller
    {
        // GET: StockMg
        public ActionResult InvCategory()
        {
            ViewBag.Title = "库存存货分类";
            return View();
        }

        public ActionResult Inventory()
        {
            ViewBag.Title = "库存存货档案";
            return View();
        }

        public ActionResult MeasurementUnitGroup()
        {
            ViewBag.Title = "库存计量单位组";
            return View();
        }

        public ActionResult UnitOfMeasure()
        {
            ViewBag.Title = "库存计量单位";
            return View();
        }

        public ActionResult StockManageWarehouse()
        {
            ViewBag.Title = "库存仓库档案";
            return View();
        }

        public ActionResult StockManageLocator()
        {
            ViewBag.Title = "库存货位档案";
            return View();
        }

        public ActionResult StockManageVendor()
        {
            ViewBag.Title = "库存供应商档案";
            return View();
        }

        public ActionResult StockManagePeriod()
        {
            ViewBag.Title = "库存月结周期";
            return View();
        }

        public ActionResult BillOfMaterials()
        {
            ViewBag.Title = "配方";
            return View();
        }

        public ActionResult StockManageBatchStop()
        {
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            ViewBag.Title = "当前库存状态维护";
            return View();
        }

        public ActionResult Vouch(string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            string funcname = "";
            switch (type)
            {
                case "001":
                    ViewBag.Title = "库存采购入库单";
                    funcname = "StockManagePurchaseInStock";
                    break;
                case "002":
                    ViewBag.Title = "库存销售出库单";
                    funcname = "StockManageSaleOutStock";
                    break;
                case "006":
                    ViewBag.Title = "库存产成品入库单";
                    funcname = "StockManageProductInStock";
                    break;
                case "012":
                    ViewBag.Title = "叫货单";
                    funcname = "StockManageMixVouch";
                    break;
                case "005":
                    ViewBag.Title = "库存材料出库单";
                    funcname = "StockManageMaterialOutStock";
                    break;
                case "003":
                    ViewBag.Title = "库存其它入库单";
                    funcname = "StockManageOtherInStock";
                    break;
                case "004":
                    ViewBag.Title = "库存其它出库单";
                    funcname = "StockManageOtherOutStock";
                    break;
                case "008":
                    ViewBag.Title = "库存不合格品记录单";
                    funcname = "StockManageScrapVouch";
                    break;
                case "009":
                    ViewBag.Title = "库存调拨单";
                    funcname = "StockManageTransVouch";
                    break;
                case "010":
                    ViewBag.Title = "库存盘点单";
                    funcname = "StockManageCheckVouch";
                    break;
                case "011":
                    ViewBag.Title = "库存货位调整单";
                    funcname = "StockManageAdjustLocatorVouch";
                    break;
                case "013":
                    ViewBag.Title = "库存月结";
                    funcname = "StockManageMonthBalance";
                    break;
                case "014":
                    ViewBag.Title = "生产计划单";
                    funcname = "StockManageMixVouchMakeUp";
                    break;
                case "007":
                    ViewBag.Title = "期初库存";
                    funcname = "StockManageInitStock";
                    break;
                case "016":
                    ViewBag.Title = "门店盘点单";
                    funcname = "StockManageDeptCheckVouch";
                    break;
                case "015":
                    ViewBag.Title = "库存零售出库单";
                    funcname = "StockManageRetailOutStock";
                    break;
                default:
                    return Redirect("/Home/Error");
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == funcname);
            if (func==null)
            {
                return Redirect("/Home/Error?err=401");
            }
            ViewBag.Type = type;
            return View();
        }

        //public ActionResult VouchWF(string id, string type)
        //{
        //    ViewBag.Title = "通用库存业务单";
        //    ViewBag.Id = id;
        //    ViewBag.Type = type;
        //    return View();
        //}
        public ActionResult PurchaseInStock(string id,string type)
        {
            if(string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存采购入库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存采购入库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManagePurchaseInStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }
            
            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult SaleOutStock(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存销售出库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存销售出库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageSaleOutStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult ProductInStock(string id, string type,string sid,string optab)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存产成品入库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存产成品入库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageProductInStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.sid = sid;
            ViewBag.Mvtype = type;
            ViewBag.Optab = optab;
            return View();
        }
        public ActionResult MixVouch(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
            }
            else
            {
                ViewBag.Mvid = id;
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageMixVouch");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }
            ViewBag.Title = "叫货业务流程--叫货单";
            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult MaterialOutStock(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存材料出库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存材料出库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageMaterialOutStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult OtherInStock(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存其它入库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存其它入库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageOtherInStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult OtherOutStock(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存其它出库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存其它出库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageOtherOutStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }

        public ActionResult RetailOutStock(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存零售出库单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存零售出库单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageRetailOutStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult ScrapVouch(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存不合格品记录单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存不合格品记录单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageScrapVouch");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult TransVouch(string id, string type,int sid=0)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存调拨单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存调拨单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageTransVouch");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }

        //public class VouchsLink
        //{
        //    public int Id { get; set; }
        //    public int VouchId { get; set; }
        //    public int SourceVouchId { get; set; }
        //}

        //private List<VouchsLink> getVouchLink(int vouchId)
        //{
        //    ApplicationDbContext context = ApplicationDbContext.Create();
        //    using (IDbConnection conn = context.Connection)
        //    {
        //        var p = new DynamicParameters();
        //        p.Add("VouchId", vouchId, DbType.Int32);
        //        return conn.Query<VouchsLink>("SELECT * FROM VouchsLink WHERE VouchId=@VouchId", p).ToList();
        //    }
        //}

        public ActionResult CheckVouch(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存盘点单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存盘点单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageCheckVouch");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }
        public ActionResult AdjustLocatorVouch(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存货位调整单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存货位调整单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageAdjustLocatorVouch");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }

        public ActionResult MixVouchMakeUp(string id, string type,string optab)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "叫货业务流程--生产计划单";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "叫货业务流程--生产计划单";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageMixVouchMakeUp");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }
            if (string.IsNullOrEmpty(optab))
            {
                optab = "tab1";
            }
            ViewBag.Optab = optab;
            ViewBag.Mvtype = type;
            return View();
        }

        public ActionResult MonthBalance(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "库存月结添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "库存月结修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageMonthBalance");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }

        public ActionResult InitStock(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "期初库存添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "期初库存修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageInitStock");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }

        public ActionResult DeptCheckVouch(string id, string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return Redirect("/Home/Error");
            }
            if (User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            if (string.IsNullOrEmpty(id))
            {
                ViewBag.Mvid = "0";
                ViewBag.Title = "门店盘点单添加";
            }
            else
            {
                ViewBag.Mvid = id;
                ViewBag.Title = "门店盘点单修改";
            }
            List<Func> funcs = User.Identity.GetUserFuncs();
            Func func = funcs.FirstOrDefault(f => f.Name == "StockManageDeptCheckVouch");
            if (func == null)
            {
                return Redirect("/Home/Error?err=401");
            }

            ViewBag.Mvtype = type;
            return View();
        }

        public ActionResult ReportCurrentStock()
        {
            if (User.Identity.GetUser().AuthorityType!=0 && User.Identity.GetWhId() == null)
            {
                return Redirect("/Home/Error?err=4031");
            }
            ViewBag.Title = "库存现存量";
            return View();
        }

        public ActionResult ReportRdSummary()
        {
            ViewBag.Title = "库存收发存汇总表";
            return View();
        }

        public ActionResult ReportStockDayBook()
        {
            ViewBag.Title = "库存流水帐";
            return View();
        }

        public ActionResult ReportBatchSummary()
        {
            ViewBag.Title = "库存批次汇总表";
            return View();
        }

        public ActionResult ReportShelfLifeWarning()
        {
            ViewBag.Title = "库存保质期预警";
            return View();
        }

        public ActionResult ReportSecurityStock()
        {
            ViewBag.Title = "库存安全库存预警";
            return View();
        }

        public ActionResult ReportAboveStock()
        {
            ViewBag.Title = "库存超储存货查询";
            return View();
        }

        public ActionResult ReportLowStock()
        {
            ViewBag.Title = "库存短缺存货查询";
            return View();
        }
        public ActionResult ReportVouchSummary()
        {
            ViewBag.Title = "库存收发分类汇总表";
            return View();
        }
    }
}