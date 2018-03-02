var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'sysparasettable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-12'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=BaseInfoSysParaSet",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=BaseInfoSysParaSet",
        tablebuttons: [
            { extend: "edit", editor: 0 }
        ],
        searchcols: [
            null,
            null,
            { search: "in('IG','MD','CP','FP1','FP2','FP3','FP4','FP5','FP6','FP7')" }
        ],
        order: [[2, 'asc'], [0, 'acs']]
    }
];

var g_fields = [
    {
        label: "参数值",
        name: "Code",
        istable: true,
        iseditor: true
    }, {
        label: "参数名称",
        name: "Name",
        istable: true
    }, {
        label: "参数类型",
        name: "Type",
        istable: true
    }, {
        label: "描述",
        name: "Comment",
        istable: true
    }
];