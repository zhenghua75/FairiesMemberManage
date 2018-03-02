var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportshlifewarnpanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=StockManageCurrentStock",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"shlifewarn"
};

var g_fields = [
    {
        label: "查询类别",
        name: "querytype",
        searchidx: 0,
        type: "select",
        options: [
            { label: "过期存货", value: '1' },
            { label: "未过期存货", value: '2' },
            { label: "临近存货", value: '3' }
        ]
    }, {
        label: "仓库",
        name: "CurrentStock.WhId",
        istable: true,
        istablehide: true,
        searchidx: 0,
        type:"select"
    }, {
        label: "仓库",
        name: "Warehouse.Name",
        istable: true
    }, {
        label: "存货",
        name: "Inventory.Name",
        istable: true
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
        name: "CurrentStock.Batch",
        istable: true,
        searchidx:5
    }, {
        label: "生产日期",
        name: "CurrentStock.MadeDate",
        istable: true,
        searchable: false
    }, {
        label: "保质期",
        name: "InvStock.ShelfLife",
        istable: true,
        searchable: false
    }, {
        label: "保质期单位",
        name: "NameCodeShelfLifeType.Name",
        istable: true,
        searchable: false
    }, {
        label: "过期日期",
        name: "CurrentStock.InvalidDate",
        istable: true,
        searchidx: 9,
        type:"datetimebetween"
    }, {
        label: "过期天数",
        name: "querydaynum",
        searchidx: 0
    }, {
        label: "临近天数",
        name: "querynear",
        searchidx: 0,
        type: "textbetween"
    }
];
