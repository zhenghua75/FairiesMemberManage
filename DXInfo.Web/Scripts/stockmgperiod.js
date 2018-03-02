var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'stockmgperiodtable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=StockManagePeriod",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=StockManagePeriod",
        tablebuttons: [
            { extend: "create", editor: 0 },
            { extend: "edit", editor: 0 },
            { extend: "remove", editor: 0 }
        ]
    }
];

var g_fields = [
    {
        label: "编码",
        name: "Code",
        istable: true,
        iseditor: true
    }, {
        label: "开始日期",
        name: "BeginDate",
        istable: true,
        iseditor: true,
        type:"datetime"
    }, {
        label: "结束日期",
        name: "EndDate",
        istable: true,
        iseditor: true,
        type: "datetime"
    }, {
        label: "描述",
        name: "Memo",
        istable: true,
        iseditor: true
    }
];