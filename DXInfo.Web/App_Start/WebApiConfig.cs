using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Net.Http.Formatting;
using Microsoft.Owin.Security.Cookies;
using System.Web.Http.Filters;
using NLog;
using System.Web.Http.Cors;

namespace DXInfo.Web
{
    public class DxInfoWebApiHandleErrorAttribute: ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            LogManager.GetLogger("WebApiException").Log(LogLevel.Error, actionExecutedContext.Exception, actionExecutedContext.Exception.Message);
            base.OnException(actionExecutedContext);
        }
    }
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务
            // 将 Web API 配置为仅使用不记名令牌身份验证。
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Filters.Add(new HostAuthenticationFilter(CookieAuthenticationDefaults.AuthenticationType));

            config.Filters.Add(new WebApiLogFilterAttribute());
            config.Filters.Add(new DxInfoWebApiHandleErrorAttribute());

            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            // Web API 路由
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            
        }
    }
}
