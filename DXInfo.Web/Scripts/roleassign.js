var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'roleassigntable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=AccountRoleAssign",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=AccountRoleAssign",
        tablebuttons: [
            { extend: "edit", editor: 0 },
            {
                extend: "customButton",
                text: "查找",
                action: function (e, dt, node, config) {
                    $('#searchModal').modal('show');
                }
            }
        ],
        searchcols: [
            { search: "<>'admin'" }
        ]
    }
];

var g_fields = [
    {
        label: "用户名",
        name: "Users.UserName",
        istable: true,
        searchidx: 0,
        search:"<>'admin'"
    }, {
        label: "姓名",
        name: "Users.FullName",
        istable: true,
        searchidx: 1
    }, {
        label: "门店",
        name: "Depts.Id",
        istable: true,
        istablehide:true,
        searchidx: 2,
        type: "select"
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true
    }, {
        label: "角色",
        name: "Roles",
        istable: true,
        render: "[,].Name",
        searchable: false,
        orderable:false
    }, {
        label: "角色",
        name: "Roles[].Id",
        iseditor: true,
        type: "select2",
        multiple:true
    }
];