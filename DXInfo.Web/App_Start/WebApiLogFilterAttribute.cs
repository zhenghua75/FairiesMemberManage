using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;

namespace DXInfo.Web
{
    public class WebApiLogFilterAttribute:ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            LogManager.GetLogger("WebApiLog").Info("WebApiLog");
        }
    }
}