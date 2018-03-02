﻿var vouchfields = [
    {
        label: "单号",
        name: "Vouch.Code",
        isdisabled: true
    }, {
        label: "日期",
        name: "Vouch.VouchDate",
        type: "datetime",
        issubmit: true,
        format: 'YYYY-MM-DD'
    }, {
        label: "周期",
        name: "Vouch.Period",
        issubmit: true,
        type: "select"
    }, {
        label: "仓库",
        name: "Vouch.ToWhId",
        type: "select",
        issubmit: true,
        isdisabled: true
    }, {
        label: "审核日期",
        name: "Vouch.VerifyDate",
        isdisabled: true
    }, {
        label: "备注",
        name: "Vouch.Memo",
        issubmit: true
    }
];

var vouchsfields = [
    {
        label: "货位",
        name: "Vouchs.ToLocatorId",
        iseditor: true,
        type: "select",
        issubmit: true,
        optcond: { WhId: $('#gparamuserwhid').val() },
        errorinfo: '请选择货位'
    },
    {
        label: "vouchid",
        name: "Vouchs.VouchId",
        istable: true
    },
    {
        label: "存货",
        name: "Vouchs.InvId",
        iseditor: true,
        type: "select2",
        issubmit: true,
        placeholder: "请选择...",
        placeholderValue: null,
        errorinfo: '请选择存货'
    },
    {
        label: "存货",
        name: "Inventory.Name",
        istable: true
    }, {
        label: "规格型号",
        name: "Inventory.Specs",
        istable: true,
        iseditor: true,
        type: "readonly"

    }, {
        label: "计量单位",
        name: "UOM.Name",
        istable: true,
        iseditor: true,
        type: "readonly"
    }, {
        label: "数量",
        name: "Vouchs.Num",
        istable: true,
        iseditor: true,
        issubmit: true,
        errorinfo: '请输入数量'
    }, {
        label: "批号",
        name: "Vouchs.Batch",
        istable: true,
        iseditor: true,
        issubmit: true,
        errorinfo: '请输入批号'
    }, {
        label: "是否保质期",
        name: "isShLife",
        iseditor: true,
        type: "hidden"
    }, {
        label: "生产日期",
        name: "Vouchs.MadeDate",
        istable: true,
        iseditor: true,
        type: "datetime",
        issubmit: true,
        errorinfo: '请选择生产日期',
        format: 'YYYY-MM-DD',
        def: function () { return new Date(); }
    }, {
        label: "过期日期",
        name: "Vouchs.InvalidDate",
        istable: true,
        iseditor: true,
        type: "datetime",
        issubmit: true,
        format: 'YYYY-MM-DD',
        errorinfo: '请选择过期日期'
    }, {
        label: "货位",
        name: "ToLocator.Name",
        istable: true
    }, {
        label: "行备注",
        name: "Vouchs.Memo",
        istable: true,
        iseditor: true,
        issubmit: true
    }
];

var mveditor = null;
var table = null;
var vouchorgdata = null;
$(document).ready(function () {
    var curmvid = $('#curmvid').val();
    var curmvtype = $('#curmvtype').val();
    $.ajax({
        type: "POST",
        url: "/api/Editor/Data?model=Vouch&VouchType=" + curmvtype,
        data: {
            draw: 1,
            columns: [
                {
                    data: 'DT_RowId',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: '=' + curmvid, regex: false }
                }
            ],
            order: [
                { column: 0, dir: 'asc' }
            ],
            start: 0,
            length: 1,
            search: { value: '', regex: false }
        },
        dataType: 'json',
        success: function (json) {
            if (json.data == undefined || json.data.length == 0) {
                if (curmvid != '0') {
                    addUIAlter('nav.breadcrumb', '获取单据错误', 'error');
                    return false;
                }
            }
            vouchorgdata = json;
            mveditor = new $.fn.dataTable.Editor({
                ajax: "/api/Editor/Data?model=Vouch&VouchType=" + curmvtype,
                fields: vouchfields
            });
            bindMveditorForm(json);
            createMvsTable();
            if (curmvid == '0') {
                var group0 = $('<div class="dt-buttons btn-group group0 col-sm-1"></div>');
                var group0btn = $('<a class="btn btn-primary radius size-S" id="mvcreate"><span>创建月结单</span></a>');
                group0btn.on('click', function () {
                    var vouchid = $('#curmvid').val();
                    var vouchtype = '013';
                    if (vouchid == '0') {
                        var reqmvdata = {
                            action: "create",
                            data: {}
                        };
                        var datatmp = {};
                        datatmp.Vouch = {
                            VouchType: vouchtype
                        };
                        $.each(vouchfields, function (k, v) {
                            if (v.issubmit !== undefined && v.issubmit == true) {
                                var fieldsp = v.name.split('.');
                                if (datatmp[fieldsp[0]] === undefined) {
                                    datatmp[fieldsp[0]] = {}
                                }
                                datatmp[fieldsp[0]][fieldsp[1]] = $('#formmv').find('#DTE_Field_' + v.name.replace('.', '-')).val();
                            }
                        })
                        if (datatmp.Vouch.Period == undefined || datatmp.Vouch.Period == '' || datatmp.Vouch.Period == null) {
                            addUIAlter('nav.breadcrumb', '请选择月结周期', 'error');
                            return false;
                        }
                        if (datatmp.Vouch.VouchDate == undefined || datatmp.Vouch.VouchDate == '' || datatmp.Vouch.VouchDate == null) {
                            addUIAlter('nav.breadcrumb', '请选择日期', 'error');
                            return false;
                        }
                        reqmvdata.data[0] = datatmp;
                        var objtarget = this;
                        panelLoading(objtarget);
                        $.ajax({
                            url: "/api/Editor/Data?model=Vouch&VouchType=" + vouchtype,
                            dataType: 'json',
                            method: 'POST',
                            data: reqmvdata,
                            success: function (jsonmv) {
                                panelLoaded(objtarget);
                                if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                                    $.each(jsonmv.fieldErrors, function (key, val) {
                                        addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                    });
                                    return false;
                                } else if (jsonmv.error) {
                                    addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                                    return false;
                                }
                                vouchorgdata = jsonmv;
                                addUIAlter('nav.breadcrumb', '创建成功', 'success');
                                checkMvControlDis('0');
                                document.location = "/StockMg/MonthBalance?id=" + jsonmv.data[0].DT_RowId.replace('row_', '') + "&type=013";
                            },
                            error: function (jsonmv) {
                                panelLoaded(objtarget);
                                var errobj = eval("(" + jsonmv.responseText + ")");
                                var errinfo = '';
                                if (errobj.exceptionMessage) {
                                    errinfo = errobj.exceptionMessage;
                                } else {
                                    errinfo = jsonmv.responseText;
                                }
                                addUIAlter('nav.breadcrumb', errinfo, 'error');
                                return false;
                            }
                        });
                    }
                })
                group0.append(group0btn);
                $('div.group3').before(group0);
                if (!$('div.group3').hasClass('hide')) {
                    $('div.group3').addClass('hide')
                }
                table.button(0).disable();
            } else {
                $('#isverify').val(json.data[0].Vouch.IsVerify);
                $('.panel .panel-title span').html(json.data[0].Vouch.Code);
                if (json.data[0].Vouch.IsVerify == true) {
                    checkMvControlDis('2');
                    if (!$('#mvverify').hasClass('disabled')) {
                        $('#mvverify').addClass('disabled');
                    }
                    if ($('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').removeClass('disabled');
                    }
                } else {
                    checkMvControlDis('0');
                    if ($('#mvverify').hasClass('disabled')) {
                        $('#mvverify').removeClass('disabled');
                    }
                    if (!$('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').addClass('disabled');
                    }
                }
            }
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

    function bindMveditorForm(json) {
        for (var i = 0; i < vouchfields.length; i++) {
            var inputtmp = mveditor.field(vouchfields[i].name).input();
            switch (vouchfields[i].type) {
                case "select":
                    $(inputtmp).addClass('select');
                    $.each(json.options[vouchfields[i].name], function (optkey, optval) {
                        $(inputtmp).append('<option value="' + optval.value + '">' + optval.label + '</option>')
                    })
                    break;
                case "select2":
                    $(inputtmp).addClass('select');
                    $.each(json.options[vouchfields[i].name], function (optkey, optval) {
                        $(inputtmp).append('<option value="' + optval.value + '">' + optval.label + '</option>')
                    })
                    break;
                case "datetime":
                    $(inputtmp).addClass('input-text');
                    if (curmvid == '0') {
                        $(inputtmp).val(moment().format('YYYY-MM-DD'));
                    }
                    break;
                default:
                    $(inputtmp).addClass('input-text');
                    break;
            }
            if (json.data.length > 0) {
                var fieldsp = vouchfields[i].name.split('.');
                var fieldvalue = json.data.length == 0 ? '' : json.data[0][fieldsp[0]][fieldsp[1]];
                $(inputtmp).val(fieldvalue);
            } else {
                if (vouchfields[i].name == 'Vouch.ToWhId') {
                    $(inputtmp).val($('#gparamuserwhid').val());
                }
            }
            if (vouchfields[i].isdisabled !== undefined && vouchfields[i].isdisabled == true) {
                $(inputtmp).attr('disabled', true);
            }

            if (vouchfields.length % 3 == 1 && i == vouchfields.length - 1) {
                var controlrow = $('<div class="row cl mt-0"><div class="col-sm-12">' +
                    '<label class="form-label col-xs-4 col-sm-1">' + vouchfields[i].label + '</label>' +
                    '<div class="formControls col-xs-8 col-sm-11"></div></div></div>');
                controlrow.find('div.formControls').append(inputtmp);
                $('#formmv').append(controlrow);
            } else {
                if ($('#formmv').find('div.row').length == 0) {
                    var controlrow = $('<div class="row cl"></div>');
                    controlrow.append('<div class="col-sm-6 col-md-4 mb-10">' +
                        '<label class="form-label col-xs-4 col-sm-4">' + vouchfields[i].label + '</label>' +
                        '<div class="formControls col-xs-8 col-sm-8"></div></div>')
                    controlrow.find('div.formControls').append(inputtmp);
                    $('#formmv').append(controlrow);
                } else {
                    var controlrow = $('#formmv').find('div.row');
                    var contrl = $('<div class="col-sm-6 col-md-4 mb-10">' +
                        '<label class="form-label col-xs-4 col-sm-4">' + vouchfields[i].label + '</label>' +
                        '<div class="formControls col-xs-8 col-sm-8"></div></div>');
                    contrl.find('div.formControls').append(inputtmp);
                    controlrow.append(contrl);
                    $('#formmv').append(controlrow);
                }
            }
        }
    }

    function createMvsTable() {
        var eletable = $('#stockmgmonthbalance');
        var head = $('<thead><tr></tr></thead>');
        $.each(vouchsfields, function (key, val) {
            if (val.istable !== undefined && val.istable === true) {
                if (val.name == 'ToLocator.Name' && $('#gparamisloctor').val() == 'false') {
                    return true;
                }
                if (val.name == 'Vouchs.Batch' && $('#gparamisbatch').val() == 'false') {
                    return true;
                }
                if ((val.name == 'Vouchs.MadeDate' || val.name == 'Vouchs.InvalidDate') && $('#gparamisshlife').val() == 'false') {
                    return true;
                }
                head.children('tr').append('<th>' + val.label + '</th>');
            }
        })
        eletable.append(head);

        var efields = [];
        $.each(vouchsfields, function (key, val) {
            if (val.name == 'Vouchs.ToLocatorId' && $('#gparamisloctor').val() == 'false') {
                return true;
            }
            if (val.name == 'Vouchs.Batch' && $('#gparamisbatch').val() == 'false') {
                return true;
            }
            if ((val.name == 'Vouchs.MadeDate' || val.name == 'Vouchs.InvalidDate') && $('#gparamisshlife').val() == 'false') {
                return true;
            }
            if (val.iseditor !== undefined && val.iseditor === true) {
                var newfield = { label: val.label, name: val.name };
                if (val.type !== undefined) {
                    newfield.type = val.type;
                }
                if (val.separator !== undefined) {
                    newfield.separator = val.separator;
                }
                if (val.options !== undefined) {
                    newfield.options = val.options;
                }
                if (val.multiple !== undefined) {
                    newfield.multiple = vval.multiple;
                }
                if (val.placeholder !== undefined) {
                    newfield.placeholder = val.placeholder;
                    newfield.placeholderValue = null;
                }
                if (val.placeholderValue !== undefined) {
                    newfield.placeholderValue = val.placeholderValue;
                }
                if (val.placeholderDisabled !== undefined) {
                    newfield.placeholderDisabled = val.placeholderDisabled;
                }
                if (val.def !== undefined) {
                    newfield.def = val.def;
                }
                if (val.format !== undefined) {
                    newfield.format = val.format;
                }
                if (val.optcond != undefined) {
                    newfield.optcond = val.optcond;
                }
                if (val.errorinfo != undefined) {
                    newfield.errorinfo = val.errorinfo;
                }
                efields.push(newfield);
            }
        })

        tfields = [];
        $.each(vouchsfields, function (key, val) {
            if (val.name == 'ToLocator.Name' && $('#gparamisloctor').val() == 'false') {
                return true;
            }
            if (val.name == 'Vouchs.Batch' && $('#gparamisbatch').val() == 'false') {
                return true;
            }
            if ((val.name == 'Vouchs.MadeDate' || val.name == 'Vouchs.InvalidDate') && $('#gparamisshlife').val() == 'false') {
                return true;
            }
            if (val.istable !== undefined && val.istable === true) {
                var newfield = { data: val.name };
                if (val.render !== undefined) {
                    newfield.render = val.render;
                }
                if (val.searchable !== undefined) {
                    newfield.searchable = val.searchable;
                }
                if (val.orderable !== undefined) {
                    newfield.orderable = val.orderable;
                }
                if (val.className !== undefined) {
                    newfield.className = val.className;
                }
                if (val.defaultContent !== undefined) {
                    newfield.defaultContent = val.defaultContent;
                }
                tfields.push(newfield);
            }
        })

        table = $('#stockmgmonthbalance')
            .on('preXhr.dt', function (e, settings, json) {
                if (json.search.value != '') {
                    json.search.value = "like '%" + json.search.value + "%'";
                }
            })
            .DataTable({
                dom: "<'row'<'col-sm-4'><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
                processing: true,
                serverSide: true,
                autoWidth: false,
                ajax: {
                    url: "/api/Editor/Data?model=Vouchs",
                    type: "POST"
                },
                columns: tfields,
                select: 'single',
                searchCols: [
                    { search: "='" + curmvid + "'" }
                ],
                columnDefs: [{ targets: [0], visible: false }],
                language: {
                    "lengthMenu": "每页显示 _MENU_ 条记录",
                    "zeroRecords": "抱歉， 没有找到",
                    "info": "当前 : _START_ - _END_ / 共_TOTAL_条",
                    "infoEmpty": "没有数据",
                    "infoFiltered": "",
                    "loadingRecords": "加载中......",
                    "processing": "<span class='spinner'></span>",
                    "search": "快速查找:",
                    "zeroRecords": "没有检索到数据",
                    "paginate": {
                        "sFirst": "首页",
                        "sPrevious": "<<",
                        "sNext": ">>",
                        "sLast": "尾页"
                    },
                    "buttons": {
                        "copy": "复制",
                        "print": "打印"
                    }
                }
            });

        table.on('select', function (e, dt, type, indexes) {
            if ($('#isverify').val() == 'true') {
                table.buttons().disable();
            }
        })
    }

    function checkMvControlDis(mod) {
        switch (mod) {
            case '0':
                if (!$('div.group0').hasClass('hide')) {
                    $('div.group0').addClass('hide')
                }
                if ($('div.group3').hasClass('hide')) {
                    $('div.group3').removeClass('hide')
                }
                for (var i = 0; i < vouchfields.length; i++) {
                    if (vouchfields[i].isdisabled === undefined || vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#formmv').find('#DTE_Field_' + vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', true);
                    }
                }
                if ($('#isverify').val() == 'true') {
                    if (!$('#mvverify').hasClass('disabled')) {
                        $('#mvverify').addClass('disabled')
                    }
                    if ($('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').removeClass('disabled')
                    }
                } else {
                    if ($('#mvverify').hasClass('disabled')) {
                        $('#mvverify').removeClass('disabled')
                    }
                    if (!$('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').addClass('disabled')
                    }
                }
                break;
            case '1':
                if (!$('div.group1').hasClass('hide')) {
                    $('div.group1').addClass('hide')
                }
                if ($('div.group2').hasClass('hide')) {
                    $('div.group2').removeClass('hide')
                }
                for (var i = 0; i < vouchfields.length; i++) {
                    if (vouchfields[i].isdisabled === undefined || vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#formmv').find('#DTE_Field_' + vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', false);
                    }
                }
                break;
            case '2':
                if (!$('div.group0').hasClass('hide')) {
                    $('div.group0').addClass('hide')
                }
                if ($('div.group3').hasClass('hide')) {
                    $('div.group3').removeClass('hide')
                }
                for (var i = 0; i < vouchfields.length; i++) {
                    if (vouchfields[i].isdisabled === undefined || vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#formmv').find('#DTE_Field_' + vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', true);
                    }
                }
                table.button(0).disable();
                break;
            case '3':
                if (!$('div.group0').hasClass('hide')) {
                    $('div.group0').addClass('hide')
                }
                for (var i = 0; i < vouchfields.length; i++) {
                    if (vouchfields[i].isdisabled === undefined || vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#formmv').find('#DTE_Field_' + vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', true);
                    }
                }
                table.buttons(0).enable();
                break;
            default:
                break;
        }
    }

    $('#mvverify').on('click', function () {
        var vouchid = $('#curmvid').val();
        var vouchtype = $('#curmvtype').val();
        reqdata = {
            action: 'verify',
            data: {}
        }
        reqdata.data['row_' + vouchid] = { Vouch: { IsVerify: true, VouchType: vouchtype } };
        var objtarget = this;
        panelLoading(objtarget);
        $.ajax({
            url: "/api/Editor/Data?model=Vouch&VouchType=" + vouchtype,
            dataType: 'json',
            method: 'POST',
            data: reqdata,
            success: function (jsonmv) {
                panelLoaded(objtarget);
                if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                    $.each(jsonmv.fieldErrors, function (key, val) {
                        addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                    });
                    return false;
                } else if (jsonmv.error) {
                    addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                    return false;
                }
                $('#isverify').val(jsonmv.data[0].Vouch.IsVerify);
                if (jsonmv.data[0].Vouch.IsVerify == true) {
                    if (!$('#mvverify').hasClass('disabled')) {
                        $('#mvverify').addClass('disabled')
                    }
                    if ($('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').removeClass('disabled')
                    }
                    checkMvControlDis('2');
                } else {
                    if ($('#mvverify').hasClass('disabled')) {
                        $('#mvverify').removeClass('disabled')
                    }
                    if (!$('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').addClass('disabled')
                    }
                    checkMvControlDis('3');
                }
                addUIAlter('nav.breadcrumb', '审核成功', 'success');
            },
            error: function (jsonmv) {
                panelLoaded(objtarget);
                var errobj = eval("(" + jsonmv.responseText + ")");
                var errinfo = '';
                if (errobj.exceptionMessage) {
                    errinfo = errobj.exceptionMessage;
                } else {
                    errinfo = jsonmv.responseText;
                }
                addUIAlter('nav.breadcrumb', errinfo, 'error');
                return false;
            }
        });
    })

    $('#mvunverify').on('click', function () {
        var vouchid = $('#curmvid').val();
        var vouchtype = $('#curmvtype').val();
        reqdata = {
            action: 'unverify',
            data: {}
        }
        reqdata.data['row_' + vouchid] = { Vouch: { IsVerify: false, VouchType: vouchtype } };
        var objtarget = this;
        panelLoading(objtarget);
        $.ajax({
            url: "/api/Editor/Data?model=Vouch&VouchType=" + vouchtype,
            dataType: 'json',
            method: 'POST',
            data: reqdata,
            success: function (jsonmv) {
                panelLoaded(objtarget);
                if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                    $.each(jsonmv.fieldErrors, function (key, val) {
                        addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                    });
                    return false;
                } else if (jsonmv.error) {
                    addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                    return false;
                }
                $('#isverify').val(jsonmv.data[0].Vouch.IsVerify);
                if (jsonmv.data[0].Vouch.IsVerify == true) {
                    if (!$('#mvverify').hasClass('disabled')) {
                        $('#mvverify').addClass('disabled')
                    }
                    if ($('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').removeClass('disabled')
                    }
                    checkMvControlDis('2');
                } else {
                    if ($('#mvverify').hasClass('disabled')) {
                        $('#mvverify').removeClass('disabled')
                    }
                    if (!$('#mvunverify').hasClass('disabled')) {
                        $('#mvunverify').addClass('disabled')
                    }
                    checkMvControlDis('3');
                }
                addUIAlter('nav.breadcrumb', '弃审成功', 'success');
            },
            error: function (jsonmv) {
                panelLoaded(objtarget);
                var errobj = eval("(" + jsonmv.responseText + ")");
                var errinfo = '';
                if (errobj.exceptionMessage) {
                    errinfo = errobj.exceptionMessage;
                } else {
                    errinfo = jsonmv.responseText;
                }
                addUIAlter('nav.breadcrumb', errinfo, 'error');
                return false;
            }
        });
    })
});