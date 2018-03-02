function createPanel(data) {
    var accordionname = 'accordionweb';
    if (data.FuncType == '1') {
        accordionname = 'accordionclient';
    }
    var rowid = 'accordion-' + data.Id;
    var funcid = data.Id;
    var panel = '<div class="panel panel-default radius">';
    panel += '<div class="panel-header checkbox">';
    panel += '<input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="leveltop f-l">';
    panel += '<h5 class="panel-title">';
    panel += '<a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#' + accordionname + '" href="#' + rowid + '">';
    panel += '<i class="iconfont icon-liebiaoyemian f-l mr-10 ml-10"></i><i class="iconfont icon-tianjia f-r f-12"></i>' + data.Title + '</a>';
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
    if (data.label.FuncType == '1') {
        accordionname = 'accordionclient';
    }
    var rowid = 'row_' + data.label.Id;
    var funcid = data.label.Id;
    var pid = data.label.ParentId;
    var sublist = "";
    if (ishassub) {
        sublist = '<div class="row child" id="' + rowid + '"><label class="checkbox"><input class="haschild" type="checkbox" value="' + funcid + '" id="func-' + funcid + '">' + data.label.Title + '</label>';
        sublist += '<div class="row childlist" id="child-' + funcid + '"></div></div>';
        if ($('#' + accordionname).find('#child-' + pid).length == 0) {
            $('#accordion-' + pid + ' .panel-body').append(sublist);
        } else {
            $('#child-' + pid).append(sublist);
        }
    } else {
        if ($('#' + accordionname).find('#child-' + pid).length == 0) {
            sublist = '<div class="row"><label class="checkbox"><input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="nochild"/>' + data.label.Title + '</label></div>';
            $('#accordion-' + pid + ' .panel-body').append(sublist);
        } else if (!islast) {
            sublist = '<div class="row"><label class="checkbox"><input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="nochild"/>' + data.label.Title + '</label></div>';
            $('#child-' + pid).append(sublist);
        } else {
            sublist = '<div class="col-sm-3"><label class="checkbox"><input type="checkbox" value="' + funcid + '" id="func-' + funcid + '" class="lastchild"/>' + data.label.Title + '</label></div>';
            $('#child-' + pid).append(sublist);
        }
    }
}

function createdropdown(data) {
    $.each(data, function (key, val) {
        var roleid = val.DT_RowId.replace('row_', '');
        var menu = '<li><a href="javascript:;" class="dropdownrole" id="role-' + roleid + '">' + val.Name + '</a></li>';
        $('#dropdown-roles').append(menu);
    })
}

function isHasSubMenu(data,curid) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].label.ParentId == curid) {
            return true;
        }
    }
    return false;
}

function isLastLevel(data, curpid) {
    var list = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].label.ParentId == curpid) {
            list.push(data[i].label.Id);
        }
    }
    for (var j = 0; j < list.length; j++) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].label.ParentId == list[j]) {
                break;
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
    var drawnum = $('#drawnum').val();
    if (drawnum == '') {
        drawnum = 1;
    } else {
        drawnum = parseInt(drawnum) + 1;
    }
    $.ajax({
        url: '/api/Editor/Data?model=AccountFuncs',
        dataType: 'json',
        type: 'POST',
        data: {
            draw: drawnum,
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
            } else if (json.data[0].Id != roleid) {
                addUIAlter('nav.breadcrumb', '错误异常，请刷新后重试', 'error');
                return false;
            }else {
                $('#drawnum').val(json.draw);
                for (var i = 0, ien = json.options['Funcs[].Id'].length ; i < ien ; i++) {
                    if (json.options['Funcs[].Id'][i].label.ParentId == null && json.options['Funcs[].Id'][i].label.IsAuthorize==true) {
                        createPanel(json.options['Funcs[].Id'][i].label);
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

                for (var i = 0, ien = json.options['Funcs[].Id'].length ; i < ien ; i++) {
                    if (json.options['Funcs[].Id'][i].label.ParentId != null && json.options['Funcs[].Id'][i].label.IsAuthorize==true) {
                        var bhassub = isHasSubMenu(json.options['Funcs[].Id'], json.options['Funcs[].Id'][i].value);
                        var blast = isLastLevel(json.options['Funcs[].Id'], json.options['Funcs[].Id'][i].label.ParentId);
                        createPanelBody(json.options['Funcs[].Id'][i], bhassub, blast);
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

                $.each(json.data[0].Funcs, function (key, val) {
                    $('#func-' + val.Id).prop('checked', true);
                });

                if (!$('a.button-save').hasClass('disabled')) {
                    $('a.button-save').addClass('disabled');
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
        success: function (jsonrole) {
            if (jsonrole.data == undefined) {
                document.location = "/Home/Error?err=401";
                return false;
            } else {
                createdropdown(jsonrole.data);
                $('span.rolecurrent').html('当前角色：' + jsonrole.data[0].Name);
                var roleid = jsonrole.data[0].DT_RowId.replace('row_', '');
                $('#curroleid').val(roleid);
                initFuncList(roleid);

                $('#rolestable .panel-header .dropDown ul a.dropdownrole').on('click', function (e) {
                    panelLoading(this);
                    var roleid = e.target.id;
                    roleid = roleid.replace('role-', '');
                    var name = $(e.target).html();
                    $('#curroleid').val(roleid);
                    $('span.rolecurrent').html('当前角色：' + name);
                    initFuncList(roleid);
                    panelLoaded(this);
                });
            }
        }
    });

    $('a.button-save').on('click', function () {
        var newfunc = [];
        var objtarget = this;
        var roleid = $('#curroleid').val();
        if(roleid==""||roleid=="0"){
            addUIAlter('nav.breadcrumb', '请选择需要修改权限的角色', 'error');
        }else{
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
            if (newfunc.length == 0) {
                reqnewdata.data['row_' + roleid] = {
                    Funcs: [
                        { Id: 44 }
                    ]
                };
            } else {
                reqnewdata.data['row_' + roleid] = {
                    Funcs: newfunc
                };
            }
            
            $.ajax({
                url: '/api/Editor/Data?model=AccountFuncs',
                dataType: 'json',
                type: 'POST',
                data: reqnewdata,
                success: function (json) {
                    var roleid = $('#curroleid').val();
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