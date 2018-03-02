var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'stockmgwhtable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=StockManageWarehouse",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=StockManageWarehouse",
        tablebuttons: [
            { extend: "create", editor: 0 },
            { extend: "edit", editor: 0 },
            { extend: "remove", editor: 0 },
            {
                extend: "customButton",
                text: "查找",
                action: function (e, dt, node, config) {
                    $('#searchModal').modal('show');
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "编码",
        name: "Warehouse.Code",
        istable: true,
        iseditor: true,
        searchidx: 0
    }, {
        label: "名称",
        name: "Warehouse.Name",
        istable: true,
        iseditor: true,
        searchidx: 1
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true
    }, {
        label: "门店",
        name: "Warehouse.DeptId",
        istable: true,
        iseditor: true,
        type: "select",
        searchidx: 2,
        istablehide:true
    }, {
        label: "负责人",
        name: "Warehouse.Principal",
        istable: true,
        iseditor:true
    }, {
        label: "电话",
        name: "Warehouse.Tel",
        istable: true,
        iseditor: true
    }, {
        label: "地址",
        name: "Warehouse.Address",
        istable: true,
        iseditor: true
    }, {
        label: "描述",
        name: "Warehouse.Comment",
        istable: true,
        iseditor: true
    }
];