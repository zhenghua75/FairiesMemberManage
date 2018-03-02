using System.Web;
using System.Web.Optimization;

namespace DXInfo.Web
{
    public class BundleConfig
    {
        // 有关绑定的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            // 使用要用于开发和学习的 Modernizr 的开发版本。然后，当你做好
            // 生产准备时，请使用 http://modernizr.com 上的生成工具来仅选择所需的测试。
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/kmdxUIcss").Include(
                "~/Content/animate.css",
                "~/Content/kmdxUI/css/kmdxUI.css"));

            bundles.Add(new StyleBundle("~/Content/datatablescss").Include(
                "~/Scripts/vendors/DataTables/css/dataTables.bootstrap.css",
                "~/Scripts/vendors/DataTables/css/responsive.bootstrap.css",
                "~/Scripts/vendors/DataTables/css/buttons.bootstrap.css",
                "~/Scripts/vendors/DataTables/css/select.bootstrap.css",
                "~/Scripts/vendors/DataTables/css/editor.bootstrap.css",
                "~/Scripts/vendors/DataTables/css/buttons.bootstrap.css",
                "~/Scripts/vendors/select2/select2.css"));

            bundles.Add(new StyleBundle("~/Content/webcss").Include(
                "~/Scripts/vendors/pace/themes/orange/pace-theme-flash.css",
                "~/Content/default.css"));

            bundles.Add(new ScriptBundle("~/bundles/kmdxUIjs").Include(
                "~/Content/kmdxUI/js/jquery/jquery-1.12.3.min.js",
                "~/Content/kmdxUI/js/UI.js"));

            bundles.Add(new ScriptBundle("~/bundles/datatablesjs").Include(
                "~/Content/kmdxUI/js/bootstrap.min.js",
                "~/Scripts/vendors/DataTables/js/jquery.dataTables.js",
                "~/Scripts/vendors/DataTables/js/dataTables.responsive.js",
                "~/Scripts/vendors/DataTables/js/dataTables.buttons.js",
                "~/Scripts/vendors/DataTables/js/dataTables.select.js",
                "~/Scripts/vendors/DataTables/js/k-editor.js",
                "~/Scripts/vendors/DataTables/js/dataTables.bootstrap.js",
                "~/Scripts/vendors/DataTables/js/responsive.bootstrap.js",
                "~/Scripts/vendors/DataTables/js/buttons.bootstrap.js",
                "~/Scripts/vendors/DataTables/js/editor.bootstrap.js",
                "~/Scripts/vendors/JSZip-2.5.0/jszip.js",
                "~/Scripts/vendors/DataTables/js/buttons.html5.js",
                "~/Scripts/vendors/DataTables/js/buttons.print.js",
                "~/Scripts/vendors/moment/moment.min.js",
                "~/Scripts/vendors/select2/select2.js"));

            bundles.Add(new ScriptBundle("~/bundles/kmdxjs").Include(
                "~/Scripts/vendors/pace/pace.min.js"));
        }
    }
}
