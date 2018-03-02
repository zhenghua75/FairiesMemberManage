using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using NLog.Owin.Logging;
using NLog;
using NLog.Config;
using Microsoft.Owin.Cors;

[assembly: OwinStartup(typeof(DXInfo.Web.Startup))]

namespace DXInfo.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.UseNLog();
            app.UseCors(CorsOptions.AllowAll);
        }
    }
}
