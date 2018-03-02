var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportrdsummarypanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=StockManageRdSummary",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"rdsummary"
};

var g_fields = [
    {
        label: "日期",
        name: "searchdate",
        searchidx: 0,
        type: "datetimebetween"
    },{
        label: "门店",
        name: "Depts.Name",
        istable: true,
        searchable:false
    },{
        label: "仓库",
        name: "Vouch.WhId",
        istable: true,
        istablehide: true,
        searchidx: 2,
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
        searchidx:4,
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
        label: "结存",
        name: "Vouch.Num",
        istable: true,
        searchable: false
    }
];
