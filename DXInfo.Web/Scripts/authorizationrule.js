var orgdata;

function createPanel(data, index) {
    var accordionname = 'accordionweb';
    if (data.Funcs.FuncType == '1') {
        accordionname = 'accordionclient';
    }
    var rowid = data.DT_RowId;
    var funcid = data.Funcs.Id;
    var panel = '<div class="panel panel-default radius">';
    panel += '<div class="panel-header checkbox">';
    panel += '<input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="leveltop f-l">';
    panel += '<h5 class="panel-title">';
    panel += '<a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#' + accordionname + '" href="#' + rowid + '">';
    panel += '<i class="iconfont icon-liebiaoyemian f-l mr-10 ml-10"></i><i class="iconfont icon-tianjia f-r f-12"></i>' + data.Funcs.Title + '</a>';
    panel += '</h5>';
    panel += '</div>';
    panel += '<div id="' + rowid + '" class="panel-collapse collapse">';
    panel += '<div class="panel-body">';
    panel += '</div>';
    panel += '</div>';
    panel += '</div>';
    $(panel).appendTo('#' + accordionname);
    $(function () {
        $('#' + rowid).collapse({
            toggle: false
        })
    });
}

function createPanelBody(data, ishassub, islast) {
    var accordionname = 'accordionweb';
    if (data.Funcs.FuncType == '1') {
        accordionname = 'accordionclient';
    }
    var rowid = data.DT_RowId;
    var funcid = data.Funcs.Id;
    var pid = data.Funcs.ParentId;
    var sublist = "";
    if (ishassub) {
        sublist = '<div class="row child" id="' + rowid + '"><label class="checkbox"><input class="haschild" type="checkbox" value="' + funcid + '" id="func-' + funcid + '">' + data.Funcs.Title + '</label>';
        sublist += '<div class="row childlist" id="child-' + data.Funcs.Id + '"></div></div>';
        if ($('#' + accordionname).find('#child-' + pid).length == 0) {
            $('#row_' + pid + ' .panel-body').append(sublist);
        } else {
            $('#child-' + pid).append(sublist);
        }
    } else {
        if ($('#' + accordionname).find('#child-' + pid).length == 0) {
            sublist = '<div class="row"><label class="checkbox"><input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="nochild"/>' + data.Funcs.Title + '</label></div>';
            $('#row_' + pid + ' .panel-body').append(sublist);
        } else if (!islast) {
            sublist = '<div class="row"><label class="checkbox"><input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="nochild"/>' + data.Funcs.Title + '</label></div>';
            $('#child-' + pid).append(sublist);
        } else {
            sublist = '<div class="col-sm-3"><label class="checkbox"><input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="lastchild"/>' + data.Funcs.Title + '</label></div>';
            $('#child-' + pid).append(sublist);
        }
    }
}

function createdropdown(data, index) {
    var id = data.DT_RowId;
    id = id.replace('row_', '');
    var menu = '<li><a href="javascript:;" class="dropdownrole" id="role-' + id + '">' + data.Name + '</a></li>';
    $('#dropdown-roles').append(menu);
}

function isHasSubMenu(data,curid) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].Funcs.ParentId == curid) {
            return true;
        }
    }
    return false;
}

function isLastLevel(data, curpid) {
    var list = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].Funcs.ParentId == curpid) {
            list.push(data[i].Funcs.Id);
        }
    }
    for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Funcs.ParentId == list[j]) {
                return false;
            }
        }
    }
    return true;
}

function topcheckbox(panel) {
    var flag = false;
    panel.find('.panel-body input[type=checkbox]').each(function () {
        if ($(this).is(':checked')) {
            flag = true;
            return false;
        }
    });
    if (flag) {
        panel.children('.panel-header').children('input.leveltop').prop('checked', true);
    } else {
        panel.children('.panel-header').children('input.leveltop').prop('checked', false);
    }
}

function childcheckbox(child) {
    var flag = false;
    child.find('.childlist input[type=checkbox]').each(function () {
        if ($(this).is(':checked')) {
            flag = true;
            return false;
        }
    });
    if (flag) {
        child.children('label').children('input.haschild').prop('checked', true);
    } else {
        child.children('label').children('input.haschild').prop('checked', false);
    }
}

function initFuncList(roleid) {
    $('#accordionweb').empty();
    $('#accordionclient').empty();
    $('#accordionweb').append('<p class="bg-black mb-0 radius c-white pl-20">网站权限</p>');
    $('#accordionclient').append('<p class="bg-black mb-0 radius c-white pl-20">客户端权限</p>');
    $.ajax({
        url: '/api/Editor/Data?model=AccountFuncs',
        dataType: 'json',
        type: 'POST',
        data: {
            draw: 1,
            columns: [
                {
                    data: 'Funcs.FuncType',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: '', regex: false }
                },
                {
                    data: 'Funcs.Sort',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: '', regex: false }
                }
            ],
            order: [
                { column: 0, dir: 'asc' },
                { column: 1, dir: 'asc' }
            ],
            start: 0,
            length: -1,
            search: { value: '', regex: false }
        },
        success: function (jsonfunc) {
            if (jsonfunc.data == undefined) {
                document.location = "/Home/Error?err=401";
                return false;
            } else {
                for (var i = 0, ien = jsonfunc.data.length ; i < ien ; i++) {
                    if (jsonfunc.data[i].Funcs.ParentId == null) {
                        createPanel(jsonfunc.data[i], i);
                    }
                }
                $('input.leveltop').on('change', function () {
                    var panel = $(this).closest('.panel');
                    if ($(this).is(':checked')) {
                        panel.find('.panel-body input[type=checkbox]').each(function () {
                            $(this).prop('checked', true);
                        });
                    } else {
                        panel.find('.panel-body input[type=checkbox]').each(function () {
                            $(this).prop('checked', false);
                        });
                    }
                    if ($('a.button-save').hasClass('disabled')) {
                        $('a.button-save').removeClass('disabled');
                    }
                })

                for (var i = 0, ien = jsonfunc.data.length ; i < ien ; i++) {
                    if (jsonfunc.data[i].Funcs.ParentId != null) {
                        var bhassub = isHasSubMenu(jsonfunc.data, jsonfunc.data[i].Funcs.Id);
                        var blast = isLastLevel(jsonfunc.data, jsonfunc.data[i].Funcs.ParentId);
                        createPanelBody(jsonfunc.data[i], bhassub, blast);
                    }
                }
                $('input.haschild').on('change', function () {
                    var divparent = $(this).closest('.child');
                    var childlist = divparent.children('.childlist');
                    var parenttop = $(this).closest('.panel');
                    if ($(this).is(':checked')) {
                        childlist.find('input[type=checkbox]').each(function () {
                            $(this).prop('checked', true);
                        });
                        divparent.parents('.child').each(function () {
                            $(this).children('label').children('input.haschild').prop('checked', true);
                        });
                        parenttop.find('input.leveltop').prop('checked', true);
                    } else {
                        childlist.find('input[type=checkbox]').each(function () {
                            $(this).prop('checked', false);
                        });
                        topcheckbox(parenttop);
                    }
                    if ($('a.button-save').hasClass('disabled')) {
                        $('a.button-save').removeClass('disabled');
                    }
                })
                $('input.lastchild').on('change', function () {
                    var divparent = $(this).closest('.child');
                    var parenttop = $(this).closest('.panel');
                    if ($(this).is(':checked')) {
                        divparent.children('label').children('input.haschild').prop('checked', true);
                        divparent.parents('.child').each(function () {
                            $(this).children('label').children('input.haschild').prop('checked', true);
                        });
                        parenttop.find('input.leveltop').prop('checked', true);
                    } else {
                        childcheckbox(divparent);
                        topcheckbox(parenttop);
                    }
                    if ($('a.button-save').hasClass('disabled')) {
                        $('a.button-save').removeClass('disabled');
                    }
                })
                $('input.nochild').on('change', function () {
                    var divparent = $(this).closest('.child');
                    var parenttop = $(this).closest('.panel');
                    if ($(this).is(':checked')) {
                        divparent.children('label').children('input.haschild').prop('checked', true);
                        divparent.parents('.child').each(function () {
                            $(this).children('label').children('input.haschild').prop('checked', true);
                        });
                        parenttop.find('input.leveltop').prop('checked', true);
                    } else {
                        childcheckbox(divparent);
                        topcheckbox(parenttop);
                    }
                    if ($('a.button-save').hasClass('disabled')) {
                        $('a.button-save').removeClass('disabled');
                    }
                })
                initRoleFunc(roleid);
                if (!$('a.button-save').hasClass('disabled')) {
                    $('a.button-save').addClass('disabled');
                }
            }
        }
    });
}

function initRoleFunc(roleid) {
    $.ajax({
        url: '/api/Editor/Data?model=RoleFuncs',
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
                    search: { value: '=' + roleid, regex: false }
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
                orgdata = json.data[0];
                if (json.data.length == 0) {
                    alert('当前角色已经被删除，将为您重新加载页面');
                    document.location = "/System/AuthorizationRule";
                } else {
                    $.each(json.data[0].Funcs, function (key, val) {
                        $('#func-' + val.Id).prop('checked', true);
                    });
                }
            }
        }
    });
}

$(document).ready(function () {
    $.ajax({
        url: '/api/Editor/Data?model=AccountRoles',
        dataType: 'json',
        type: 'POST',
        data: {
            draw: 1,
            columns: [
                {
                    data: 'Name',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: '', regex: false }
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
                for (var i = 0, ien = json.data.length ; i < ien ; i++) {
                    createdropdown(json.data[i], i);
                }
                $('span.rolecurrent').html('当前角色：' + json.data[0].Name);

                var roleid = json.data[0].DT_RowId;
                roleid = roleid.replace('row_', '');
                initFuncList(roleid);

                $('#rolestable .panel-header .dropDown ul a.dropdownrole').on('click', function (e) {
                    panelLoading(this);
                    var roleid = e.target.id;
                    roleid = roleid.replace('role-', '');
                    var name = $(e.target).html();
                    $('span.rolecurrent').html('当前角色：' + name);
                    initFuncList(roleid);
                    panelLoaded(this);
                });
            }
        }
    });

    $('a.button-save').on('click', function () {
        var newfunc = [];
        if (orgdata) {
            var objtarget = this;
            panelLoading(objtarget);
            $('#accordionweb input[type=checkbox]').each(function () {
                var funcid = parseInt($(this).val().replace('func-', ''));
                if ($(this).is(':checked')) {
                    newfunc.push({ Id: funcid });
                }
            });
            $('#accordionclient input[type=checkbox]').each(function () {
                var funcid = parseInt($(this).val().replace('func-', ''));
                if ($(this).is(':checked')) {
                    newfunc.push({ Id: funcid });
                }
            });
            reqnewdata = {
                action: 'edit',
                data: {}
            }
            reqnewdata.data[orgdata.DT_RowId] = { Funcs: newfunc };
            if (newfunc.length == 0) {
                reqnewdata.data[orgdata.DT_RowId] = { Funcs: [{ Id: 44 }] };
            } else {
                reqnewdata.data[orgdata.DT_RowId] = { Funcs: newfunc };
            }
            
            $.ajax({
                url: '/api/Editor/Data?model=RoleFuncs',
                dataType: 'json',
                type: 'POST',
                data: reqnewdata,
                success: function (json) {
                    var roleid = orgdata.Id;
                    initFuncList(roleid);
                    addUIAlter('nav.breadcrumb', '修改成功', 'success');
                    panelLoaded(objtarget);
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
                    panelLoaded(objtarget);
                }
            })
        }
    });
});