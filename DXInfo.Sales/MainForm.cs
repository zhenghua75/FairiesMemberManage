using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DXInfo.Sales
{
    public partial class MainForm : Form
    {
        private Int64 count = 0;
        public MainForm()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            //object o = ConfigurationManager.GetSection("SaleOut");
            //this.contextMenuStrip1.Items.Add("面包派对", null, BreadParty);
        }
        private void BreadParty(object sender, EventArgs e)
        {
            //MessageBox.Show("面包派对");
        }

        private void Form1_SizeChanged(object sender, EventArgs e)
        {
            if(WindowState == FormWindowState.Minimized)
            {
                this.Hide();
            }
        }

        private void notifyIcon1_DoubleClick(object sender, EventArgs e)
        {
            this.Show();
        }

        private void mbpd_Click(object sender, EventArgs e)
        {
            this.label4.Text = "启动";
            System.Timers.Timer timer = new System.Timers.Timer(1000 * 60 * 0.5);
            timer.Elapsed += Timer_Elapsed;
            timer.Enabled = true;
            timer.AutoReset = true;
            timer.SynchronizingObject = this;
            timer.Start();
        }
        private void Timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            ++count;
            this.label2.Text = count.ToString();
            this.label4.Text = "正在运行";
            ConnectionStringSettings connString = ConfigurationManager.ConnectionStrings["DefaultConnection"];
            var provider = DbProviderFactories.GetFactory(connString.ProviderName);
            IDbConnection conn = provider.CreateConnection();
            conn.ConnectionString = connString.ConnectionString;
            DXInfo.DataTables.Events.Vouch vouch = new DataTables.Events.Vouch();
            
            vouch.SaleOutVouch(conn);
            vouch.SaleCancel(conn);
            this.label4.Text = "5分钟后下次运行";
        }
    }
}
