using NLog;
using System.Web;
using System.Web.Mvc;

namespace DXInfo.Web
{
    public class DXInfoMvcHandleErrorAttribute: HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            LogManager.GetLogger("MvcException").Log(LogLevel.Error, filterContext.Exception, filterContext.Exception.Message);
            base.OnException(filterContext);
        }
    }
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new DXInfoMvcHandleErrorAttribute());
            filters.Add(new MvcLogFilterAttribute());
        }
    }
}
