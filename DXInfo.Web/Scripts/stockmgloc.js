var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'stockmgloctable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=StockManageLocator",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=StockManageLocator",
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
        name: "Locator.Code",
        istable: true,
        iseditor: true,
        searchidx: 0
    }, {
        label: "名称",
        name: "Locator.Name",
        istable: true,
        iseditor: true,
        searchidx: 1
    }, {
        label: "仓库",
        name: "Warehouse.Name",
        istable: true
    }, {
        label: "仓库",
        name: "Locator.WhId",
        istable: true,
        iseditor: true,
        type: "select2",
        searchidx: 2,
        istablehide:true
    }, {
        label: "描述",
        name: "Locator.Comment",
        istable: true,
        iseditor: true
    }
];