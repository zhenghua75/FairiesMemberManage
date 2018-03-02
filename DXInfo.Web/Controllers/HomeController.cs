using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DXInfo.Web.Models;
using System.Threading.Tasks;
using System.Net.Http;
using System.Web.Script.Serialization;
using Microsoft.AspNet.Identity;

namespace DXInfo.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public static T JSONToObject<T>(string jsonText)
        {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            try
            {
                return jss.Deserialize<T>(jsonText);
            }
            catch(Exception ex)
            {
                throw new Exception("JSONToObject(): "+ ex.Message);
            }
        }

        public static Dictionary<string, string> DataRowFromJSON(string jsonText)
        {
            return JSONToObject<Dictionary<string, string>>(jsonText);
        }

        public ActionResult Index()
        {
            ViewBag.Title = "面包派对数据中心-主控台";
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Title = "关于";
            return View();
        }

        [AllowAnonymous]
        public ActionResult Login(string ReturnUrl)
        {
            ViewBag.Title = "面包派对数据中心-登录";
            ViewBag.returnUrl = ReturnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginBindingModel model)
        {
            ViewBag.Title = "面包派对数据中心-登录";
            ViewBag.returnUrl = Request.Form["returnUrl"];
            if (ModelState.IsValid)
            {
                //HttpClient client = new HttpClient();
                //client.BaseAddress = new Uri("http://" + Request.Url.Authority);
                //var content = new FormUrlEncodedContent(new Dictionary<string, string>()
                //{
                //  {"grant_type", "password"},
                //  {"username", model.UserName},
                //  {"password", model.Password}
                // });
                //var response = await client.PostAsync("token", content);
                //if (!response.IsSuccessStatusCode)
                //{
                //    var result = await response.Content.ReadAsStringAsync();
                //    Dictionary<string, string> errorinfo = DataRowFromJSON(result);
                //    ModelState.AddModelError(errorinfo["error"], errorinfo["error_description"]);
                //}
                //else
                //{
                //    return Redirect(ViewBag.returnUrl);
                //}
                return Redirect(ViewBag.returnUrl);
            }
            else
            {
                ModelState.AddModelError("invalid_grant", "请重新检查用户名和密码。");
            }

            return View(model);
        }

        [AllowAnonymous]
        public ActionResult Error()
        {
            ViewBag.Title = "错误";
            switch (Request.QueryString["err"])
            {
                case "401":
                    ViewBag.errorcode = "401";
                    ViewBag.errormsg = "偶，您的权限已被回收。";
                    ViewBag.errordesc = "请联系 系统管理员 为您分配权限。";
                    break;
                case "4031":
                    ViewBag.errorcode = "4031";
                    ViewBag.errormsg = "您没有所属仓库，请先配置仓库。";
                    ViewBag.errordesc = "请联系 系统管理员 为您配置仓库信息。";
                    break;
                default:
                    ViewBag.errorcode = "404";
                    ViewBag.errormsg = "偶，您所访问的页面不在地球上。";
                    ViewBag.errordesc = "请联系 昆明道讯科技有限公司。";
                    break;
            }
            return View();
        }

        [AllowAnonymous]
        public ActionResult test()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult LocalLogin()
        {
            return View();
        }

        public ActionResult ReportAssociator()
        {
            ViewBag.Title = "会员资料查询";
            return View();
        }

        public ActionResult ReportConsDetail()
        {
            ViewBag.Title = "消费统计查询";
            return View();
        }

        public ActionResult ReportFillQuery()
        {
            ViewBag.Title = "会员充值查询";
            return View();
        }

        public ActionResult ReportConsKindQuery()
        {
            ViewBag.Title = "消费分类统计";
            return View();
        }

        public ActionResult ReportBusiLogQuery()
        {
            ViewBag.Title = "操作员日志";
            return View();
        }

        public ActionResult ReportGoodsTopQuery()
        {
            ViewBag.Title = "商品销售排行榜";
            return View();
        }

        public ActionResult ReportBusiIncome()
        {
            ViewBag.Title = "业务量统计";
            return View();
        }

        public ActionResult ReportSalesChart()
        {
            ViewBag.Title = "销售曲线图";
            return View();
        }

        public ActionResult ReportDailyCashQuery()
        {
            ViewBag.Title = "当日收银";
            return View();
        }

        public ActionResult ReportSpecConsQuery()
        {
            ViewBag.Title = "特殊消费统计";
            return View();
        }

        public ActionResult ReportCardTopQuery()
        {
            ViewBag.Title = "会员消费排行榜";
            return View();
        }

        public ActionResult ReportIntegralLog()
        {
            ViewBag.Title = "会员积分查询";
            return View();
        }
    }
}
