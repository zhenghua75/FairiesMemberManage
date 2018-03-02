var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportbatchsummarypanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=StockManageBatchSummary",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"batchsummary"
};

var g_fields = [
    {
        label: "日期",
        name: "searchdate",
        searchidx: 0,
        type: "datetimebetween"
    },{
        label: "仓库",
        name: "Vouch.WhId",
        istable: true,
        istablehide: true,
        searchidx: 1,
        type:"select"
    },{
        label: "仓库",
        name: "Warehouse.Name",
        istable: true,
        searchable:false
    }, {
        label: "存货",
        name: "Inventory.Name",
        istable: true,
        searchidx:3,
        searchcond: "%"
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
        label: "期初库存",
        name: "Vouch.InitNum",
        istable: true,
        searchable: false
    }, {
        label: "收入数量",
        name: "Vouch.InNum",
        istable: true,
        searchable: false
    }, {
        label: "发出数量",
        name: "Vouch.OutNum",
        istable: true,
        searchable: false
    }, {
        label: "结存数量",
        name: "Vouch.Num",
        istable: true,
        searchable: false
    }, {
        label: "批号",
        name: "Vouch.Batch",
        istable: true,
        searchidx:10
    }, {
        label: "生产日期",
        name: "Vouch.MadeDate",
        format: 'YYYY-MM-DD',
        istable: true,
        searchable: false
    }, {
        label: "过期日期",
        name: "Vouch.InvalidDate",
        format: 'YYYY-MM-DD',
        istable: true,
        searchable: false
    }
];
