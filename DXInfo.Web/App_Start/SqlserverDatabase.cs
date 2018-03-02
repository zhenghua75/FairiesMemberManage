using DataTables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace DXInfo.Web
{
    public class SqlserverDatabase: Database
    {
        public SqlserverDatabase():base("sqlserver", WebConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString)
        {

        }
    }
}
