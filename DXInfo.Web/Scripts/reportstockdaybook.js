var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportstockdaybookpanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=StockManageStockDayBook",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"stockdaybook"
};

var g_fields = [
    {
        label: "单号",
        name: "Vouch.Code",
        istable: true,
        searchidx: 0
    }, {
        label: "单据日期",
        name: "Vouch.VouchDate",
        istable: true,
        searchidx: 1,
        type:"datetimebetween"
    }, {
        label: "收发类型",
        name: "NameCodeBusType.Name",
        istable: true
    }, {
        label: "收发类型",
        name: "Vouch.BusType",
        istable: true,
        searchidx: 3,
        type: "select",
        istablehide:true
    }, {
        label: "仓库",
        name: "InWarehouse.Name",
        istable: true
    }, {
        label: "仓库",
        name: "Vouch.ToWhId",
        istable: true,
        searchidx:5,
        type: "select",
        istablehide:true
    }, {
        label: "是否审核",
        name: "Vouch.IsVerify",
        istable: true,
        render:function(val,type,row){
            return val == true ? '已审核' : '';
        }
    }, {
        label: "审核日期",
        name: "Vouch.VerifyDate",
        istable: true
    }, {
        label: "存货",
        name: "Inventory.Name",
        istable: true
    }, {
        label: "存货",
        name: "Vouchs.InvId",
        istable: true,
        searchidx: 9,
        type: "select2",
        istablehide:true
    }, {
        label: "规格型号",
        name: "Inventory.Specs",
        istable: true,
        searchable: false,
        orderable:false
    }, {
        label: "计量单位",
        name: "UOM.Name",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "批号",
        name: "Vouchs.Batch",
        istable: true,
        searchidx: 12
    }, {
        label: "数量",
        name: "Vouchs.Num",
        istable: true,
        searchable: false
    }, {
        label: "生产日期",
        name: "Vouchs.MadeDate",
        istable: true,
        searchable: false,
        orderable:false
    }, {
        label: "失效日期",
        name: "Vouchs.InvalidDate",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "制单日期",
        name: "Vouch.MakeTime",
        istable: true,
        searchable: false,
        istablehide:true
    }
];