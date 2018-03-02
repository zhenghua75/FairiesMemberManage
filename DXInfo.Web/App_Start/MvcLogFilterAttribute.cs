using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DXInfo.Web
{
    public class MvcLogFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            LogManager.GetLogger("MvcLog").Info("MvcLog");
        }
    }
}