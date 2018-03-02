var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'invcatetable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=BaseInfoInventoryCategory",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=BaseInfoInventoryCategory",
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
        ],
        editorevent: [
            {
                event:'open',
                fn: function (e, display, action) {
                    if (action == 'edit') {
                        var codetmp = this.field('InvCategory.Code').input();
                        $(codetmp).attr('readonly', true);
                        $(codetmp).addClass('disabled');
                    } else if (action == 'create') {
                        var codetmp = this.field('InvCategory.Code').input();
                        $(codetmp).attr('readonly', false);
                        $(codetmp).removeClass('disabled');
                    }
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "编码",
        name: "InvCategory.Code",
        istable: true,
        iseditor: true,
        searchidx: 0
    }, {
        label: "名称",
        name: "InvCategory.Name",
        istable: true,
        iseditor: true,
        searchidx: 1
    }, {
        label: "类别",
        name: "InvCategory.CategoryType",
        istable: true,
        iseditor: true,
        type: "select",
        searchidx: 2,
        istablehide:true
    }, {
        label: "类别",
        name: "NameCode.Name",
        istable: true
    }, {
        label: "描述",
        name: "InvCategory.Comment",
        istable: true,
        iseditor: true
    }
];