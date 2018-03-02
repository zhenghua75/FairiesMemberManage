var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportlowstockpanel',
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
    reporttype:"lowstock"
};

var g_fields = [
    {
        label: "查询类别",
        name: "querytype",
        searchidx: 0,
        type: "select",
        options: [
            { label: "短缺存货", value: '1' }
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
        label: "最低库存量",
        name: "InvStock.LowStock",
        istable: true,
        searchable: true
    }, {
        label: "可用量",
        name: "CurrentStock.Num",
        istable: true,
        searchable: true
    }, {
        label: "短缺量",
        name: "InvStock.LowStock",
        istable: true,
        searchable: false,
        render: function (val, type, row) {
            return Math.round((val-row.CurrentStock.Num)*10000)/10000;
        }
    }
];
