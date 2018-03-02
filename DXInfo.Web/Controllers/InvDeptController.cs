using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DXInfo.Web.Controllers
{
    [Authorize]
    public class InvDeptController : Controller
    {
        // GET: InvDept
        public ActionResult BreadGoods()
        {
            ViewBag.title = "面包店管理";
            return View();
        }
    }
}