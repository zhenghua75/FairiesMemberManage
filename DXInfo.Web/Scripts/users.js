var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'userstable',
        hassearchmodel:true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=AccountUsers",
            type: "POST"
        },
        editorajax:{
            create: function (method, url, data, successCallback, errorCallback) {
                var regdata = new Object();
                regdata.UserName = data.data[0].Users.UserName;
                regdata.Password = data.data[0].Users.Password;
                regdata.DeptId = data.data[0].Users.DeptId;
                regdata.WhId = data.data[0].Users.WhId;
                regdata.ConfirmPassword = data.data[0].Users.ConfirmPassword;
                regdata.FullName = data.data[0].Users.FullName;
                regdata.AuthorityType = data.data[0].Users.AuthorityType;
                regdata.LockoutEnabled = false;
                regdatajson = JSON.stringify(regdata);

                $.ajax({
                    type: "POST",
                    url: "/api/Account/Register",
                    data: regdatajson,
                    contentType: "application/json",
                    dataType: "json"
                })
                .done(function (json) {
                    successCallback(json);
                })
                .error(function (xhr, error, thrown) {
                    errorCallback(xhr, error, thrown);
                });
            },
            edit: "/api/Editor/Data?model=AccountUsers",
            remove: "/api/Editor/Data?model=AccountUsers"
        },
        rowcallback:function (row, data, index) {
            $('input.editor-LockoutEnabled', row).prop('checked', data.Users.LockoutEnabled == true);
        },
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
            },
            {
                extend: "selected",
                text: "重置密码",
                action: function (e, dt, node, config) {
                    rows = dt.rows({
                        selected: true
                    });
                    var userid = rows.data()[0].DT_RowId;
                    userid = userid.replace('row_', '');
                    $.ajax({
                        type: "POST",
                        url: "/api/Account/ResetPassword",
                        data: '"' + userid + '"',
                        contentType: "application/json",
                        success: function () {
                            addUIAlter('nav.breadcrumb', '重置密码成功', 'success');
                        },
                        error: function (e) {
                            var errobj = eval("(" + e.responseText + ")");
                            var errinfo = "";
                            if (errobj.exceptionMessage) {
                                errinfo = errinfo + errobj.exceptionMessage;
                            }
                            $.each(errobj.modelState, function (key, value) {
                                if (key == "other") {
                                    errinfo += "<p>详细信息：";
                                    $.each(value, function (i, val) {
                                        errinfo += val + '|';
                                    });
                                    errinfo = errinfo.substr(0, errinfo.length - 1);
                                    errinfo += "</p>";
                                } else {
                                    errinfo += '<p>' + key + '：' + value + '</p>';
                                }
                            });
                            addUIAlter('nav.breadcrumb', errinfo, 'error');
                        }
                    })
                }
            }
            //{
            //    extend: 'collection',
            //    text: '导出',
            //    buttons: [
            //        'copy',
            //        'excel',
            //        'print'
            //    ]
            //}
        ],
        tableevent: [
            {
                event: "change",
                selector: "input.editor-LockoutEnabled",
                fn: function (e) {
                    e.data.editor
                        .edit($(this).closest('tr'), false)
                        .set('Users.LockoutEnabled', $(this).prop('checked') ? true : false)
                        .submit();
                }
            }
        ],
        editorevent: [
            {
                event: "initCreate",
                fn: function (e) {
                    if (!this.field('Users.Password')) {
                        this.add({
                            label: "密码",
                            name: "Users.Password",
                            type: "password"
                        });
                        this.add({
                            label: "确认密码",
                            name: "Users.ConfirmPassword",
                            type: "password"
                        });
                    }
                    this.field("Users.LockoutEnabled").hide();
                }
            },
            {
                event: "initEdit",
                fn: function (e) {
                    if (this.field('Users.Password')) {
                        this.clear(['Users.Password', 'Users.ConfirmPassword']);
                    }
                    this.field("Users.LockoutEnabled").hide();
                }
            },
            {
                event: "preSubmit",
                fn: function (e, o, action) {
                    if (action !== 'remove') {
                        var islock = this.field('Users.LockoutEnabled');
                        if (islock.val() == null || islock.val() == "") {
                            $.each(o.data, function (key, val) {
                                o.data[key].Users.LockoutEnabled = false;
                            })
                        }
                    }
                }
            }
        ],
        searchcols: [
            { search: "<>'admin'" },
            null,
            null
        ],
        editorcontrolbind: [
            {
                fn: function (cureditor, curtable) {
                    var udeptnode = cureditor.field('Users.DeptId').input();
                    $(udeptnode).on('change', function () {
                        var udeptid = $(this).val();
                        if (udeptid != null && udeptid != '') {
                            var optwhid = [];
                            $.each(curtable.ajax.json().options['Users.WhId'], function (k, v) {
                                if (v.label.DeptId == udeptid) {
                                    optwhid.push({ label: v.label.Name, value: v.value });
                                }
                            })
                            cureditor.field('Users.WhId').update(optwhid);
                        }
                    })
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "用户名",
        name: "Users.UserName",
        iseditor: true,
        istable: true,
        searchidx: 0,
        search:"<>'admin'"
    }, {
        label: "姓名",
        name: "Users.FullName",
        iseditor: true,
        istable: true,
        searchidx: 1
    }, {
        label: "门店",
        name: "Users.DeptId",
        type: "select",
        iseditor: true,
        istable: true,
        istablehide: true,
        searchidx: 2
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true
    }, {
        label: "仓库",
        name: "Users.WhId",
        type: "select",
        iseditor: true,
        istable: true,
        istablehide: true
    }, {
        label: "仓库",
        name: "Warehouse.Name",
        istable: true
    }, {
        label: "权限",
        name: "Users.AuthorityType",
        type: "select",
        iseditor: true
    }, {
        label: "权限",
        name: "NameCode.Name",
        istable: true
    }, {
        label: "是否锁定",
        name: "Users.LockoutEnabled",
        type: "checkbox",
        iseditor: true,
        istable: true,
        separator: "|",
        options: [
            { label: '', value: 1 }
        ],
        render: function (val, type, row) {
            if (type === 'display') {
                return '<input type="checkbox" class="editor-LockoutEnabled">';
            }
            return val;
        }
    }
];