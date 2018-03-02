using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.Owin;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Net.Http;
using System.Linq;
using Newtonsoft.Json;
using System.Net;
using System.Collections;
using DXInfo.Identity.Dapper;
using System.Configuration;

namespace DXInfo.Web.Models
{

    public class ApplicationUser : IdentityUser
    {

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager manager, string authenticationType)
        {
            // 请注意，authenticationType 必须与 CookieAuthenticationOptions.AuthenticationType 中定义的相应项匹配
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // 在此处添加自定义用户声明
            return userIdentity;
        }
    }
    
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext() : base(ConfigurationManager.ConnectionStrings["DefaultConnection"]) { }
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
    
    public class CustomClaims
    {
        public const string Editor = "Editor";
    }
    public class ClaimAuthorizeAttribute : AuthorizeAttribute
    {
        readonly List<string> _claimTypes = new List<string>();
        readonly Hashtable _vouchType = new Hashtable();
        public ClaimAuthorizeAttribute(string requiredClaimType, params string[] requiredClaimTypes)
        {
            _claimTypes.Add(requiredClaimType);
            if (requiredClaimTypes != null)
            {
                _claimTypes.AddRange(requiredClaimTypes);
            }
            _vouchType.Add("001", "StockManagePurchaseInStock");
            _vouchType.Add("002", "StockManageSaleOutStock");
            _vouchType.Add("003", "StockManageOtherInStock");
            _vouchType.Add("004", "StockManageOtherOutStock");
            _vouchType.Add("005", "StockManageMaterialOutStock");
            _vouchType.Add("006", "StockManageProductInStock");
            _vouchType.Add("007", "StockManageInitStock");
            _vouchType.Add("008", "StockManageScrapVouch");
            _vouchType.Add("009", "StockManageTransVouch");
            _vouchType.Add("010", "StockManageCheckVouch");
            _vouchType.Add("011", "StockManageAdjustLocatorVouch");
            _vouchType.Add("012", "StockManageMixVouch");
            _vouchType.Add("016", "StockManageDeptCheckVouch");
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var userManager = actionContext.Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ClaimsPrincipal claimsPrincipal = actionContext.Request.GetOwinContext().Authentication.User;
            if (claimsPrincipal == null || !claimsPrincipal.Identity.IsAuthenticated)
            {
                return false;
            }
            string func = string.Empty;
            if (_claimTypes.Any(type => type == CustomClaims.Editor))
            {
                IEnumerable<KeyValuePair<string, string>> queryString = actionContext.Request.GetQueryNameValuePairs();
                KeyValuePair<string, string> model = queryString.First(f => f.Key == "model");
                if (!string.IsNullOrEmpty(model.Value))
                {
                    func = model.Value;
                }
                if(func == "Vouch")
                {
                    KeyValuePair<string, string> vouchType = queryString.First(f => f.Key == "VouchType");
                    if (!string.IsNullOrEmpty(vouchType.Value))
                    {
                        object o = _vouchType[vouchType.Value];
                        if(null != o)
                        {
                            func = o.ToString();
                        }
                    }
                }
                Func funcObj = claimsPrincipal.Identity.GetFunc(func);
                return funcObj != null;
            }
            else
            {
                var hasAllClaims =
                _claimTypes.All(
                    type =>
                        claimsPrincipal.Identity.GetFunc(func)!=null);

                return hasAllClaims;
            }
        }
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            //base.HandleUnauthorizedRequest(actionContext);
            var content = JsonConvert.SerializeObject(new { State = HttpStatusCode.Unauthorized });
            actionContext.Response = new HttpResponseMessage
            {
                Content = new StringContent(content, Encoding.UTF8, "application/json"),
                StatusCode = HttpStatusCode.Unauthorized
            };
        }
    }
}