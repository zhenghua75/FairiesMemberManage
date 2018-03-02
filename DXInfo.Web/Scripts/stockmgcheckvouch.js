var curstockdata = null;
var editcurbatch = null;
var vouchorgdata = null;
var checkmvseditorindex = 0;
var wizsteps = {
    tab1: {
        Id: 'tab1',
        Name: '盘点单',
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=010",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "010",
        bstype: null,
        paneltype: "vouchsedit",
        voucheditor: null,
        vouchseditor: null,
        vouchstable: null,
        ismain: true,
        vouchfields: [
            {
                label: "盘点单号",
                name: "Vouch.Code",
                isdisabled: true
            }, {
                label: "日期",
                name: "Vouch.VouchDate",
                type: "datetime",
                issubmit: true,
                format: 'YYYY-MM-DD',
                isdisabled: true
            }, {
                label: "仓库",
                name: "Vouch.ToWhId",
                type: "select",
                issubmit: true,
                isdisabled:true
            }, {
                label: "审核日期",
                name: "Vouch.VerifyDate",
                isdisabled: true
            }, {
                label: "备注",
                name: "Vouch.Memo",
                issubmit: true
            }
        ],
        vouchsfields: [
            {
                label: "货位",
                name: "Vouchs.ToLocatorId",
                iseditor: true,
                type: "select",
                issubmit: true,
                optcond: { WhId: $('#gparamuserwhid').val() },
                errorinfo: '请选择货位'
            }, {
                label: "主单Id",
                name: "Vouchs.VouchId",
                istable: true
            }, {
                label: "编码",
                name: "Inventory.Code",
                istable: true
            }, {
                label: "存货",
                name: "Vouchs.InvId",
                iseditor: true,
                type: "select2",
                issubmit: true,
                placeholder: "请选择...",
                placeholderValue: null,
                errorinfo: '请选择存货'
            }, {
                label: "存货",
                name: "Inventory.Name",
                istable: true
            }, {
                label: "规格型号",
                name: "Inventory.Specs",
                istable: true,
                iseditor: true,
                searchable: false,
                orderable:false,
                type: "readonly"
            }, {
                label: "计量单位",
                name: "UOM.Name",
                istable: true,
                iseditor: true,
                searchable: false,
                orderable: false,
                type: "readonly"
            }, {
                label: "批号",
                name: "Vouchs.Batch",
                istable: true,
                iseditor: true,
                type: "readonly"
            }, {
                label: "数量",
                name: "Vouchs.Num",
                istable: true,
                iseditor: true,
                issubmit: true,
                searchable: false,
                orderable: false,
                type:"readonly"
            }, {
                label: "盘点数",
                name: "Vouchs.CNum",
                istable: true,
                iseditor: true,
                issubmit: true,
                searchable: false,
                errorinfo: '请输入盘点数'
            }, {
                label: "生产日期",
                name: "Vouchs.MadeDate",
                istable: true,
                iseditor: true,
                searchable: false,
                orderable: false,
                type: "readonly"
            }, {
                label: "过期日期",
                name: "Vouchs.InvalidDate",
                istable: true,
                iseditor: true,
                searchable: false,
                orderable: false,
                type: "readonly"
            }, {
                label: "货位",
                name: "ToLocator.Name",
                istable: true
            }, {
                label: "行备注",
                name: "Vouchs.Memo",
                istable: true,
                iseditor: true,
                searchable: false,
                orderable: false,
                issubmit: true
            }, {
                label: "分类",
                name: "InvCategory.Code",
                istable: true
            }
        ]
    },
    tab2: {
        Id: 'tab2',
        Name: '盘亏出库单',
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=004",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "004",
        bstype: "007",
        paneltype: "vouchsedit",
        voucheditor: null,
        vouchseditor: null,
        vouchstable: null,
        ismain: false,
        vouchfields: [
            {
                label: "出库单号",
                name: "Vouch.Code",
                isdisabled: true
            }, {
                label: "日期",
                name: "Vouch.VouchDate",
                type: "datetime",
                issubmit: true,
                format: 'YYYY-MM-DD'
            }, {
                label: "仓库",
                name: "Vouch.ToWhId",
                type: "select",
                issubmit: true
            }, {
                label: "审核日期",
                name: "Vouch.VerifyDate",
                isdisabled: true
            }, {
                label: "备注",
                name: "Vouch.Memo",
                issubmit: true
            }
        ],
        vouchsfields: [
           {
               label: "货位",
               name: "Vouchs.ToLocatorId",
               iseditor: true,
               type: "select",
               issubmit: true,
               optcond: { WhId: $('#gparamuserwhid').val() },
               errorinfo: '请选择货位'
           }, {
               label: "主单Id",
               name: "Vouchs.VouchId",
               istable: true
           }, {
               label: "存货",
               name: "Vouchs.InvId",
               iseditor: true,
               type: "select2",
               issubmit: true,
               placeholder: "请选择...",
               placeholderValue: null,
               errorinfo: '请选择存货'
           }, {
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
               label: "批号",
               name: "Vouchs.Batch",
               istable: true,
               iseditor: true,
               issubmit: true,
               type: "select",
               errorinfo: '请选择批号'
           }, {
               label: "数量",
               name: "Vouchs.Num",
               istable: true,
               iseditor: true,
               type:"readonly"
           }, {
               label: "生产日期",
               name: "Vouchs.MadeDate",
               istable: true,
               iseditor: true,
               issubmit: true,
               type: "readonly"
           }, {
               label: "过期日期",
               name: "Vouchs.InvalidDate",
               istable: true,
               iseditor: true,
               issubmit: true,
               type: "readonly"
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
        ]
    },
    tab3: {
        Id: 'tab3',
        Name: '盘盈入库单',
        paneltype: "vouchsedit",
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=003",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "003",
        bstype: "004",
        paneltype: "vouchsedit",
        voucheditor: null,
        vouchseditor: null,
        vouchstable: null,
        ismain: false,
        vouchfields: [
           {
               label: "入库单号",
               name: "Vouch.Code",
               isdisabled: true
           }, {
               label: "日期",
               name: "Vouch.VouchDate",
               type: "datetime",
               issubmit: true,
               format: 'YYYY-MM-DD'
           }, {
               label: "仓库",
               name: "Vouch.ToWhId",
               type: "select",
               issubmit: true
           }, {
               label: "审核日期",
               name: "Vouch.VerifyDate",
               isdisabled: true
           }, {
               label: "备注",
               name: "Vouch.Memo",
               issubmit: true
           }
        ],
        vouchsfields: [
           {
               label: "货位",
               name: "Vouchs.ToLocatorId",
               iseditor: true,
               type: "select",
               issubmit: true,
               optcond: { WhId: $('#gparamuserwhid').val() },
               errorinfo: '请选择货位'
           }, {
               label: "主单Id",
               name: "Vouchs.VouchId",
               istable: true
           }, {
               label: "存货",
               name: "Vouchs.InvId",
               iseditor: true,
               type: "select2",
               issubmit: true,
               placeholder: "请选择...",
               placeholderValue: null,
               errorinfo: '请选择存货'
           }, {
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
               label: "批号",
               name: "Vouchs.Batch",
               istable: true,
               iseditor: true,
               issubmit: true,
               type: "readonly",
               errorinfo: '请选择批号'
           }, {
               label: "数量",
               name: "Vouchs.Num",
               istable: true,
               iseditor: true,
               issubmit: true,
               errorinfo: '请输入数量'
           }, {
               label: "生产日期",
               name: "Vouchs.MadeDate",
               istable: true,
               iseditor: true,
               issubmit: true,
               type: "readonly"
           }, {
               label: "过期日期",
               name: "Vouchs.InvalidDate",
               istable: true,
               iseditor: true,
               issubmit: true,
               type: "readonly"
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
        ]
    }
}

function getvouchtoolbar(tabid) {
    var strtool = '<div class="row editortoolbar mt-10 ml-10 mr-10">';
    if (tabid == 'tab1') {
        strtool += '<div class="dt-buttons btn-group group0 hide col-sm-1">' +
            '<a class="btn btn-primary radius size-S" id="mvcreate"><span>创建盘点单</span></a>' +
            '</div>' +
            '<div class="dt-buttons btn-group group1 hide col-sm-1">' +
            '<a class="btn btn-primary radius size-S" id="mvedit"><span>修改</span></a>' +
            '</div>' +
            '<div class="dt-buttons btn-group group2 hide col-sm-2">' +
            '<a class="btn btn-primary radius size-S" id="mvsave"><span>保存</span></a>' +
            '<a class="btn btn-primary radius size-S" id="mvunsave"><span>取消</span></a>' +
            '</div>';
    }
    strtool += '<div class="dt-buttons btn-group group3 col-sm-4">' +
        '<a class="btn btn-primary radius size-S disabled" id="mvverify"><span>审核</span></a>' +
        '<a class="btn btn-primary radius size-S disabled" id="mvunverify"><span>弃审</span></a>' +
        '</div></div>';
    return strtool;
}

function getvouchform(tabid, formid) {
    var form = '<div class="row widget radius bg-silver-lighter mb-20">';
    if (tabid == 'tab1') {
        form += getvouchtoolbar(tabid);
    }
    form += '<form class="form row form-panel" id="' + formid + '">' +
        '</form></div>';
    return form;
}

function getevouchstable(tableid) {
    return '<table id="' + tableid + '" class="table table-border table-bordered table-bg table-striped display responsive nowrap">' +
        '</table>';
}

$(document).ready(function () {
    var mvid = $('#curvid').val();
    var mvtype = $('#curtype').val();

    function bindMveditorForm(tabconf, json, formid) {
        if (json.data !== undefined && json.data.length > 0) {
            $('#' + formid).attr('data-id', json.data[0].DT_RowId.replace('row_', ''));
            if (json.data[0].Vouch.IsVerify == true) {
                $('#' + formid).append('<input type="hidden" id="isverify" value="true">');
            } else {
                $('#' + formid).append('<input type="hidden" id="isverify" value="false">');
            }
        } else {
            $('#' + formid).attr('data-id', '0');
            $('#' + formid).append('<input type="hidden" id="isverify" value="false">');
        }

        for (var i = 0; i < tabconf.vouchfields.length; i++) {
            var inputtmp = tabconf.voucheditor.field(tabconf.vouchfields[i].name).input();
            switch (tabconf.vouchfields[i].type) {
                case "select":
                    $(inputtmp).addClass('select');
                    $.each(json.options[tabconf.vouchfields[i].name], function (optkey, optval) {
                        $(inputtmp).append('<option value="' + optval.value + '">' + optval.label + '</option>')
                    })
                    break;
                case "select2":
                    $(inputtmp).addClass('select');
                    $.each(json.options[tabconf.vouchfields[i].name], function (optkey, optval) {
                        $(inputtmp).append('<option value="' + optval.value + '">' + optval.label + '</option>')
                    })
                    break;
                case "datetime":
                    $(inputtmp).addClass('input-text');
                    if (json.data === undefined || json.data.length == 0) {
                        $(inputtmp).val(moment().format('YYYY-MM-DD'));
                    }
                    break;
                default:
                    $(inputtmp).addClass('input-text');
                    break;
            }
            if (json.data.length > 0) {
                var fieldsp = tabconf.vouchfields[i].name.split('.');
                var fieldvalue = json.data.length == 0 ? '' : json.data[0][fieldsp[0]][fieldsp[1]];
                $(inputtmp).val(fieldvalue);
            } else {
                if (tabconf.vouchfields[i].name == 'Vouch.ToWhId') {
                    $(inputtmp).val($('#gparamuserwhid').val());
                }
            }
            if (tabconf.vouchfields[i].isdisabled !== undefined && tabconf.vouchfields[i].isdisabled == true) {
                $(inputtmp).attr('disabled', true);
            }

            if (tabconf.vouchfields.length % 3 == 1 && i == tabconf.vouchfields.length - 1) {
                var controlrow = $('<div class="row cl mt-0"><div class="col-sm-12">' +
                    '<label class="form-label col-xs-4 col-sm-1">' + tabconf.vouchfields[i].label + '</label>' +
                    '<div class="formControls col-xs-8 col-sm-11"></div></div></div>');
                controlrow.find('div.formControls').append(inputtmp);
                $('#' + formid).append(controlrow);
            } else {
                if ($('#' + formid).find('div.row').length == 0) {
                    var controlrow = $('<div class="row cl"></div>');
                    controlrow.append('<div class="col-sm-6 col-md-4 mb-10">' +
                        '<label class="form-label col-xs-4 col-sm-4">' + tabconf.vouchfields[i].label + '</label>' +
                        '<div class="formControls col-xs-8 col-sm-8"></div></div>')
                    controlrow.find('div.formControls').append(inputtmp);
                    $('#' + formid).append(controlrow);
                } else {
                    var controlrow = $('#' + formid).find('div.row');
                    var contrl = $('<div class="col-sm-6 col-md-4 mb-10">' +
                        '<label class="form-label col-xs-4 col-sm-4">' + tabconf.vouchfields[i].label + '</label>' +
                        '<div class="formControls col-xs-8 col-sm-8"></div></div>');
                    contrl.find('div.formControls').append(inputtmp);
                    controlrow.append(contrl);
                    $('#' + formid).append(controlrow);
                }
            }
        }
    }

    function createMvsTable(tabconf, json, formid, tableid) {
        var mvid = '0';
        if (json.data !== undefined && json.data.length > 0) {
            mvid = json.data[0].DT_RowId.replace('row_', '');
            if (json.data[0].Vouch.IsVerify == false) {
                tabconf.vouchsfields.push({
                    label:"操作",
                    data: null,
                    istable: true,
                    className: "center",
                    defaultContent: '<div class="btn-group"><a class="btn btn-warning radius size-MINI editor_edit"><span>编辑</span></a><a class="btn btn-warning radius size-MINI editor_remove"><span>删除</span></a></div>'
                })
            }
        }
        var head = $('<thead><tr></tr></thead>');
        $.each(tabconf.vouchsfields, function (key, val) {
            if (val.istable !== undefined && val.istable === true) {
                if (val.name == 'ToLocator.Name' && $('#gparamisloctor').val() == 'false') {
                    return true;
                }
                head.children('tr').append('<th>' + val.label + '</th>');
            }
        })
        $('#' + tableid).append(head);

        var efields = [];
        $.each(tabconf.vouchsfields, function (key, val) {
            if (val.name == 'Vouchs.ToLocatorId' && $('#gparamisloctor').val() == 'false') {
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
                if (val.errorinfo != undefined) {
                    newfield.errorinfo = val.errorinfo;
                }
                if (val.optcond != undefined) {
                    newfield.optcond = val.optcond;
                }
                efields.push(newfield);
            }
        })

        tfields = [];
        $.each(tabconf.vouchsfields, function (key, val) {
            if (val.name == 'ToLocator.Name' && $('#gparamisloctor').val() == 'false') {
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

        tabconf.vouchseditor = new $.fn.dataTable.Editor({
            table: "#" + tableid,
            fields: efields,
            ajax: {
                create: function (method, url, data, successCallback, errorCallback) {
                    var vouchid = $('#' + formid).data('id');
                    if (vouchid != '0') {
                        var reqmvsdata = {
                            action: "create",
                            data: {}
                        };
                        var datatmp = { Vouchs: { VouchId: vouchid } };
                        $.each(tabconf.vouchsfields, function (k, v) {
                            if (v.issubmit !== undefined && v.issubmit == true) {
                                var fieldsp = v.name.split('.');
                                if (datatmp[fieldsp[0]] === undefined) {
                                    datatmp[fieldsp[0]] = {}
                                }
                                datatmp[fieldsp[0]][fieldsp[1]] = data.data[0][fieldsp[0]][fieldsp[1]];
                            }
                        })
                        reqmvsdata.data[0] = datatmp;
                        $.ajax({
                            method: "POST",
                            url: tabconf.vouchsurl,
                            data: reqmvsdata,
                            dataType: "json"
                        })
                        .done(function (json) {
                            successCallback(json);
                        })
                        .error(function (xhr, error, thrown) {
                            errorCallback(xhr, error, thrown);
                        });
                    }
                },
                edit: function (method, url, data, successCallback, errorCallback) {
                    $.each(data.data, function (key, val) {
                        val.FromLocator = undefined;
                        val.Inventory = undefined;
                        val.ToLocator = undefined;
                        val.UOM = undefined;
                        val.Vouchs.Amount = undefined;
                        val.Vouchs.FromLocatorId = undefined;
                    })
                    $.ajax({
                        method: "POST",
                        url: tabconf.vouchsurl,
                        data: data,
                        dataType: "json"
                    })
                    .done(function (json) {
                        successCallback(json);
                    })
                    .error(function (xhr, error, thrown) {
                        errorCallback(xhr, error, thrown);
                    });
                },
                remove: tabconf.vouchsurl
            }
        });

        if (tabconf.Id == 'tab3') {
            tabconf.vouchseditor.on('open', function (e, display, action) {
                if (action != 'remove') {
                    var inputtmp = tabconf.vouchseditor.field('Vouchs.InvId').input();
                    $(inputtmp).attr('disabled', true);
                }
            })
        }

        if (tabconf.Id == 'tab1') {
            tabconf.vouchseditor.on('open', function (e, display, action) {
                if (action == 'edit') {
                    var indexes = tabconf.vouchstable.rows({ search: 'applied' }).indexes();
                    var currentIndex = tabconf.vouchstable.row({ selected: true }).index();
                    var currentPosition = indexes.indexOf(currentIndex);
                    if (currentPosition == 0) {
                        $('button.btnprev').addClass('disabled');
                    } else if (currentPosition == indexes.length - 1) {
                        $('button.btnnext').addClass('disabled');
                    } else {
                        $('button.btnprev').removeClass('disabled');
                        $('button.btnnext').removeClass('disabled');
                    }
                }
            })
        }

        tabconf.vouchseditor.on('preSubmit', function (e, o, action) {
            if (action != 'remove') {
                var iserror = false;
                $.each(efields, function (k, v) {
                    if (v.errorinfo !== undefined) {
                        var field = tabconf.vouchseditor.field(v.name);
                        if (!field.val() && !$(field.input()).val()) {
                            field.error(v.errorinfo);
                            iserror = true;
                        }
                    }
                    if (v.name == 'Vouchs.CNum') {
                        var outnum = parseInt(field.val());
                        if (outnum < 0) {
                            field.error('请输入盘点数');
                            iserror = true;
                        }
                    }
                })

                if (!iserror) {
                    if (action == 'create') {
                        var existdata = tabconf.vouchstable.ajax.json().data;
                        var flag = false;
                        $.each(existdata, function (k, v) {
                            if (o.data[0].Vouchs.InvId == v.Vouchs.InvId) {
                                if (o.data[0].Vouchs.Batch !== undefined && $(tabconf.vouchseditor.field('Vouchs.Batch').input()).val() == v.Vouchs.Batch) {
                                    if (o.data[0].Vouchs.MadeDate !== undefined && o.data[0].Vouchs.MadeDate == v.Vouchs.MadeDate && o.data[0].Vouchs.InvalidDate == v.Vouchs.InvalidDate) {
                                        flag = true;
                                        return false;
                                    }
                                }
                            }
                        })
                        if (flag) {
                            tabconf.vouchseditor.field('Vouchs.InvId').error('该单据中已经存在相同的存货记录');
                            iserror = true;
                        }
                    }
                }

                if (iserror) {
                    return false;
                } else {
                    $.each(o.data, function (k, v) {
                        o.data[k].Vouchs.Batch = $(tabconf.vouchseditor.field('Vouchs.Batch').input()).val();
                        if (action == 'edit') {
                            o.data[k].Vouchs.Num = undefined;
                        }
                    })
                }
            }
        })

        tabconf.vouchseditor.on('initCreate', function (e, o, action) {
            var inputtmp = tabconf.vouchseditor.field('Vouchs.InvId').input();
            inputtmp.attr('disabled', false);
            curstockdata = null;
            var batchinput = tabconf.vouchseditor.field('Vouchs.Batch').input();
            $(batchinput).empty();
            tabconf.vouchseditor.field('Vouchs.MadeDate').set('');
            tabconf.vouchseditor.field('Vouchs.InvalidDate').set('');
        })

        tabconf.vouchseditor.on('initEdit', function (e, tr, data) {
            editcurbatch = data.Vouchs.Batch;
            var inputtmp = tabconf.vouchseditor.field('Vouchs.InvId').input();
            inputtmp.attr('disabled', true);
            inputtmp = tabconf.vouchseditor.field('Vouchs.Batch').input();
            inputtmp.attr('disabled', true);
        })

        var strdom = "<'row'<'col-sm-2'B><'custgroup col-sm-2'><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>";
        if (tabconf.Id == 'tab2' || tabconf.Id == 'tab3') {
            strdom = "<'row'<'col-sm-4'><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>";
        } else if(tabconf.Id == 'tab1' && $('#tab1').find('#isverify').val() == 'true'){
            strdom = "<'row'<'col-sm-2'><'custgroup col-sm-2'><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>";
        }
        var strbuttons = [];
        if (tabconf.Id == "tab1") {
            var backNext = [
                {
                    label: "&lt;",
                    className:"btnprev",
                    fn: function (e) {
                        var indexes = tabconf.vouchstable.rows({ search: 'applied' }).indexes();
                        var currentIndex = tabconf.vouchstable.row({ selected: true }).index();
                        var currentPosition = indexes.indexOf(currentIndex);

                        if (currentPosition > 0) {
                            tabconf.vouchstable.row(currentIndex).deselect();
                            tabconf.vouchstable.row(indexes[currentPosition - 1]).select();
                        }
                        tabconf.vouchstable.button(0).trigger();
                    }
                },
                {
                    label: '修改',
                    fn: function (e) {
                        checkmvseditorindex = tabconf.vouchstable.row({ selected: true }).index();
                        this.submit(null, null, null, false);
                    }
                },
                {
                    label: "&gt;",
                    className: "btnnext",
                    fn: function (e) {
                        var indexes = tabconf.vouchstable.rows({ search: 'applied' }).indexes();
                        var currentIndex = tabconf.vouchstable.row({ selected: true }).index();
                        var currentPosition = indexes.indexOf(currentIndex);
                        if (currentPosition < indexes.length - 1) {
                            tabconf.vouchstable.row(currentIndex).deselect();
                            tabconf.vouchstable.row(indexes[currentPosition + 1]).select();
                        }
                        tabconf.vouchstable.button(0).trigger();
                    }
                }
            ];
            strbuttons = [
                {
                    extend: 'selected',
                    text: '编辑',
                    action: function () {
                        var index = tabconf.vouchstable.row({ selected: true }).index();
                        tabconf.vouchseditor.edit(index, {
                            title: '<h3>编辑记录</h3>',
                            buttons: backNext
                        });
                    }
                },
                { extend: "remove", editor: tabconf.vouchseditor }
            ]
        }
        var drawcallback=null;
        if (tabconf.Id == 'tab1' && $('#tab1').find('#isverify').val() == 'false') {
            drawcallback=function(){
                var indexes = tabconf.vouchstable.rows({ search: 'applied' }).indexes();
                var currentPosition = indexes.indexOf(checkmvseditorindex);
                tabconf.vouchstable.row(indexes[currentPosition]).select();
            }
        }
        var strvisibelcol = [{ targets: [0], visible: false }];
        if (tabconf.Id == 'tab1') {
            strvisibelcol = [{ targets: [0,11], visible: false }];
        }
        tabconf.vouchstable = $('#' + tableid)
            .on('preXhr.dt', function (e, settings, json) {
                if (json.search.value != '') {
                    json.search.value = "like '%" + json.search.value + "%'";
                }
            })
            .DataTable({
                dom: strdom,
                processing: true,
                serverSide: true,
                autoWidth: false,
                ajax: {
                    url: tabconf.vouchsurl,
                    type: "POST"
                },
                columns: tfields,
                select: 'single',
                buttons: strbuttons,
                searchCols: [
                    { search: "='" + mvid + "'" }
                ],
                columnDefs: strvisibelcol,
                drawCallback:drawcallback,
                language: {
                    "lengthMenu": "每页显示 _MENU_ 条记录",
                    "zeroRecords": "抱歉， 没有找到",
                    "info": "当前 : _START_ - _END_ / 共_TOTAL_条",
                    "infoEmpty": "没有数据",
                    "infoFiltered": "",
                    "loadingRecords": "加载中......",
                    "processing": "<span class='spinner-small'></span>",
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

        tabconf.vouchstable.on('select', function (e, dt, type, indexes) {
            if ($('#' + tabconf.Id).find('#isverify').val() == 'true') {
                tabconf.vouchstable.buttons().disable();
            }
        })

        if (tabconf.Id == 'tab1') {
            var custgroup = '<div class="btn-group dropDown">' +
                '<a href="javascript:;" data-toggle="dropdown" class="btn btn-success dropdown-toggle radius size-S">' +
                '<span class="catalogcur">全部分类</span><span class="caret"></span>' +
                '</a>' +
                '<ul class="dropDown-menu menu radius f-12" id="dropdown-catalog">' +
                '<li><a href="javascript:;" class="dropdowncat" data-id="0">全部分类</a></li>' +
                '<li><a href="javascript:;" class="dropdowncat" data-id="1">产成品</a></li>' +
                '<li><a href="javascript:;" class="dropdowncat" data-id="2">半成品</a></li>' +
                '<li><a href="javascript:;" class="dropdowncat" data-id="3">原材料</a></li>' +
                '</ul>'+
                '</div>';
            $('#tab1').find('div.custgroup').append(custgroup);

            $('#tab1 .custgroup .dropDown ul a.dropdowncat').on('click', function (e) {
                panelLoading(this);
                var catid = $(this).data('id');
                var name = $(this).html();
                $('span.catalogcur').html(name);
                var searchvalue = '';
                if (catid == '1') {
                    searchvalue = "not in('QTZL','mjl','BC','YCL','stck','bcp')";
                } else if (catid == '2') {
                    searchvalue = "='bcp'";
                } else if (catid == '3') {
                    searchvalue = "in('QTZL','mjl','BC','YCL','stck')";
                }
                tabconf.vouchstable
                    .columns(11)
                    .search(searchvalue)
                    .draw();
                panelLoaded(this);
            });

            $('#' + tableid).on('click', 'a.editor_edit', function (e) {
                e.preventDefault();
                var eletr = $(this).closest('tr');
                if (eletr.hasClass('child')) {
                    eletr = eletr.prev('tr.parent');
                }
                tabconf.vouchstable.rows(eletr).select();
                tabconf.vouchseditor.edit(eletr, {
                    title: '编辑记录',
                    buttons: '修改'
                });
            });

            $('#' + tableid).on('click', 'a.editor_remove', function (e) {
                e.preventDefault();
                var eletr = $(this).closest('tr');
                if (eletr.hasClass('child')) {
                    eletr = eletr.prev('tr.parent');
                }
                tabconf.vouchstable.rows(eletr).select();
                tabconf.vouchseditor.remove(eletr, {
                    title: '删除记录',
                    message: '您确定要删除 ' + eletr.find('td:nth-child(2)').html() + ' 吗？',
                    buttons: '删除'
                });
            });
        }

        //if (tabconf.Id == 'tab1') {
        //    var invidnode = tabconf.vouchseditor.field('Vouchs.InvId').input();
        //    $(invidnode).on('change', function () {
        //        var invopts = tabconf.vouchstable.ajax.json().options['Vouchs.InvId'];
        //        var curselectinvid = $(this).val();
        //        for (var i = 0; i < invopts.length; i++) {
        //            if (invopts[i].value == curselectinvid) {
        //                tabconf.vouchseditor.field('Inventory.Specs').val(invopts[i].label.Specs);
        //                tabconf.vouchseditor.field('UOM.Name').val(invopts[i].label.StockUOMName);
        //                break;
        //            }
        //        }
        //        var curwhid = $('#gparamuserwhid').val();
        //        var loctor = '';
        //        if ($('#gparamisloctor').val() == 'true') {
        //            if (tabconf.vouchseditor.field('Vouchs.ToLocatorId') !== undefined) {
        //                loctor = '=' + tabconf.vouchseditor.field('Vouchs.ToLocatorId').val();
        //            }
        //        }
        //        if (curselectinvid != null) {
        //            curstockdata = null;
        //            $.ajax({
        //                url: "/api/Editor/Data?model=CurrentStock",
        //                dataType: 'json',
        //                method: 'POST',
        //                data: {
        //                    draw: 1,
        //                    columns: [
        //                        {
        //                            data: 'WhId',
        //                            name: '',
        //                            searchable: true,
        //                            orderable: true,
        //                            search: { value: '=' + curwhid, regex: false }
        //                        }, {
        //                            data: 'LocatorId',
        //                            name: '',
        //                            searchable: true,
        //                            orderable: true,
        //                            search: { value: loctor, regex: false }
        //                        }, {
        //                            data: 'InvId',
        //                            name: '',
        //                            searchable: true,
        //                            orderable: true,
        //                            search: { value: '=' + curselectinvid, regex: false }
        //                        }
        //                    ],
        //                    order: [
        //                        { column: 0, dir: 'asc' }
        //                    ],
        //                    start: 0,
        //                    length: -1,
        //                    search: { value: '', regex: false }
        //                },
        //                success: function (jsonsk) {
        //                    if (jsonsk.data == undefined || jsonsk.data.length == 0) {
        //                        tabconf.vouchseditor.field('Vouchs.Num').set(0);
        //                    }else{
        //                        curstockdata = jsonsk.data;
        //                        var batchinput = tabconf.vouchseditor.field('Vouchs.Batch').input();
        //                        $(batchinput).empty();
        //                        $.each(jsonsk.data, function (k, v) {
        //                            $(batchinput).append('<option value="' + v.Batch + '">' + v.Batch + '</option>');
        //                        })
        //                        if (jsonsk.data[0].Num == undefined || jsonsk.data[0].Num==null) {
        //                            tabconf.vouchseditor.field('Vouchs.Num').set(0);
        //                        } else {
        //                            tabconf.vouchseditor.field('Vouchs.Num').set(jsonsk.data[0].Num);
        //                        }
        //                        tabconf.vouchseditor.field('Vouchs.MadeDate').set(jsonsk.data[0].MadeDate);
        //                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(jsonsk.data[0].InvalidDate);
        //                        if (editcurbatch != null) {
        //                            $(batchinput).val(editcurbatch);
        //                            $(batchinput).change();
        //                            editcurbatch = null;
        //                        }
        //                    }
        //                },
        //                error: function (e) {
        //                    var errobj = eval("(" + e.responseText + ")");
        //                    var errinfo = "";
        //                    if (errobj.exceptionMessage) {
        //                        errinfo = errinfo + errobj.exceptionMessage;
        //                    }
        //                    $.each(errobj.modelState, function (key, value) {
        //                        if (key == "other") {
        //                            errinfo += "<p>详细信息：";
        //                            $.each(value, function (i, val) {
        //                                errinfo += val + '|';
        //                            });
        //                            errinfo = errinfo.substr(0, errinfo.length - 1);
        //                            errinfo += "</p>";
        //                        } else {
        //                            errinfo += '<p>' + key + '：' + value + '</p>';
        //                        }
        //                    });
        //                    $('div.DTE_Form_Error').html(errinfo);
        //                }
        //            })
        //        }
        //    })
        //}

        //if (tabconf.Id == 'tab1') {
        //    var batchinput = tabconf.vouchseditor.field('Vouchs.Batch').input();
        //    $(batchinput).on('change', function () {
        //        var curselectbatch = $(this).val();
        //        $.each(curstockdata, function (i, d) {
        //            if (curselectbatch == d.Batch) {
        //                tabconf.vouchseditor.field('Vouchs.Num').set(d.Num);
        //                tabconf.vouchseditor.field('Vouchs.MadeDate').set(d.MadeDate);
        //                tabconf.vouchseditor.field('Vouchs.InvalidDate').set(d.InvalidDate);
        //            }
        //        })
        //    })
        //}
    }

    function createPanelContent(tabconf, mvid, reqdata) {
        switch (tabconf.paneltype) {
            case 'vouchsedit':
                $.ajax({
                    type: "POST",
                    url: tabconf.vouchurl,
                    data: reqdata,
                    dataType: 'json',
                    success: function (json) {
                        if (json.data == undefined || json.data.length == 0) {
                            if (mvid != '0' && tabconf.ismain == true) {
                                addUIAlter('nav.breadcrumb', '获取单据错误', 'error');
                                return false;
                            } else if (tabconf.ismain == false) {
                                if ($('#tab1').find('#isverify').val() == 'true') {
                                    $('#' + tabconf.Id).addClass('tabempty');
                                    var strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>无' + tabconf.Name + '</h1></div>' +
                                        '<div class="col-sm-12 text-c emptycontent">本次盘点无' + tabconf.Name;
                                    if (tabconf.Id == 'tab2') {
                                        strempty += '，没有任何盘亏数据。';
                                    } else {
                                        strempty += '，没有任何盘盈数据。';
                                    }
                                    strempty += '</div>';
                                    $('#' + tabconf.Id).append(strempty);
                                } else {
                                    $('#' + tabconf.Id).addClass('tabempty');
                                    var strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>盘点单未审核</h1></div>' +
                                        '<div class="col-sm-12 text-c emptycontent">' + tabconf.Name + '暂未生成，需等待盘点单审核完成，请先审核盘点单。</div>';
                                    $('#' + tabconf.Id).append(strempty);
                                }
                                return false;
                            }
                        }
                        vouchorgdata = json;
                        tabconf.voucheditor = new $.fn.dataTable.Editor({
                            ajax: "/api/Editor/Data?model=Vouch&VouchType=" + tabconf.vchtype,
                            fields: tabconf.vouchfields
                        });
                        var editorform = getvouchform(tabconf.Id, tabconf.Id + 'mvform');
                        var editortable = getevouchstable(tabconf.Id + 'table');

                        $('#' + tabconf.Id).append(editorform).append(editortable);

                        bindMveditorForm(tabconf, json, tabconf.Id + 'mvform');
                        createMvsTable(tabconf, json, tabconf.Id + 'mvform', tabconf.Id + 'table');
                        if (mvid == '0') {
                            if (!$('div.group1').hasClass('hide')) {
                                $('div.group1').addClass('hide')
                            }
                            if (!$('div.group2').hasClass('hide')) {
                                $('div.group2').addClass('hide')
                            }
                            if (!$('div.group3').hasClass('hide')) {
                                $('div.group3').addClass('hide')
                            }
                            if ($('div.group0').hasClass('hide')) {
                                $('div.group0').removeClass('hide')
                            }
                            tabconf.vouchstable.button(0).disable();
                        } else {
                            if (json.data[0].Vouch.IsVerify == true) {
                                checkMvControlDis(tabconf, '2', tabconf.Id + 'mvform');
                                if (!$('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvverify').addClass('disabled');
                                }
                                if ($('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvunverify').removeClass('disabled');
                                }
                            } else {
                                checkMvControlDis(tabconf, '0', tabconf.Id + 'mvform');
                                if ($('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvverify').removeClass('disabled');
                                }
                                if (!$('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvunverify').addClass('disabled');
                                }
                            }
                        }
                        $('#' + tabconf.Id).find('#mvedit').on('click', function () {
                            checkMvControlDis(tabconf, '1', tabconf.Id + 'mvform');
                            if (!$('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                $('#' + tabconf.Id).find('#mvverify').addClass('disabled')
                            }
                            if (!$('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                $('#' + tabconf.Id).find('#mvunverify').addClass('disabled')
                            }
                        })
                        $('#' + tabconf.Id).find('#mvunsave').on('click', function () {
                            for (var i = 0; i < tabconf.vouchfields.length; i++) {
                                var fieldsp = tabconf.vouchfields[i].name.split('.');
                                var fieldvalue = vouchorgdata.data.length == 0 ? '' : vouchorgdata.data[0][fieldsp[0]][fieldsp[1]];
                                var inputtmp = $('#' + tabconf.Id + 'mvform').find('#DTE_Field_' + tabconf.vouchfields[i].name.replace('.', '-'));
                                $(inputtmp).val(fieldvalue);
                            }
                            if ($('#' + tabconf.Id).find('#isverify').val() == 'true') {
                                if (!$('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvverify').addClass('disabled')
                                }
                                if ($('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvunverify').removeClass('disabled')
                                }
                            } else {
                                if ($('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvverify').removeClass('disabled')
                                }
                                if (!$('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                    $('#' + tabconf.Id).find('#mvunverify').addClass('disabled')
                                }
                            }
                            checkMvControlDis(tabconf, '0', tabconf.Id + 'mvform');
                        })
                        $('#' + tabconf.Id).find('#mvcreate').on('click', function () {
                            var vouchid = $('#' + tabconf.Id + 'mvform').data('id');
                            var vouchtype = tabconf.vchtype;
                            if (vouchid == '0') {
                                var reqmvdata = {
                                    action: "create",
                                    data: {}
                                };
                                var datatmp = {};
                                datatmp.Vouch = {
                                    VouchType: vouchtype
                                };
                                $.each(tabconf.vouchfields, function (k, v) {
                                    if (v.issubmit !== undefined && v.issubmit == true) {
                                        var fieldsp = v.name.split('.');
                                        if (datatmp[fieldsp[0]] === undefined) {
                                            datatmp[fieldsp[0]] = {}
                                        }
                                        datatmp[fieldsp[0]][fieldsp[1]] = $('#' + tabconf.Id + 'mvform').find('#DTE_Field_' + v.name.replace('.', '-')).val();
                                    }
                                })
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
                                        addUIAlter('nav.breadcrumb', '更新成功', 'success');
                                        checkMvControlDis(tabconf, '0', tabconf.Id + 'mvform');
                                        if (tabconf.Id == 'tab1') {
                                            document.location = "/StockMg/CheckVouch?id=" + jsonmv.data[0].DT_RowId.replace('row_', '') + "&type=" + jsonmv.data[0].Vouch.VouchType;
                                        }
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
                        $('#' + tabconf.Id).find('#mvsave').on('click', function () {
                            var vouchid = $('#' + tabconf.Id + 'mvform').data('id');
                            var vouchtype = tabconf.vchtype;
                            if (vouchid != '0') {
                                var reqmvdata = {
                                    action: "edit",
                                    data: {}
                                };
                                var datatmp = {};
                                datatmp.Vouch = {
                                    VouchType: vouchtype,
                                };
                                $.each(tabconf.vouchfields, function (k, v) {
                                    if (v.issubmit !== undefined && v.issubmit == true) {
                                        var fieldsp = v.name.split('.');
                                        if (datatmp[fieldsp[0]] === undefined) {
                                            datatmp[fieldsp[0]] = {}
                                        }
                                        datatmp[fieldsp[0]][fieldsp[1]] = $('#' + tabconf.Id + 'mvform').find('#DTE_Field_' + v.name.replace('.', '-')).val();
                                    }
                                })
                                reqmvdata.data['row_' + vouchid] = datatmp;
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
                                        addUIAlter('nav.breadcrumb', '更新成功', 'success');
                                        checkMvControlDis(tabconf, '0', tabconf.Id + 'mvform');
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
                        $('#' + tabconf.Id).find('#mvverify').on('click', function () {
                            var vouchid = $('#' + tabconf.Id + 'mvform').data('id');
                            var vouchtype = tabconf.vchtype;
                            var objtarget = this;
                            panelLoading(objtarget);
                            $.ajax({
                                url: "/api/Editor/Data?model=Vouchs",
                                dataType: 'json',
                                method: 'POST',
                                data: {
                                    draw: 1,
                                    columns: [
                                        {
                                            data: 'Vouchs.VouchId',
                                            name: '',
                                            searchable: true,
                                            orderable: true,
                                            search: { value: '=' + vouchid, regex: false }
                                        }, {
                                            data: 'Vouchs.CNum',
                                            name: '',
                                            searchable: true,
                                            orderable: true,
                                            search: { value: '<0', regex: false }
                                        }
                                    ],
                                    order: [
                                        { column: 0, dir: 'asc' }
                                    ],
                                    start: 0,
                                    length: -1,
                                    search: { value: '', regex: false }
                                },
                                success: function (jsonsk) {
                                    if (jsonsk.data == undefined) {
                                        addUIAlter('nav.breadcrumb', '获取单据错误，请刷新后重试', 'error');
                                    }else if (jsonsk.data.length == 0) {
                                        reqdata = {
                                            action: 'verify',
                                            data: {}
                                        }
                                        reqdata.data['row_' + vouchid] = { Vouch: { IsVerify: true, VouchType: vouchtype } };
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
                                                $('#' + tabconf.Id + 'mvform').find('#isverify').val(jsonmv.data[0].Vouch.IsVerify);
                                                if (jsonmv.data[0].Vouch.IsVerify == true) {
                                                    if (!$('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                                        $('#' + tabconf.Id).find('#mvverify').addClass('disabled')
                                                    }
                                                    if ($('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                                        $('#' + tabconf.Id).find('#mvunverify').removeClass('disabled')
                                                    }
                                                    checkMvControlDis(tabconf, '2', tabconf.Id + 'mvform');
                                                } else {
                                                    if ($('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                                        $('#' + tabconf.Id).find('#mvverify').removeClass('disabled')
                                                    }
                                                    if (!$('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                                        $('#' + tabconf.Id).find('#mvunverify').addClass('disabled')
                                                    }
                                                    checkMvControlDis(tabconf, '3', tabconf.Id + 'mvform');
                                                }
                                                addUIAlter('nav.breadcrumb', '审核成功', 'success');
                                                if (tabconf.Id == 'tab1') {
                                                    document.location = "/StockMg/CheckVouch?id=" + jsonmv.data[0].DT_RowId.replace('row_', '') + "&type=" + jsonmv.data[0].Vouch.VouchType;
                                                }
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
                                    } else {
                                        panelLoaded(objtarget);
                                        var einfo='盘点数有负数，共' + jsonsk.data.length+'条记录，点击盘点数列可按盘点数排序查看并修改负盘点数记录';
                                        addUIAlter('nav.breadcrumb', einfo, 'error');
                                    }
                                },
                                error: function (e) {
                                    panelLoaded(objtarget);
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
                        })
                        $('#' + tabconf.Id).find('#mvunverify').on('click', function () {
                            var vouchid = $('#' + tabconf.Id + 'mvform').data('id');
                            var vouchtype = tabconf.vchtype;
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
                                    $('#' + tabconf.Id + 'mvform').find('#isverify').val(jsonmv.data[0].Vouch.IsVerify);
                                    if (jsonmv.data[0].Vouch.IsVerify == true) {
                                        if (!$('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                            $('#' + tabconf.Id).find('#mvverify').addClass('disabled')
                                        }
                                        if ($('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                            $('#' + tabconf.Id).find('#mvunverify').removeClass('disabled')
                                        }
                                        checkMvControlDis(tabconf, '2', tabconf.Id + 'mvform');
                                    } else {
                                        if ($('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                                            $('#' + tabconf.Id).find('#mvverify').removeClass('disabled')
                                        }
                                        if (!$('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                                            $('#' + tabconf.Id).find('#mvunverify').addClass('disabled')
                                        }
                                        checkMvControlDis(tabconf, '3', tabconf.Id + 'mvform');
                                    }
                                    addUIAlter('nav.breadcrumb', '弃审成功', 'success');
                                    if (tabconf.Id == 'tab1') {
                                        document.location = "/StockMg/CheckVouch?id=" + jsonmv.data[0].DT_RowId.replace('row_', '') + "&type=" + jsonmv.data[0].Vouch.VouchType;
                                    }
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
                break;
            default:
                break;
        }
    }

    $.each(wizsteps, function (key, val) {
        $('#vouchnav ul').append('<li><a href="#' + key + '" data-toggle="tab">' + val.Name + '</a></li>');
        $('#rootwizard .tab-content').append('<div class="tab-pane row" id="' + key + '"></div>');
        var reqdata = null;
        switch (val.Id) {
            case "tab1":
                reqdata = {
                    draw: 1,
                    columns: [
                        {
                            data: 'DT_RowId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + mvid, regex: false }
                        },
                        {
                            data: 'Vouch.VouchType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + val.vchtype, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: 1,
                    search: { value: '', regex: false }
                };
                break;
            case "tab2":
                reqdata = {
                    draw: 1,
                    columns: [
                        {
                            data: 'Vouch.VouchType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + val.vchtype, regex: false }
                        },
                        {
                            data: 'Vouch.BusType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + val.bstype, regex: false }
                        },
                        {
                            data: 'Vouch.SourceId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + mvid, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: 1,
                    search: { value: '', regex: false }
                };
                break;
            case "tab3":
                reqdata = {
                    draw: 1,
                    columns: [
                        {
                            data: 'Vouch.VouchType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + val.vchtype, regex: false }
                        },
                        {
                            data: 'Vouch.BusType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + val.bstype, regex: false }
                        },
                        {
                            data: 'Vouch.SourceId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + mvid, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: 1,
                    search: { value: '', regex: false }
                };
                break;
        }
        createPanelContent(val, mvid, reqdata);
    })

    $('#rootwizard').bootstrapWizard();
    //$('#rootwizard').bootstrapWizard({
    //    onTabShow: function (tab, navigation, index) {
    //        var $total = navigation.find('li').length;
    //        var $current = index + 1;
    //        var $percent = ($current / $total) * 100;
    //        $('#rootwizard').find('.bar').css({ width: $percent + '%' });
    //    }
    //});

    function checkMvControlDis(tabconf, mod, formid) {
        switch (mod) {
            case '0':
                if ($('#' + tabconf.Id).find('div.group1').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group1').removeClass('hide')
                }
                if (!$('#' + tabconf.Id).find('div.group2').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group2').addClass('hide')
                }
                for (var i = 0; i < tabconf.vouchfields.length; i++) {
                    if (tabconf.vouchfields[i].isdisabled === undefined || tabconf.vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#' + formid).find('#DTE_Field_' + tabconf.vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', true);
                    }
                }
                if ($('#' + formid).find('#isverify').val() == 'true') {
                    if (!$('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                        $('#' + tabconf.Id).find('#mvverify').addClass('disabled')
                    }
                    if ($('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                        $('#' + tabconf.Id).find('#mvunverify').removeClass('disabled')
                    }
                } else {
                    if ($('#' + tabconf.Id).find('#mvverify').hasClass('disabled')) {
                        $('#' + tabconf.Id).find('#mvverify').removeClass('disabled')
                    }
                    if (!$('#' + tabconf.Id).find('#mvunverify').hasClass('disabled')) {
                        $('#' + tabconf.Id).find('#mvunverify').addClass('disabled')
                    }
                }
                break;
            case '1':
                if (!$('#' + tabconf.Id).find('div.group1').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group1').addClass('hide')
                }
                if ($('#' + tabconf.Id).find('div.group2').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group2').removeClass('hide')
                }
                for (var i = 0; i < tabconf.vouchfields.length; i++) {
                    if (tabconf.vouchfields[i].isdisabled === undefined || tabconf.vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#' + formid).find('#DTE_Field_' + tabconf.vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', false);
                    }
                }
                break;
            case '2':
                if (!$('#' + tabconf.Id).find('div.group1').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group1').addClass('hide')
                }
                if (!$('#' + tabconf.Id).find('div.group2').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group2').addClass('hide')
                }
                for (var i = 0; i < tabconf.vouchfields.length; i++) {
                    if (tabconf.vouchfields[i].isdisabled === undefined || tabconf.vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#' + formid).find('#DTE_Field_' + tabconf.vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', true);
                    }
                }
                tabconf.vouchstable.button(0).disable();
                break;
            case '3':
                if ($('#' + tabconf.Id).find('div.group1').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group1').removeClass('hide')
                }
                if (!$('#' + tabconf.Id).find('div.group2').hasClass('hide')) {
                    $('#' + tabconf.Id).find('div.group2').addClass('hide')
                }
                for (var i = 0; i < tabconf.vouchfields.length; i++) {
                    if (tabconf.vouchfields[i].isdisabled === undefined || tabconf.vouchfields[i].isdisabled == false) {
                        var inputtmp = $('#' + formid).find('#DTE_Field_' + tabconf.vouchfields[i].name.replace('.', '-'));
                        $(inputtmp).attr('disabled', true);
                    }
                }
                tabconf.vouchstable.buttons(0).enable();
                break;
            default:
                break;
        }
    }
})