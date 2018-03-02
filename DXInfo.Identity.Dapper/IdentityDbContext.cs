using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DXInfo.Identity.Dapper
{
    public class IdentityDbContext : IDisposable
    {
        private IDbConnection _conn { get; set; }

        public IDbConnection Connection
        {
            get
            {
                if (_conn.State == ConnectionState.Closed)
                    _conn.Open();

                return _conn;
            }
        }

        public IdentityDbContext(ConnectionStringSettings connString)
        {
            if (null == connString)
            {
                throw new ArgumentNullException("connString");
            }

            var provider = DbProviderFactories.GetFactory(connString.ProviderName);
            _conn = provider.CreateConnection();
            _conn.ConnectionString = connString.ConnectionString;
        }

        public void Dispose()
        {
            if (_conn != null)
            {
                if (_conn.State == ConnectionState.Open)
                {
                    _conn.Close();
                    _conn.Dispose();
                }
                _conn = null;
            }
        }
    }

}
