using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity;
using DXInfo.Web.Models;

namespace DXInfo.Web.Controllers
{
    [Authorize]
    public class SystemController : Controller
    {
        public ActionResult Users()
        {
            ViewBag.title = "用户管理";
            return View();
        }

        public ActionResult UserInfo()
        {
            ViewBag.title = "个人信息";
            ViewBag.Tabid = Request.QueryString["tab"];
            ViewBag.Uid = User.Identity.GetUserId();
            if (string.IsNullOrEmpty(ViewBag.Tabid))
            {
                ViewBag.Tabid = "1";
            }
            string mappedPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Scripts/homecontrols.json");
            string fileText = System.IO.File.ReadAllText(mappedPath);
            List<HomeControlViewModel> configs = JsonConvert.DeserializeObject<List<HomeControlViewModel>>(fileText);
            List<HomeControlViewModel> curcontrols = new List<HomeControlViewModel>();
            foreach(HomeControlViewModel ctrl in configs)
            {
                if (User.Identity.GetFunc(ctrl.FuncName) != null)
                {
                    curcontrols.Add(new HomeControlViewModel
                    {
                        FuncId = ctrl.FuncId,
                        FuncName=ctrl.FuncName,
                        ControlImg=ctrl.ControlImg,
                        ControlTitle=ctrl.ControlTitle,
                        ControlDesc=ctrl.ControlDesc
                    });
                }
            }
            ViewBag.Controls = curcontrols;
            return View();
        }

        public ActionResult Roles()
        {
            ViewBag.title = "角色管理";
            return View();
        }
        public ActionResult RoleFuncs()
        {
            ViewBag.title = "权限管理";
            return View();
        }
        public ActionResult RoleAssign()
        {
            ViewBag.title = "角色分配";
            return View();
        }
        public ActionResult SysParaSet()
        {
            ViewBag.title = "系统参数设定";
            return View();
        }

        public ActionResult Depts()
        {
            ViewBag.title = "门店管理";
            return View();
        }
    }
}
