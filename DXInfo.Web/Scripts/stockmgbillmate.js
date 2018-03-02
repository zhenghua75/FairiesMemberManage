var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'stockmgbillmatetable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=StockManageBillOfMaterials",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=StockManageBillOfMaterials",
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
        label: "主件存货编码",
        name: "BOM.PartInvId",
        istable: true,
        iseditor: true,
        searchidx: 0,
        type:"select2"
    }, {
        label: "主件存货名称",
        name: "Part.Name",
        istable: true,
        searchidx: 1
    }, {
        label: "子件存货编码",
        name: "BOM.ComponentInvId",
        istable: true,
        iseditor: true,
        type: "select2"
    }, {
        label: "子件存货名称",
        name: "Component.Name",
        istable: true
    }, {
        label: "主件基础用量",
        name: "BOM.BaseQtyN",
        istable: true,
        iseditor: true
    }, {
        label: "子件用量",
        name: "BOM.BaseQtyD",
        istable: true,
        iseditor: true
    }
];