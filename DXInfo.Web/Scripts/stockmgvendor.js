var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'stockmgvendortable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=StockManageVendor",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=StockManageVendor",
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
        name: "Code",
        istable: true,
        iseditor: true,
        searchidx: 0
    }, {
        label: "名称",
        name: "Name",
        istable: true,
        iseditor: true,
        searchidx: 1
    }, {
        label: "电话",
        name: "Tel",
        istable: true,
        iseditor: true
    }, {
        label: "传真",
        name: "Fax",
        istable: true,
        iseditor: true
    }, {
        label: "手机",
        name: "Phone",
        istable: true,
        iseditor: true
    }, {
        label: "邮编",
        name: "Zip",
        istable: true,
        iseditor: true
    }, {
        label: "联系人",
        name: "Linkman",
        istable: true,
        iseditor: true
    }, {
        label: "地址",
        name: "Address",
        istable: true,
        iseditor: true
    }, {
        label: "Email",
        name: "Email",
        istable: true,
        iseditor: true
    }
];