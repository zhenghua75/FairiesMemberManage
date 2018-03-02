var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'unitofmeastable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=BaseInfoUnitOfMeasure",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=BaseInfoUnitOfMeasure",
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
        name: "UOM.Code",
        istable: true,
        iseditor: true,
        searchidx: 0
    }, {
        label: "名称",
        name: "UOM.Name",
        istable: true,
        iseditor: true,
        searchidx: 1
    }, {
        label: "计量单位组",
        name: "UOMGroup.Name",
        istable: true
    }, {
        label: "计量单位组",
        name: "UOM.UOMGroup",
        istable: true,
        iseditor: true,
        type: "select",
        searchidx: 2,
        istablehide:true
    }, {
        label: "换算率",
        name: "UOM.Rate",
        istable: true,
        iseditor:true
    }, {
        label: "是否主计量单位",
        name: "UOM.IsMain",
        istable: true,
        iseditor: true,
        type: "checkbox",
        separator: "|",
        options: [
            { label: '', value: true }
        ],
        render: function (val, type, row) {
            return val == true ? '是' : '否';
        }
    }, {
        label: "描述",
        name: "UOM.Comment",
        istable: true,
        iseditor: true
    }
];