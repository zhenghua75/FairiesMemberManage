var editor;

function createPanel(data) {
    var id = '1';
    var lock = data.lockoutEnabled ? '是' : '否';
    $(
        '<div class="row">'+
        '<div class="col-sm-6 col-md-3" data-editor-id="' + id + '">' +
            '<div class="widget radius bg-green-lighter">' +
            '<dl>' +
                '<dt>用户名:</dt>' +
                '<dd class="c-white" data-editor-field="userName">' + data.userName + '</dd>' +
                '<dt>姓名:</dt>' +
                '<dd class="c-white" data-editor-field="fullName">' + data.fullName + '</dd>' +
                '<dt>权限:</dt>' +
                '<dd class="c-white" data-editor-field="authorityType">' + data.authorityType + '</dd>' +
                '<dt>部门:</dt>' +
                '<dd class="c-white" data-editor-field="deptName">' + data.deptName + '</dd>' +
                '<dt>仓库:</dt>' +
                '<dd class="c-white" data-editor-field="whName">' + data.whName + '</dd>' +
                '<dt>是否锁定:</dt>' +
                '<dd class="c-white" data-editor-field="lockoutEnabled">' + lock + '</dd>' +
            '</dl>' +
            '</div>' +
        '</div>'+
        '</div>'
    ).appendTo('#default-tab-1');
}

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    });

    //$('table.table').DataTable({
    //    ajax: '/api/Account/UserInfo',
    //    scrollY: 200,
    //    scrollCollapse: true,
    //    paging: false
    //});

    $.ajax({
        url: '/api/Account/UserInfo',
        dataType: 'json',
        success: function (json) {
            createPanel(json);
        }
    });

    $("form").on("submit", function (e) {
        e.preventDefault();
        var changPwdData = {
            OldPassword: $('#OldPassword').val(),
            NewPassword: $('#NewPassword').val(),
            ConfirmPassword: $('#ConfirmPassword').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/Account/ChangePassword',
            data: changPwdData,
            success: function () {
                $('#OldPassword').val('');
                $('#NewPassword').val('');
                $('#ConfirmPassword').val('');
                addUIAlter('nav.breadcrumb', '密码修改成功', 'success');
            },
            error: function (e) {
                errobj = eval("(" + e.responseText + ")");
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
        });
    });

    //$.each(controls, function (key, val) {
    //    var d = allfuncs;
    //    var liele = '<li class="row cl">' +
    //        '<div class="info-image"><img src="' + val.Img + '" /></div>' +
    //        '<div class="info-desc">' +
    //        '<h4 class="title">' + val.Desc.Title + '</h4>' +
    //        '<p class="desc">' + val.Desc.Desc + '</p>' +
    //        '</div>' +
    //        '<div class="info-action">' +
    //        '<input type="checkbox" data-render="switchery" data-theme="default" checked />' +
    //        '</div>' +
    //        '</li>';
    //    $('ul.info-list').append(liele);
    //});

    var uid = "=0";
    if ($('#uid').val() != '') {
        uid = "=" + $('#uid').val();
    }
    $.ajax({
        url: '/api/Editor/Data?model=HomeControls',
        dataType: 'json',
        type: 'POST',
        data: {
            draw: 1,
            columns: [
                {
                    data: 'Id',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: uid, regex: false }
                }
            ],
            order: [
                { column: 0, dir: 'asc' }
            ],
            start: 0,
            length: -1,
            search: { value: '', regex: false }
        },
        success: function (json) {
            if (json.data == undefined) {
                document.location = "/Home/Error?err=401";
                return false;
            } else {
                var list = [];
                if (json.data[0].Funcs != undefined) {
                    for (var i = 0, ien = json.data[0].Funcs.length ; i < ien ; i++) {
                        list.push('switch-' + json.data[0].Funcs[i].Id);
                    }
                }
                renderSwitcher(list);

                $('#controlsave').on('click', function () {
                    var selfuncs = [];
                    var curuid = $('#uid').val();
                    $('[data-render=switchery]').each(function () {
                        if ($(this).is(':checked')) {
                            var id = $(this).data('id').replace('switch-', '');
                            selfuncs.push({ Id: id });
                        }
                    })
                    var reqdata = {
                        action: 'edit',
                        data: {}
                    }
                    if (selfuncs.length == 0) {
                        reqdata.data['row_' + curuid] = {
                            Funcs: [
                                { Id: 44 }
                            ]
                        }
                    } else {
                        reqdata.data['row_' + curuid] = {
                            Funcs: selfuncs
                        }
                    }

                    $.ajax({
                        url: '/api/Editor/Data?model=HomeControls',
                        dataType: 'json',
                        type: 'POST',
                        data: reqdata,
                        success: function (jsonres) {
                            addUIAlter('nav.breadcrumb', '主控台配置保存成功', 'success');
                        },
                        error: function (e) {
                            errobj = eval("(" + e.responseText + ")");
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
                })
            }
        }
    });
});