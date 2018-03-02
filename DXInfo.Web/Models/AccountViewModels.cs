using System;
using System.Collections.Generic;

namespace DXInfo.Web.Models
{
    // AccountController 操作返回的模型。

    public class ExternalLoginViewModel
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public string State { get; set; }
    }

    public class ManageInfoViewModel
    {
        public string LocalLoginProvider { get; set; }

        public string UserName { get; set; }

        public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

        public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
    }

    public class UserInfoViewModel
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string AuthorityType { get; set; }
        public bool LockoutEnabled { get; set; }
        public string DeptName { get; set; }
        public string WhName { get; set; }
    }
    public class UsersViewModel
    {
        public class AspNetUsers
        {
            public string UserName { get; set; }
            public string FullName { get; set; }
            public int AuthorityType { get; set; }
            public bool LockoutEnabled { get; set; }
        }
        public class Depts
        {
            public string DeptName { get; set; }
        }
        public class NameCode
        {
            public string Name { get; set; }
        }
    }

    public class RolesViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
    public class NameCodeViewModel
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }
    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }

    public class ChangePasswordViewModel
    {
        public string OldPassword { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
    }

    public class HomeControlViewModel
    {
        public int FuncId { get; set; }

        public string FuncName { get; set; }

        public string ControlImg { get; set; }

        public string ControlTitle { get; set; }

        public string ControlDesc { get; set; }
    }
}
