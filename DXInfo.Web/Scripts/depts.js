var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'deptstable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=BaseInfoDept",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=BaseInfoDept",
        tablebuttons: [
            { extend: "create", editor: 0 },
            { extend: "edit", editor: 0 },
            { extend: "remove", editor: 0 }
        ],
        rowcallback: function (row, data, index) {
            $('input.editor-IsDeptPrice', row).prop('checked', data.Depts.IsDeptPrice == true);
        },
        tableevent: [
            {
                event: "change",
                selector: "input.editor-IsDeptPrice",
                fn: function (e) {
                    e.data.editor
                        .edit($(this).closest('tr'), false)
                        .set('Depts.IsDeptPrice', $(this).prop('checked') ? true : false)
                        .submit();
                }
            }
        ],
        editorevent: [
            {
                event: "preSubmit",
                fn: function (e, o, action) {
                    if (action !== 'remove') {
                        var isprice = this.field('Depts.IsDeptPrice');
                        if (isprice.val() == null || isprice.val() == "") {
                            $.each(o.data, function (key, val) {
                                o.data[key].Depts.IsDeptPrice = false;
                            })
                        }
                    }
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "编码",
        name: "Depts.Code",
        istable: true,
        iseditor:true
    }, {
        label: "名称",
        name: "Depts.Name",
        istable: true,
        iseditor:true
    }, {
        label: "门店主管",
        name: "Users.FullName",
        istable: true
    }, {
        label: "门店主管",
        name: "Depts.Manager",
        iseditor: true,
        type: "select2",
        placeholder: "请选择...",
        placeholderValue: null,
        placeholderDisabled: false
    }, {
        label: "地址",
        name: "Depts.Address",
        istable: true,
        iseditor:true
    }, {
        label: "描述",
        name: "Depts.Comment",
        istable: true,
        iseditor:true
    }, {
        label: "是否门店单价",
        name: "Depts.IsDeptPrice",
        istable: true,
        iseditor:true,
        type: "checkbox",
        separator: "|",
        options: [
            { label: '', value: true }
        ],
        render: function (val, type, row) {
            if (type === 'display') {
                return '<input type="checkbox" class="editor-IsDeptPrice">';
            }
            return val;
        }
    }, {
        label: "门店类型",
        name: "NameCode.Name",
        istable: true
    }, {
        label: "门店类型",
        name: "Depts.DeptType",
        iseditor: true,
        type: "select"
    }, {
        label: "上级部门",
        name: "ParentDepts.Name",
        istable: true
    }, {
        label: "上级部门",
        name: "Depts.ParentId",
        iseditor: true,
        type: "select",
        placeholder: "请选择...",
        placeholderValue: null,
        placeholderDisabled:false
    }
];