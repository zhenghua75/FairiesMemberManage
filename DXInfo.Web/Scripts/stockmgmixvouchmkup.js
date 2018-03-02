var vouchorgdata = null;
var editcurbatch = null;
var vouchtransdata = null;
var vouchplandata = null;
var curstockdata = null;
var orgvouchlinkdata = null;
var checkmvseditorindex = 0;
var wizsteps = {
    tab1: {
        Id: 'tab1',
        Name: '叫货汇总',
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=012",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "012",
        bstype: null,
        paneltype: "vouchssum",
        mixlisttable: null,
        sumtable: null
    },
    tab2: {
        Id: 'tab2',
        Name: '生产计划单',
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=014",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "014",
        bstype: null,
        paneltype: "vouchsedit",
        voucheditor: null,
        vouchseditor: null,
        vouchstable: null,
        vouchlinktable:null,
        ismain: true,
        vouchfields: [
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
                label: "数量",
                name: "Vouchs.Num",
                istable: true,
                iseditor: true,
                issubmit: true,
                errorinfo: '请输入数量'
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
        Name: '产成品入库单',
        paneltype: "vouchlist",
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=006",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "006",
        bstype: "011",
        vouchtable: null,
        voucheditor: null,
        ismain: false,
        vouchfields: [
           {
               label: "单据类型",
               name: "Vouch.VouchType",
               istable:true
           }, {
               label: "业务类型",
               name: "Vouch.BusType",
               istable: true
           }, {
               label: "sourceid",
               name: "Vouch.SourceId",
               istable: true
           }, {
               label: "入库单号",
               name: "Vouch.Code",
               istable: true
           }, {
               label: "日期",
               name: "Vouch.VouchDate",
               istable: true
           }, {
               label: "仓库",
               name: "InWarehouse.Name",
               istable: true
           }, {
               label: "审核日期",
               name: "Vouch.VerifyDate",
               istable: true
           }, {
               label: "审核状态",
               name: "Vouch.IsVerify",
               istable: true,
               render: function (val, type, row) {
                   return val == true ? '已审核' : '未审核';
               }
           }, {
               label: "单据明细",
               name: "DT_RowId",
               istable: true,
               searchable: false,
               orderable: false,
               render: function (val, type, row) {
                   var content = '<button class="btn btn-warning radius size-MINI" id="btnvouchs" data-id="' + val + '">明细</button>';
                   return content;
               }
           }
        ]
    },
    tab4: {
        Id: 'tab4',
        Name: '调拨单',
        paneltype: "vouchgallery",
        vouchurl: "/api/Editor/Data?model=VouchLink",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "009",
        bstype: "016",
        ismain: false
    },
    tab5: {
        Id: 'tab5',
        Name: '调拨单审核',
        vouchurl: "/api/Editor/Data?model=Vouch&VouchType=009",
        vouchsurl: "/api/Editor/Data?model=Vouchs",
        vchtype: "009",
        bstype: "016",
        paneltype: "vouchsedit",
        voucheditor: null,
        vouchseditor: null,
        vouchstable: null,
        ismain: false,
        vouchfields: [
            {
                label: "调拨单号",
                name: "Vouch.Code",
                isdisabled: true
            }, {
                label: "日期",
                name: "Vouch.VouchDate",
                type: "datetime",
                issubmit: true,
                format: 'YYYY-MM-DD'
            }, {
                label: "转出仓库",
                name: "Vouch.FromWhId",
                type: "select",
                issubmit: true,
                isdisabled: true
            }, {
                label: "转入仓库",
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
                errorinfo:'请选择批号'
            }, {
                label: "当前库存数量",
                name: "CurStockNum",
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
                label: "单价",
                name: "Vouchs.Price",
                istable: true,
                iseditor: true,
                issubmit: true,
                type: "readonly"
            }, {
                label: "金额",
                name: "Vouchs.Amount",
                istable: true
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
    if (tabid == 'tab3') {
        strtool += '<div class="dt-buttons btn-group group1 hide col-sm-1">' +
            '<a class="btn btn-primary radius size-S" id="mvedit"><span>修改</span></a>' +
            '</div>' +
            '<div class="dt-buttons btn-group group2 hide col-sm-2">' +
            '<a class="btn btn-primary radius size-S" id="mvsave"><span>保存</span></a>' +
            '<a class="btn btn-primary radius size-S" id="mvunsave"><span>取消</span></a>' +
            '</div>';
    }
    strtool += '<div class="dt-buttons btn-group group3 col-sm-4">' +
        '<a class="btn btn-primary radius size-S disabled" id="mvverify"><span>审核</span></a>' +
        '<a class="btn btn-primary radius size-S disabled" id="mvunverify"><span>弃审</span></a>'+
        '</div>';
    if (tabid == 'tab5') {
        strtool += '<div class="dt-buttons btn-group group5 col-sm-4">' +
            '<a class="btn btn-primary radius size-S" id="mvtransprint"><span>打印</span></a>' +
            '</div>';
    }else if (tabid == 'tab2') {
        strtool += '<div class="dt-buttons btn-group group5 col-sm-4">' +
            '<a class="btn btn-primary radius size-S" id="mvplanprint"><span>打印</span></a>' +
            '</div>';
    }
    strtool += '</div>';
    return strtool;
}

function getvouchform(tabid, formid) {
    var form = '<div class="row widget radius bg-silver-lighter mb-20">';
    if (tabid == 'tab2') {
        form = '<div class="row widget radius bg-silver-lighter mb-20 mt-10">';
    }
    if (tabid != 'tab1') {
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

function createaccordinpanel(tableid,accordid,groupid,title) {
    var panel = '<div class="panel panel-danger radius">';
    panel += '<div class="panel-header">';
    panel += '<h5 class="panel-title">';
    panel += '<a class="accordion-toggle accordion-toggle-styled collapsed" data-toggle="collapse" data-parent="#' + groupid + '" href="#' + accordid + '">';
    panel += '<i class="iconfont icon-my-shangxin f-l mr-10 ml-10"></i><i class="iconfont icon-tianjia f-r f-12"></i>' + title + '</a>';
    panel += '</h5>';
    panel += '</div>';
    panel += '<div id="' + accordid + '" class="panel-collapse collapse">';
    panel += '<div class="panel-body">';
    panel += '<table id="' + tableid + '" class="table table-border table-bordered table-bg table-striped display responsive nowrap"></table>';
    panel += '</div>';
    panel += '</div>';
    panel += '</div>';
    $(panel).appendTo('#' + groupid);
    $(function () {
        $('#' + accordid).collapse({
            toggle: false
        })
    });
}

$(document).ready(function () {
    var gmvid = $('#curvid').val();
    var mvtype = $('#curtype').val();

    //function fnCreateSearchModal() {
    //    var diag = '<div id="batchupdatemodal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="searchModalLabel" aria-hidden="true">' +
    //        '<div class="modal-dialog" style="z-index:1040"><div class="modal-content">' +
    //        '<div class="modal-header"><button class="close" data-dismiss="modal" aria-hidden="true" href="javascript:void();">×</button>' +
    //        '<h4 class="modal-title">全量更新<span class="f-12 c-warning">--所有需入库存货更新批次等信息</span></h4></div>' +
    //        '<div class="modal-body form-horizontal">';
    //    diag += '<div class="row row-form"><label class="form-label col-xs-4 col-sm-3">生产日期</label><div class="col-xs-8 col-sm-9">';
    //    diag += '<input type="text" class="input-text" id="dtp-madedate" />';
    //    diag += '</div></div>';
    //    diag += '</div><div class="modal-footer">';
    //    diag += '<div class="modal-footer_error c-danger"></div>';
    //    diag += '<div class="modal-footer_button"><button class="btn btn-primary radius" id="batchupdateBtn">更新</button></div>';
    //    diag += '</div></div></div></div>';
    //    $('body').append(diag);

    //    $("#dtp-madedate").datetimepicker({
    //        format: "yyyy-mm-dd",
    //        minView: "month",
    //        todayHighlight: true,
    //        autoclose: true
    //    })
    //    $("#dtp-madedate").val(moment().format('YYYY-MM-DD'));

    //    $("#batchupdateBtn").bind("click", function () {
    //        if ($('#dtp-madedate').val() == '') {
    //            $('div.modal-footer_error').html('请输入生产日期');
    //            return false;
    //        }
    //        var dtmadedate = $('#dtp-madedate').val();
    //        $('#batchupdatemodal').modal('hide');
    //        panelLoading($('#tab3'));
    //        var allvouchs = wizsteps.tab3.vouchstable.ajax.json().data;
    //        var reqmvsdata = {
    //            action: "edit",
    //            data: {}
    //        };
    //        $.each(allvouchs, function (k, v) {
    //            var rowid = v.DT_RowId.replace('row_', '');
    //            var datatmp = {
    //                Vouchs: {
    //                    MadeDate: dtmadedate,
    //                    Batch:dtmadedate.replace(/-/g, '')
    //                }
    //            };
    //            if (v.InvSale.Price != '' || v.InvSale.Price != null) {
    //                datatmp.Vouchs.Price = v.InvSale.Price;
    //            }

    //            var invopts = wizsteps.tab3.vouchstable.ajax.json().options['Vouchs.InvId'];
    //            for (var i = 0; i < invopts.length; i++) {
    //                if (invopts[i].value == v.Vouchs.InvId) {
    //                    if (invopts[i].label.IsShelfLife == true) {
    //                        var newday = new Date(dtmadedate);
    //                        switch (invopts[i].label.ShelfLifeType) {
    //                            case 0:
    //                                newday.setDate(newday.getDate() + invopts[i].label.ShelfLife);
    //                                break;
    //                            case 1:
    //                                newday.setDate(newday.getDate() + invopts[i].label.ShelfLife * 7);
    //                                break;
    //                            case 2:
    //                                newday.setMonth(newday.getMonth() + invopts[i].label.ShelfLife);
    //                                break;
    //                            case 3:
    //                                newday.setYear(newday.getFullYear() + invopts[i].label.ShelfLife);
    //                                break;
    //                        }
    //                        var strnewday = newday.getFullYear();
    //                        if ((newday.getMonth() + 1) < 10) {
    //                            strnewday += '-0' + (newday.getMonth() + 1);
    //                        } else {
    //                            strnewday += '-' + (newday.getMonth() + 1);
    //                        }
    //                        if (newday.getDate() < 10) {
    //                            strnewday += '-0' + newday.getDate();
    //                        } else {
    //                            strnewday += '-' + newday.getDate();
    //                        }
    //                        datatmp.Vouchs.InvalidDate = strnewday;
    //                    }
    //                    break;
    //                }
    //            }
    //            reqmvsdata.data[rowid] = datatmp;
    //        })

    //        $.ajax({
    //            method: "POST",
    //            url: "/api/Editor/Data?model=Vouchs",
    //            data: reqmvsdata,
    //            dataType: "json",
    //            success: function (jsonbatch) {
    //                panelLoaded($('#tab3'));
    //                wizsteps.tab3.vouchstable.columns.adjust().draw();
    //            },
    //            error: function (jsonbatch) {
    //                panelLoaded($('#tab3'));
    //                var errobj = eval("(" + jsonbatch.responseText + ")");
    //                var errinfo = '';
    //                if (errobj.exceptionMessage) {
    //                    errinfo = errobj.exceptionMessage;
    //                } else {
    //                    errinfo = jsonbatch.responseText;
    //                }
    //                addUIAlter('nav.breadcrumb', errinfo, 'error');
    //                return false;
    //            }
    //        })
    //    });
    //}

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

    function updatemvsmakeup(mvupid, reqdata1, objtarget, mode, reqdata2,reqdata3) {
        if (mode == 1) {
            $.ajax({
                url: "/api/Editor/Data?model=Vouchs",
                dataType: 'json',
                method: 'POST',
                data: reqdata1,
                success: function (jsonmvs) {
                    if (jsonmvs.fieldErrors && jsonmvs.fieldErrors.length > 0) {
                        $.each(jsonmvs.fieldErrors, function (key, val) {
                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                        });
                        panelLoaded(objtarget);
                        return false;
                    } else if (jsonmvs.error) {
                        addUIAlter('nav.breadcrumb', jsonmvs.error, 'error');
                        panelLoaded(objtarget);
                        return false;
                    }
                    panelLoaded(objtarget);
                    document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                },
                error: function (jsonmvs) {
                    panelLoaded(objtarget);
                    var errobj = eval("(" + jsonmvs.responseText + ")");
                    var errinfo = '';
                    if (errobj.exceptionMessage) {
                        errinfo = errobj.exceptionMessage;
                    } else {
                        errinfo = jsonmvs.responseText;
                    }
                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                    return false;
                }
            });
        } else if (mode == 2) {
            $.ajax({
                url: "/api/Editor/Data?model=Vouchs",
                dataType: 'json',
                method: 'POST',
                data: reqdata1,
                success: function (jsonmvs) {
                    if (jsonmvs.fieldErrors && jsonmvs.fieldErrors.length > 0) {
                        $.each(jsonmvs.fieldErrors, function (key, val) {
                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                        });
                        panelLoaded(objtarget);
                        return false;
                    } else if (jsonmvs.error) {
                        addUIAlter('nav.breadcrumb', jsonmvs.error, 'error');
                        panelLoaded(objtarget);
                        return false;
                    }
                    $.ajax({
                        url: "/api/Editor/Data?model=Vouchs",
                        dataType: 'json',
                        method: 'POST',
                        data: reqdata2,
                        success: function (jsonmvs2) {
                            if (jsonmvs2.fieldErrors && jsonmvs2.fieldErrors.length > 0) {
                                $.each(jsonmvs2.fieldErrors, function (key, val) {
                                    addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                });
                                panelLoaded(objtarget);
                                return false;
                            } else if (jsonmvs2.error) {
                                addUIAlter('nav.breadcrumb', jsonmvs2.error, 'error');
                                panelLoaded(objtarget);
                                return false;
                            }
                            panelLoaded(objtarget);
                            document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                        },
                        error: function (jsonmvs2) {
                            panelLoaded(objtarget);
                            var errobj = eval("(" + jsonmvs2.responseText + ")");
                            var errinfo = '';
                            if (errobj.exceptionMessage) {
                                errinfo = errobj.exceptionMessage;
                            } else {
                                errinfo = jsonmvs2.responseText;
                            }
                            addUIAlter('nav.breadcrumb', errinfo, 'error');
                            return false;
                        }
                    });
                },
                error: function (jsonmvs) {
                    panelLoaded(objtarget);
                    var errobj = eval("(" + jsonmvs.responseText + ")");
                    var errinfo = '';
                    if (errobj.exceptionMessage) {
                        errinfo = errobj.exceptionMessage;
                    } else {
                        errinfo = jsonmvs.responseText;
                    }
                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                    return false;
                }
            });
        } else if (mode == 3) {
            $.ajax({
                url: "/api/Editor/Data?model=Vouchs",
                dataType: 'json',
                method: 'POST',
                data: reqdata1,
                success: function (jsonmvs) {
                    if (jsonmvs.fieldErrors && jsonmvs.fieldErrors.length > 0) {
                        $.each(jsonmvs.fieldErrors, function (key, val) {
                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                        });
                        panelLoaded(objtarget);
                        return false;
                    } else if (jsonmvs.error) {
                        addUIAlter('nav.breadcrumb', jsonmvs.error, 'error');
                        panelLoaded(objtarget);
                        return false;
                    }
                    $.ajax({
                        url: "/api/Editor/Data?model=Vouchs",
                        dataType: 'json',
                        method: 'POST',
                        data: reqdata2,
                        success: function (jsonmvs2) {
                            if (jsonmvs2.fieldErrors && jsonmvs2.fieldErrors.length > 0) {
                                $.each(jsonmvs2.fieldErrors, function (key, val) {
                                    addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                });
                                panelLoaded(objtarget);
                                return false;
                            } else if (jsonmvs2.error) {
                                addUIAlter('nav.breadcrumb', jsonmvs2.error, 'error');
                                panelLoaded(objtarget);
                                return false;
                            }
                            $.ajax({
                                url: "/api/Editor/Data?model=Vouchs",
                                dataType: 'json',
                                method: 'POST',
                                data: reqdata3,
                                success: function (jsonmvs2) {
                                    if (jsonmvs2.fieldErrors && jsonmvs2.fieldErrors.length > 0) {
                                        $.each(jsonmvs2.fieldErrors, function (key, val) {
                                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                        });
                                        panelLoaded(objtarget);
                                        return false;
                                    } else if (jsonmvs2.error) {
                                        addUIAlter('nav.breadcrumb', jsonmvs2.error, 'error');
                                        panelLoaded(objtarget);
                                        return false;
                                    }
                                    panelLoaded(objtarget);
                                    document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                                },
                                error: function (jsonmvs2) {
                                    panelLoaded(objtarget);
                                    var errobj = eval("(" + jsonmvs2.responseText + ")");
                                    var errinfo = '';
                                    if (errobj.exceptionMessage) {
                                        errinfo = errobj.exceptionMessage;
                                    } else {
                                        errinfo = jsonmvs2.responseText;
                                    }
                                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                                    return false;
                                }
                            });
                        },
                        error: function (jsonmvs2) {
                            panelLoaded(objtarget);
                            var errobj = eval("(" + jsonmvs2.responseText + ")");
                            var errinfo = '';
                            if (errobj.exceptionMessage) {
                                errinfo = errobj.exceptionMessage;
                            } else {
                                errinfo = jsonmvs2.responseText;
                            }
                            addUIAlter('nav.breadcrumb', errinfo, 'error');
                            return false;
                        }
                    });
                },
                error: function (jsonmvs) {
                    panelLoaded(objtarget);
                    var errobj = eval("(" + jsonmvs.responseText + ")");
                    var errinfo = '';
                    if (errobj.exceptionMessage) {
                        errinfo = errobj.exceptionMessage;
                    } else {
                        errinfo = jsonmvs.responseText;
                    }
                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                    return false;
                }
            });
        }
    }

    function updatevouchlink(mvupid, reqdata1, objtarget, mode, reqdata2, updatemvsdata, removemvsdata, createmvsdata) {
        if (mode == 1) {
            $.ajax({
                url: "/api/Editor/Data?model=VouchLink",
                dataType: 'json',
                method: 'POST',
                data: reqdata1,
                success: function (jsonlink) {
                    if (jsonlink.fieldErrors && jsonlink.fieldErrors.length > 0) {
                        $.each(jsonlink.fieldErrors, function (key, val) {
                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                        });
                        panelLoaded(objtarget);
                        return false;
                    } else if (jsonlink.error) {
                        addUIAlter('nav.breadcrumb', jsonlink.error, 'error');
                        panelLoaded(objtarget);
                        return false;
                    }
                    if (updatemvsdata == null && removemvsdata == null && createmvsdata == null) {
                        panelLoaded(objtarget);
                        document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                    } else {
                        if (updatemvsdata.data != null && removemvsdata.data != null && createmvsdata.data.length > 0) {
                            updatemvsmakeup(mvupid, updatemvsdata, objtarget, 3, removemvsdata, createmvsdata);
                        } else if (updatemvsdata.data != null && removemvsdata.data != null && createmvsdata.data.length == 0) {
                            updatemvsmakeup(mvupid, updatemvsdata, objtarget, 2, removemvsdata, null);
                        } else if (updatemvsdata.data != null && removemvsdata.data == null && createmvsdata.data.length > 0) {
                            updatemvsmakeup(mvupid, updatemvsdata, objtarget, 2, createmvsdata, null);
                        } else if (updatemvsdata.data == null && removemvsdata.data != null && createmvsdata.data.length > 0) {
                            updatemvsmakeup(mvupid, removemvsdata, objtarget, 2, createmvsdata, null);
                        } else if (updatemvsdata.data != null && removemvsdata.data == null && createmvsdata.data.length == 0) {
                            updatemvsmakeup(mvupid, updatemvsdata, objtarget, 1, null, null);
                        } else if (updatemvsdata.data == null && removemvsdata.data != null && createmvsdata.data.length == 0) {
                            updatemvsmakeup(mvupid, removemvsdata, objtarget, 1, null, null);
                        } else if (updatemvsdata.data == null && removemvsdata.data == null && createmvsdata.data.length > 0) {
                            updatemvsmakeup(mvupid, createmvsdata, objtarget, 1, null, null);
                        } else {
                            panelLoaded(objtarget);
                            document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                        }
                    }
                },
                error: function (jsonlink) {
                    panelLoaded(objtarget);
                    var errobj = eval("(" + jsonlink.responseText + ")");
                    var errinfo = '';
                    if (errobj.exceptionMessage) {
                        errinfo = errobj.exceptionMessage;
                    } else {
                        errinfo = jsonlink.responseText;
                    }
                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                    return false;
                }
            });
        } else if(mode == 2){
            $.ajax({
                url: "/api/Editor/Data?model=VouchLink",
                dataType: 'json',
                method: 'POST',
                data: reqdata1,
                success: function (jsonlink) {
                    if (jsonlink.fieldErrors && jsonlink.fieldErrors.length > 0) {
                        $.each(jsonlink.fieldErrors, function (key, val) {
                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                        });
                        panelLoaded(objtarget);
                        return false;
                    } else if (jsonlink.error) {
                        addUIAlter('nav.breadcrumb', jsonlink.error, 'error');
                        panelLoaded(objtarget);
                        return false;
                    }
                    $.ajax({
                        url: "/api/Editor/Data?model=VouchLink",
                        dataType: 'json',
                        method: 'POST',
                        data: reqdata2,
                        success: function (jsonlink2) {
                            if (jsonlink2.fieldErrors && jsonlink2.fieldErrors.length > 0) {
                                $.each(jsonlink2.fieldErrors, function (key, val) {
                                    addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                });
                                panelLoaded(objtarget);
                                return false;
                            } else if (jsonlink2.error) {
                                addUIAlter('nav.breadcrumb', jsonlink2.error, 'error');
                                panelLoaded(objtarget);
                                return false;
                            }
                            if (updatemvsdata == null && removemvsdata == null && createmvsdata == null) {
                                panelLoaded(objtarget);
                                document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                            } else {
                                if (updatemvsdata.data != null && removemvsdata.data != null && createmvsdata.data.length > 0) {
                                    updatemvsmakeup(mvupid, updatemvsdata, objtarget, 3, removemvsdata, createmvsdata);
                                } else if (updatemvsdata.data != null && removemvsdata.data != null && createmvsdata.data.length == 0) {
                                    updatemvsmakeup(mvupid, updatemvsdata, objtarget, 2, removemvsdata, null);
                                } else if (updatemvsdata.data != null && removemvsdata.data == null && createmvsdata.data.length > 0) {
                                    updatemvsmakeup(mvupid, updatemvsdata, objtarget, 2, createmvsdata, null);
                                } else if (updatemvsdata.data == null && removemvsdata.data != null && createmvsdata.data.length > 0) {
                                    updatemvsmakeup(mvupid, removemvsdata, objtarget, 2, createmvsdata, null);
                                } else if (updatemvsdata.data != null && removemvsdata.data == null && createmvsdata.data.length == 0) {
                                    updatemvsmakeup(mvupid, updatemvsdata, objtarget, 1, null, null);
                                } else if (updatemvsdata.data == null && removemvsdata.data != null && createmvsdata.data.length == 0) {
                                    updatemvsmakeup(mvupid, removemvsdata, objtarget, 1, null, null);
                                } else if (updatemvsdata.data == null && removemvsdata.data == null && createmvsdata.data.length > 0) {
                                    updatemvsmakeup(mvupid, createmvsdata, objtarget, 1, null, null);
                                } else {
                                    panelLoaded(objtarget);
                                    document.location = "/StockMg/MixVouchMakeUp?id=" + mvupid + "&type=014";
                                }
                            }
                        },
                        error: function (jsonlink2) {
                            panelLoaded(objtarget);
                            var errobj = eval("(" + jsonlink2.responseText + ")");
                            var errinfo = '';
                            if (errobj.exceptionMessage) {
                                errinfo = errobj.exceptionMessage;
                            } else {
                                errinfo = jsonlink2.responseText;
                            }
                            addUIAlter('nav.breadcrumb', errinfo, 'error');
                            return false;
                        }
                    });
                },
                error: function (jsonlink) {
                    panelLoaded(objtarget);
                    var errobj = eval("(" + jsonlink.responseText + ")");
                    var errinfo = '';
                    if (errobj.exceptionMessage) {
                        errinfo = errobj.exceptionMessage;
                    } else {
                        errinfo = jsonlink.responseText;
                    }
                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                    return false;
                }
            });
        }
    }

    function createMixVouchTable(tabconf, mvlistdata,mvsdata,vouchlinklist) {
        var tableid = tabconf.Id + 'mixlisttable';
        var editortable = getevouchstable(tableid);
        $('#' + tabconf.Id).append(editortable);
        var head = $('<thead><tr></tr></thead>');
        head.children('tr').append('<th></th>');
        head.children('tr').append('<th></th>');
        head.children('tr').append('<th>叫货单号</th>');
        head.children('tr').append('<th>叫货仓库</th>');
        head.children('tr').append('<th>制单时间</th>');
        head.children('tr').append('<th>制单人</th>');
        head.children('tr').append('<th>调拨单审核</th>');
        head.children('tr').append('<th>流程状态</th>');
        $('#' + tableid).append(head);

        tabconf.mixlisttable = $('#' + tableid)
            .DataTable({
                dom: "<'row'<'custgroup col-sm-12'>>" + "<'row'<'col-sm-12'rt>>",
                autoWidth: false,
                data: mvlistdata,
                columns: [
                    { data: 'space' },
                    { data: 'check' },
                    { data: 'Code' },
                    { data: "InWarehouse" },
                    { data: "MakeDate" },
                    { data: "Maker" },
                    { data: "TransIsVerify" },
                    { data: "Status" }
                ],
                columnDefs: [
                    {
                        orderable: false,
                        className: 'table-space',
                        targets: 0
                    },{
                        orderable: false,
                        className: 'select-checkbox',
                        targets: 1
                    },
                    { targets: [6], visible: false }
                ],
                select: {
                    style: 'multi',
                    selector: 'td:nth-child(2)'
                },
                order:[['2','asc']],
                pageLength: -1,
                drawCallback: function () {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    api.rows({ page: 'current' }).indexes().each(function (k, v) {
                        var rowdata = api.row(rows[k]).data();
                        if (rowdata.TransIsVerify == true) {
                            $(rows[k]).find('td.select-checkbox').removeClass('select-checkbox');
                        }
                    });
                },
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
                        "print": "打印",
                        "selectAll": "全选",
                        "selectNone": "全不选",
                    }
                }
            });

        $.each(vouchlinklist,function(k,v){
            tabconf.mixlisttable.row('tr#'+v.Id).select();
        })

        tabconf.mixlisttable.on('deselect', function (e, dt, type, indexes) {
            if (type === 'row') {
                var data = tabconf.mixlisttable.rows(indexes).data()[0];
                if (data.TransIsVerify == true) {
                    tabconf.mixlisttable.rows(indexes).select();
                }
            }
        });


        //tabconf.mixlisttable
        //    .on('select', function (e, dt, type, indexes) {
        //        //tabconf.sumtable.clear();
        //        var rowData = tabconf.mixlisttable.rows({ selected: true }).data().toArray();
        //        var newdata = [];
        //        $.each(rowData, function (k, v) {
        //            $.each(mvsdata, function (ks,vs) {
        //                if (v.DT_RowId == vs.VouchId) {
        //                    var flag = false;
        //                    $.each(newdata, function (kk, vv) {
        //                        if (vs.InvId == vv.InvId) {
        //                            flag = true;
        //                            newdata[kk].Num = newdata[kk].Num + vs.Num;
        //                            return false;
        //                        }
        //                    })
        //                    if (!flag) {
        //                        var item = {
        //                            DT_RowId: 'suminv_' + vs.InvId,
        //                            InvId: vs.InvId,
        //                            Name: vs.Name,
        //                            Specs: vs.Specs,
        //                            UOM: vs.UOM,
        //                            Num: vs.Num
        //                        }
        //                        newdata.push(item);
        //                    }
        //                }
        //            })
        //        })
        //        //tabconf.sumtable.rows.add(newdata).draw();
        //    })
        //    .on('deselect', function (e, dt, type, indexes) {
        //        //tabconf.sumtable.clear();
        //        var rowData = tabconf.mixlisttable.rows({ selected: true }).data().toArray();
        //        var newdata = [];
        //        $.each(rowData, function (k, v) {
        //            $.each(mvsdata, function (ks, vs) {
        //                if (v.DT_RowId == vs.VouchId) {
        //                    var flag = false;
        //                    $.each(newdata, function (kk, vv) {
        //                        if (vs.InvId == vv.InvId) {
        //                            flag = true;
        //                            newdata[kk].Num = newdata[kk].Num + vs.Num;
        //                            return false;
        //                        }
        //                    })
        //                    if (!flag) {
        //                        var item = {
        //                            DT_RowId: 'suminv_' + vs.InvId,
        //                            InvId: vs.InvId,
        //                            Name: vs.Name,
        //                            Specs: vs.Specs,
        //                            UOM: vs.UOM,
        //                            Num: vs.Num
        //                        }
        //                        newdata.push(item);
        //                    }
        //                }
        //            })
        //        })
        //        //tabconf.sumtable.rows.add(newdata).draw();
        //    });

        if (tabconf.Id == 'tab1') {
            var custgroup = $('<div class="dt-buttons btn-group"></div>');
            if ($('#curvid').val() == '0') {
                var createbtn = $('<a href="javascript:;" class="btn btn-primary radius size-S">创建生产计划单</a>');
                createbtn.on('click', function (e) {
                    var objtarget = e.currentTarget;
                    panelLoading(objtarget);
                    var rowData = tabconf.mixlisttable.rows({ selected: true }).data().toArray();
                    var strmvids = "";
                    $.each(rowData, function (k, v) {
                        strmvids += v.DT_RowId + ',';
                    })
                    if (strmvids == '') {
                        addUIAlter('nav.breadcrumb', '请选择关联叫货单', 'error');
                        panelLoaded(objtarget);
                        return false;
                    }
                    strmvids = "'" + strmvids.substr(0, strmvids.length - 1) + "'";
                    var reqmvdata = {
                        action: "create",
                        data: [{
                            Vouch: {
                                VouchType: "014",
                                VouchDate: moment().format('YYYY-MM-DD'),
                                ToWhId: $('#gparamuserwhid').val(),
                                Memo: strmvids
                            }
                        }]
                    };

                    var reqmvsdata = {
                        action: "create",
                        data: []
                    };
                    var newdata = [];
                    $.each(rowData, function (k, v) {
                        $.each(mvsdata, function (ks,vs) {
                            if (v.DT_RowId == vs.VouchId) {
                                var flag = false;
                                $.each(newdata, function (kk, vv) {
                                    if (vs.InvId == vv.InvId) {
                                        flag = true;
                                        newdata[kk].Num = newdata[kk].Num + vs.Num;
                                        return false;
                                    }
                                })
                                if (!flag) {
                                    var item = {
                                        InvId: vs.InvId,
                                        Num: vs.Num
                                    }
                                    newdata.push(item);
                                }
                            }
                        })
                    })
                    $.each(newdata, function (k, v) {
                        reqmvsdata.data.push({
                            Vouchs: {
                                InvId: v.InvId,
                                Num: v.Num
                            }
                        })
                    })

                    $.ajax({
                        url: "/api/Editor/Data?model=Vouch&VouchType=014",
                        dataType: 'json',
                        method: 'POST',
                        data: reqmvdata,
                        success: function (jsonmv) {
                            if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                                $.each(jsonmv.fieldErrors, function (key, val) {
                                    addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                });
                                panelLoaded(objtarget);
                                return false;
                            } else if (jsonmv.error) {
                                addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                                panelLoaded(objtarget);
                                return false;
                            }
                            var newvouchid = jsonmv.data[0].DT_RowId.replace('row_', '');
                            $.each(reqmvsdata.data, function (kk, vv) {
                                reqmvsdata.data[kk].Vouchs.VouchId = newvouchid;
                            })
                            $.ajax({
                                url: "/api/Editor/Data?model=Vouchs",
                                dataType: 'json',
                                method: 'POST',
                                data: reqmvsdata,
                                success: function (jsonmvs) {
                                    if (jsonmvs.fieldErrors && jsonmvs.fieldErrors.length > 0) {
                                        $.each(jsonmvs.fieldErrors, function (key, val) {
                                            addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                        });
                                        panelLoaded(objtarget);
                                        return false;
                                    } else if (jsonmvs.error) {
                                        addUIAlter('nav.breadcrumb', jsonmvs.error, 'error');
                                        panelLoaded(objtarget);
                                        return false;
                                    }
                                    panelLoaded(objtarget);
                                    document.location = "/StockMg/MixVouchMakeUp?id=" + newvouchid + "&type=014";
                                },
                                error: function (jsonmvs) {
                                    panelLoaded(objtarget);
                                    var errobj = eval("(" + jsonmvs.responseText + ")");
                                    var errinfo = '';
                                    if (errobj.exceptionMessage) {
                                        errinfo = errobj.exceptionMessage;
                                    } else {
                                        errinfo = jsonmvs.responseText;
                                    }
                                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                                    return false;
                                }
                            });
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
                custgroup.append(createbtn);
            } else {
                $('#tab1 .dataTables_wrapper').before('<blockquote>操作说明：'+
                    '<small class="c-red">"更新关联"：只更新生产计划单与叫货单关联性，生产计划单下单数量不变</small>' +
                    '<small class="c-red">"更新数量"：更新生产计划单与叫货单关联性，同时更新生产计划单下单数量，必须在生产计划单审核之前才能操作</small>' +
                    '</blockquote>');
                var updatelinkbtn = $('<a href="javascript:;" class="btn btn-primary radius size-S">更新关联</a>');
                updatelinkbtn.on('click', function (e) {
                    var objtarget = e.currentTarget;
                    var rowData = tabconf.mixlisttable.rows({ selected: true }).data().toArray();
                    if (rowData.length==0) {
                        addUIAlter('nav.breadcrumb', '操作错误：生产计划单至少要关联一个叫货单', 'error');
                        return false;
                    }
                    var addlinkdata = {
                        action: 'create',
                        data: []
                    }
                    var removelinkdata = {
                        action: 'remove',
                        data: null
                    }
                    var vouchsourceid=$('#curvid').val();
                    $.each(rowData, function (k, v) {
                        var flag=false;
                        $.each(orgvouchlinkdata, function (kk, vv) {
                            if (v.DT_RowId == vv.VouchLink.Id) {
                                flag = true;
                                return false;
                            }
                        })
                        if (!flag) {
                            addlinkdata.data.push({
                                VouchLink: {
                                    Id: v.DT_RowId,
                                    SourceId:vouchsourceid
                                }
                            })
                        }
                    })
                    $.each(orgvouchlinkdata, function (k, v) {
                        var flag = false;
                        $.each(rowData, function (kk, vv) {
                            if (vv.DT_RowId == v.VouchLink.Id) {
                                flag = true;
                                return false;
                            }
                        })
                        if (!flag) {
                            if (removelinkdata.data == null) {
                                removelinkdata.data = {};
                            }
                            removelinkdata.data[v.DT_RowId] = {
                                VouchLink: {
                                    Id: v.VouchLink.Id,
                                    SourceId: vouchsourceid
                                }
                            }
                        }
                    })
                    if (addlinkdata.data.length > 0 && removelinkdata.data != null) {
                        panelLoading(objtarget);
                        updatevouchlink(vouchsourceid, addlinkdata, objtarget, 2, removelinkdata,null,null,null);
                    } else if (addlinkdata.data.length > 0 && removelinkdata.data == null) {
                        panelLoading(objtarget);
                        updatevouchlink(vouchsourceid, addlinkdata, objtarget, 1, null, null, null, null);
                    } else if (addlinkdata.data.length ==0 && removelinkdata.data != null) {
                        panelLoading(objtarget);
                        updatevouchlink(vouchsourceid, removelinkdata, objtarget, 1, null, null, null, null);
                    } else {
                        addUIAlter('nav.breadcrumb', '没有任何变动，不需要更新关联', 'error');
                    }
                })
                custgroup.append(updatelinkbtn);
                if ($('#tab2').find('#isverify') != undefined && $('#tab2').find('#isverify').val()=='false') {
                    var updatenumbtn = $('<a href="javascript:;" class="btn btn-primary radius size-S">更新数量</a>');
                    updatenumbtn.on('click', function (e) {
                        var objtarget = e.currentTarget;
                        var rowData = tabconf.mixlisttable.rows({ selected: true }).data().toArray();
                        if (rowData.length == 0) {
                            addUIAlter('nav.breadcrumb', '操作错误：生产计划单至少要关联一个叫货单', 'error');
                            return false;
                        }
                        var addlinkdata = {
                            action: 'create',
                            data: []
                        }
                        var removelinkdata = {
                            action: 'remove',
                            data: null
                        }
                        var vouchsourceid = $('#curvid').val();
                        $.each(rowData, function (k, v) {
                            var flag = false;
                            $.each(orgvouchlinkdata, function (kk, vv) {
                                if (v.DT_RowId == vv.VouchLink.Id) {
                                    flag = true;
                                    return false;
                                }
                            })
                            if (!flag) {
                                addlinkdata.data.push({
                                    VouchLink: {
                                        Id: v.DT_RowId,
                                        SourceId: vouchsourceid
                                    }
                                })
                            }
                        })
                        $.each(orgvouchlinkdata, function (k, v) {
                            var flag = false;
                            $.each(rowData, function (kk, vv) {
                                if (vv.DT_RowId == v.VouchLink.Id) {
                                    flag = true;
                                    return false;
                                }
                            })
                            if (!flag) {
                                if (removelinkdata.data == null) {
                                    removelinkdata.data = {};
                                }
                                removelinkdata.data[v.DT_RowId] = {
                                    VouchLink: {
                                        Id: v.VouchLink.Id,
                                        SourceId: vouchsourceid
                                    }
                                }
                            }
                        })

                        //最新数量
                        var updatevouhsdata = {
                            action: "edit",
                            data: null
                        }
                        var removevouhsdata = {
                            action: "remove",
                            data: null
                        }
                        var createvouhsdata = {
                            action: "create",
                            data: []
                        }

                        var mixmakeupvouchs = wizsteps.tab2.vouchstable.data().toArray();
                        var newsumdata = [];
                        $.each(rowData, function (k,v) {
                            $.each(mvsdata, function (ks,vs) {
                                if (v.DT_RowId == vs.VouchId) {
                                    var flag = false;
                                    $.each(newsumdata, function (kk, vv) {
                                        if (vs.InvId == vv.InvId) {
                                            flag = true;
                                            newsumdata[kk].Num = newsumdata[kk].Num + vs.Num;
                                            return false;
                                        }
                                    })
                                    if (!flag) {
                                        var item = {
                                            InvId: vs.InvId,
                                            Num: vs.Num
                                        }
                                        newsumdata.push(item);
                                    }
                                }
                            })
                        })
                        $.each(mixmakeupvouchs, function (k, v) {
                            var flag = false;
                            $.each(newsumdata, function (kk, vv) {
                                if (v.Vouchs.InvId == vv.InvId) {
                                    if (updatevouhsdata.data == null) {
                                        updatevouhsdata.data = {};
                                    }
                                    updatevouhsdata.data[v.DT_RowId] = {
                                        Vouchs: {
                                            Num: vv.Num
                                        }
                                    }
                                    flag = true;
                                    return false;
                                }
                            })
                            if (!flag) {
                                if (removevouhsdata.data == null) {
                                    removevouhsdata.data = {};
                                }
                                removevouhsdata.data[v.DT_RowId] = {
                                    Vouchs: {
                                        InvId: v.Vouchs.InvId
                                    }
                                }
                            }
                        })
                        $.each(newsumdata, function (k, v) {
                            var flag = false;
                            $.each(mixmakeupvouchs, function (kk, vv) {
                                if (v.InvId == vv.Vouchs.InvId) {
                                    flag = true;
                                    return false;
                                }
                            })
                            if (!flag) {
                                createvouhsdata.data.push({
                                    Vouchs: {
                                        InvId: v.InvId,
                                        Num: v.Num,
                                        VouchId: vouchsourceid
                                    }
                                });
                            }
                        })

                        if (addlinkdata.data.length > 0 && removelinkdata.data != null) {
                            panelLoading(objtarget);
                            updatevouchlink(vouchsourceid, addlinkdata, objtarget, 2, removelinkdata,updatevouhsdata,removevouhsdata,createvouhsdata);
                        } else if (addlinkdata.data.length > 0 && removelinkdata.data == null) {
                            panelLoading(objtarget);
                            updatevouchlink(vouchsourceid, addlinkdata, objtarget, 1, null, updatevouhsdata, removevouhsdata,createvouhsdata);
                        } else if (addlinkdata.data.length == 0 && removelinkdata.data != null) {
                            panelLoading(objtarget);
                            updatevouchlink(vouchsourceid, removelinkdata, objtarget, 1, null, updatevouhsdata, removevouhsdata,createvouhsdata);
                        } else {
                            if (updatevouhsdata.data != null && removevouhsdata.data != null && createvouhsdata.data.length > 0) {
                                updatemvsmakeup(vouchsourceid, updatevouhsdata, objtarget, 3, removevouhsdata, createvouhsdata);
                            } else if (updatevouhsdata.data != null && removevouhsdata.data != null && createvouhsdata.data.length == 0) {
                                updatemvsmakeup(vouchsourceid, updatevouhsdata, objtarget, 2, removevouhsdata, null);
                            } else if (updatevouhsdata.data != null && removevouhsdata.data == null && createvouhsdata.data.length > 0) {
                                updatemvsmakeup(vouchsourceid, updatevouhsdata, objtarget, 2, createvouhsdata, null);
                            } else if (updatevouhsdata.data == null && removevouhsdata.data != null && createvouhsdata.data.length > 0) {
                                updatemvsmakeup(vouchsourceid, removevouhsdata, objtarget, 2, createvouhsdata, null);
                            } else if (updatevouhsdata.data != null && removevouhsdata.data == null && createvouhsdata.data.length == 0) {
                                updatemvsmakeup(vouchsourceid, updatevouhsdata, objtarget, 1, null, null);
                            } else if (updatevouhsdata.data == null && removevouhsdata.data != null && createvouhsdata.data.length == 0) {
                                updatemvsmakeup(vouchsourceid, removevouhsdata, objtarget, 1, null, null);
                            } else if (updatevouhsdata.data == null && removevouhsdata.data == null && createvouhsdata.data.length > 0) {
                                updatemvsmakeup(vouchsourceid, createvouhsdata, objtarget, 1, null, null);
                            } else {
                                addUIAlter('nav.breadcrumb', '没有任何变动，不需要更新关联和数量', 'error');
                            }
                        }
                    })
                    custgroup.append(updatenumbtn);
                }
            }
            $('#tab1').find('div.custgroup').append(custgroup);
        }
    }

    function createMvsTable(tabconf, json, formid, tableid) {
        var mvid = '0';
        if (json.data !== undefined && json.data.length > 0) {
            mvid = json.data[0].DT_RowId.replace('row_', '');
            isveritytmp = json.data[0].Vouch.IsVerify;
            if (tabconf.Id=='tab2' && json.data[0].Vouch.IsVerify == false) {
                tabconf.vouchsfields.push({
                    label: "操作",
                    data: null,
                    istable: true,
                    className: "center",
                    defaultContent: '<div class="btn-group"><a class="btn btn-warning radius size-MINI editor_edit"><span>编辑</span></a><a class="btn btn-warning radius size-MINI editor_remove"><span>删除</span></a></div>'
                })
            }
            if (tabconf.Id == 'tab5' && json.data[0].Vouch.IsVerify == false) {
                tabconf.vouchsfields.push({
                    label: "操作",
                    data: null,
                    istable: true,
                    className: "center",
                    defaultContent: '<div class="btn-group"><a class="btn btn-warning radius size-MINI tab5editor_edit"><span>编辑</span></a><a class="btn btn-warning radius size-MINI tab5editor_remove"><span>删除</span></a></div>'
                })
            }
        }

        var head = $('<thead><tr></tr></thead>');
        var isveritytmp = false;
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
                    if (vouchid == '0') {
                        var reqmvdata = {
                            action: "create",
                            data: {}
                        };
                        var datatmp = {};
                        datatmp.Vouch = {
                            VouchType: tabconf.vchtype,
                            BusType: tabconf.bstype
                        };
                        $.each(tabconf.vouchfields, function (k, v) {
                            if (v.issubmit !== undefined && v.issubmit == true) {
                                var fieldsp = v.name.split('.');
                                if (datatmp[fieldsp[0]] === undefined) {
                                    datatmp[fieldsp[0]] = {}
                                }
                                datatmp[fieldsp[0]][fieldsp[1]] = $('#' + formid).find('#DTE_Field_' + v.name.replace('.', '-')).val();
                            }
                        })
                        reqmvdata.data[0] = datatmp;

                        $.ajax({
                            url: tabconf.vouchurl,
                            dataType: 'json',
                            method: 'POST',
                            data: reqmvdata,
                            success: function (jsonmv) {
                                if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                                    $.each(jsonmv.fieldErrors, function (key, val) {
                                        addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                    });
                                    tabconf.vouchseditor.close();
                                    return false;
                                } else if (jsonmv.error) {
                                    addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                                    tabconf.vouchseditor.close();
                                    return false;
                                }
                                var newvid = jsonmv.data[0].DT_RowId.replace('row_', '');
                                $('#' + formid).attr('data-id', newvid);
                                var reqmvsdata = {
                                    action: "create",
                                    data: {}
                                };
                                var datatmp = { Vouchs: { VouchId: newvid } };
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
                                    document.location = "/StockMg/MixVouchMakeUp?id=" + newvid + '&type=014&optab='+tabconf.Id;
                                })
                                .error(function (xhr, error, thrown) {
                                    errorCallback(xhr, error, thrown);
                                });
                            },
                            error: function (jsonmv) {
                                var errobj = eval("(" + jsonmv.responseText + ")");
                                var errinfo = '';
                                if (errobj.exceptionMessage) {
                                    errinfo = errobj.exceptionMessage;
                                } else {
                                    errinfo = jsonmv.responseText;
                                }
                                addUIAlter('nav.breadcrumb', errinfo, 'error');
                                tabconf.vouchseditor.close();
                                return false;
                            }
                        });
                    } else {
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

        if (tabconf.Id == 'tab5') {
            tabconf.vouchseditor.on('open', function (e, display, action) {
                if (action != 'remove') {
                    var inputtmp = tabconf.vouchseditor.field('Vouchs.InvId').input();
                    if (action == 'edit') {
                        $(inputtmp).attr('disabled', true);
                        var rowdata = tabconf.vouchstable.row({ selected: true }).data();
                        inputtmp = tabconf.vouchseditor.field('Vouchs.Price').input();
                        if (rowdata.InvSale.Price == '' || rowdata.InvSale.Price == null) {
                            $(inputtmp).attr('readonly', false);
                            $(inputtmp).removeClass('disabled');
                        } else {
                            tabconf.vouchseditor.field('Vouchs.Price').val(rowdata.InvSale.Price);
                            $(inputtmp).attr('readonly', true);
                            $(inputtmp).addClass('disabled');
                        }
                        editcurbatch = rowdata.Vouchs.Batch;
                    } else {
                        $(inputtmp).attr('disabled', false);
                        var madedate = moment().format('YYYY-MM-DD');
                        tabconf.vouchseditor.field('Vouchs.MadeDate').set(madedate);
                        tabconf.vouchseditor.field('Vouchs.Batch').val(madedate.replace(/-/g, ''));
                    }
                }
            })
        }

        if (tabconf.Id == 'tab2') {
            tabconf.vouchseditor.on('open', function (e, display, action) {
                if (action != 'remove') {
                    var inputtmp = tabconf.vouchseditor.field('Vouchs.InvId').input();
                    if (action == 'edit') {
                        $(inputtmp).attr('disabled', true);
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
                            if (v.name == 'Vouchs.MadeDate' || v.name == 'Vouchs.InvalidDate') {
                                var invidtmp = tabconf.vouchseditor.field('Vouchs.InvId').val();
                                var invopts = tabconf.vouchstable.ajax.json().options['Vouchs.InvId'];
                                $.each(invopts, function (k, v) {
                                    if (invidtmp == v.value && v.label.IsShelfLife==true) {
                                        field.error(v.errorinfo);
                                        iserror = true;
                                    }
                                })
                            }else{
                                field.error(v.errorinfo);
                                iserror = true;
                            }
                        }
                        if (v.name == 'Vouchs.Num') {
                            var outnum = parseInt(field.val());
                            if (outnum <= 0) {
                                field.error('请输入数量');
                                iserror = true;
                            } else if (tabconf.vouchseditor.field('CurStockNum') !== undefined) {
                                var outnum = parseInt(field.val());
                                var orgnum = parseInt(tabconf.vouchseditor.field('CurStockNum').val());
                                if (outnum > orgnum) {
                                    field.error('输入的数量不能大于当前库存数量');
                                    iserror = true;
                                }
                            }
                        }
                    }
                })

                if (!iserror) {
                    if (action == 'create' && tabconf.Id!='tab2') {
                        var existdata = tabconf.vouchstable.ajax.json().data;
                        var flag = false;
                        var batchtmp = tabconf.vouchseditor.field('Vouchs.Batch').input();
                        $.each(existdata, function (k, v) {
                            if (o.data[0].Vouchs.InvId == v.Vouchs.InvId && $(batchtmp).val() == v.Vouchs.Batch) {
                                flag = true;
                                return false;
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
                } else if (tabconf.Id != 'tab2') {
                    $.each(o.data, function (k, v) {
                        o.data[k].Vouchs.Batch = $(tabconf.vouchseditor.field('Vouchs.Batch').input()).val();
                    })
                }
            }
        })

        //tabconf.vouchseditor.on('initCreate', function (e, o, action) {
        //    var inputtmp = tabconf.vouchseditor.field('Vouchs.InvId').input();
        //    inputtmp.attr('disabled', false);
        //})

        var strdom = "<'row'<'col-sm-4'B><'col-sm-4'><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>";
        if (tabconf.Id == 'tab2' || tabconf.Id == 'tab3' || tabconf.Id == 'tab5') {
            if (isveritytmp) {
                strdom = "<'row'<'col-sm-4'><'col-sm-4'><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>";
            }
        }

        var strbuttons = [];
        if (tabconf.Id == "tab1") {
            strbuttons = [
                { extend: "create", editor: tabconf.vouchseditor },
                { extend: "edit", editor: tabconf.vouchseditor },
                { extend: "remove", editor: tabconf.vouchseditor }
            ]
        } else if (tabconf.Id == "tab3") {
            strbuttons = [
                { extend: "create", editor: tabconf.vouchseditor },
                { extend: "edit", editor: tabconf.vouchseditor },
                { extend: "remove", editor: tabconf.vouchseditor },
                {
                    extend: "customButton",
                    text: "全量更新",
                    action: function (e, dt, node, config) {
                        $('#batchupdatemodal').modal('show');
                    }
                }
            ]
        } else if (tabconf.Id == "tab5" || tabconf.Id == "tab2") {
            var backNext = [
                    {
                        label: "&lt;",
                        className: "btnprev",
                        fn: function (e) {
                            var indexes = tabconf.vouchstable.rows({ search: 'applied' }).indexes();
                            var currentIndex = tabconf.vouchstable.row({ selected: true }).index();
                            var currentPosition = indexes.indexOf(currentIndex);
                            var rowdata = tabconf.vouchstable.row({ selected: true }).data();
                            editcurbatch = rowdata.Vouchs.Batch;

                            if (currentPosition > 0) {
                                tabconf.vouchstable.row(currentIndex).deselect();
                                tabconf.vouchstable.row(indexes[currentPosition - 1]).select();
                            }
                            tabconf.vouchstable.button(1).trigger();
                        }
                    },
                    {
                        label: '修改',
                        fn: function (e) {
                            checkmvseditorindex = tabconf.vouchstable.row({ selected: true }).index();
                            var rowdata = tabconf.vouchstable.row({ selected: true }).data();
                            editcurbatch = rowdata.Vouchs.Batch;
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
                            var rowdata = tabconf.vouchstable.row({ selected: true }).data();
                            editcurbatch = rowdata.Vouchs.Batch;
                            tabconf.vouchstable.button(1).trigger();
                        }
                    }
            ];
            strbuttons = [
                { extend: "create", editor: tabconf.vouchseditor },
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

        var drawcallback = null;
        if (tabconf.Id == 'tab5' || tabconf.Id == 'tab2') {
            drawcallback = function () {
                var indexes = tabconf.vouchstable.rows({ search: 'applied' }).indexes();
                var currentPosition = indexes.indexOf(checkmvseditorindex);
                tabconf.vouchstable.row(indexes[currentPosition]).select();
                var rowdata = tabconf.vouchstable.row({ selected: true }).data();
                editcurbatch = rowdata.Vouchs.Batch;
            }
        }

        tabconf.vouchstable = $('#' + tableid)
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
                pageLength: -1,
                columnDefs: [{ targets: [0], visible: false }],
                drawCallback: drawcallback,
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

        if (tabconf.Id == 'tab3') {
            var madedatenode = tabconf.vouchseditor.field('Vouchs.MadeDate').input();
            $(madedatenode).on('focus', function () {
                var invopts = tabconf.vouchstable.ajax.json().options['Vouchs.InvId'];
                var curselectinvid = $(tabconf.vouchseditor.field('Vouchs.InvId').input()).val();
                for (var i = 0; i < invopts.length; i++) {
                    if (invopts[i].value == curselectinvid) {
                        if (invopts[i].label.IsShelfLife == true) {
                            var madedate = tabconf.vouchseditor.field('Vouchs.MadeDate').val();
                            tabconf.vouchseditor.field('Vouchs.Batch').val(madedate.replace(/-/g,''));
                            var newday = new Date(madedate);
                            switch (invopts[i].label.ShelfLifeType) {
                                case 0:
                                    newday.setDate(newday.getDate() + invopts[i].label.ShelfLife);
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                    break;
                                case 1:
                                    newday.setDate(newday.getDate() + invopts[i].label.ShelfLife * 7);
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                    break;
                                case 2:
                                    newday.setMonth(newday.getMonth() + invopts[i].label.ShelfLife);
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                    break;
                                case 3:
                                    newday.setYear(newday.getFullYear() + invopts[i].label.ShelfLife);
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                    break;
                            }
                        }
                        break;
                    }
                }
            })
        }

        if (tabconf.Id == 'tab5') {
            if ($('#gparamisloctor').val() == 'true') {
                var loctoridnode = tabconf.vouchseditor.field('Vouchs.ToLocatorId').input();
                $(loctoridnode).on('change', function () {
                    var curselectinvid = $(tabconf.vouchseditor.field('Vouchs.InvId').input()).val();
                    var curwhid = $('#gparamuserwhid').val();
                    var loctor = '';
                    if (tabconf.vouchseditor.field('Vouchs.ToLocatorId') !== undefined) {
                        loctor = '=' + tabconf.vouchseditor.field('Vouchs.ToLocatorId').val();
                    }
                    if (curselectinvid != null) {
                        curstockdata = null;
                        $.ajax({
                            url: "/api/Editor/Data?model=CurrentStock",
                            dataType: 'json',
                            method: 'POST',
                            data: {
                                draw: 1,
                                columns: [
                                    {
                                        data: 'WhId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: '=' + curwhid, regex: false }
                                    }, {
                                        data: 'LocatorId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: loctor, regex: false }
                                    }, {
                                        data: 'InvId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: '=' + curselectinvid, regex: false }
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
                                var batchinput = tabconf.vouchseditor.field('Vouchs.Batch').input();
                                $(batchinput).empty();
                                if (jsonsk.data == undefined || jsonsk.data.length == 0) {
                                    tabconf.vouchseditor.field('CurStockNum').set('0');
                                    tabconf.vouchseditor.field('Vouchs.MadeDate').set('');
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set('');
                                } else {
                                    curstockdata = jsonsk.data;
                                    $.each(jsonsk.data, function (k, v) {
                                        $(batchinput).append('<option value="' + v.Batch + '">' + v.Batch + '</option>');
                                    })
                                    tabconf.vouchseditor.field('CurStockNum').set(jsonsk.data[0].Num);
                                    tabconf.vouchseditor.field('Vouchs.MadeDate').set(jsonsk.data[0].MadeDate);
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set(jsonsk.data[0].InvalidDate);
                                    if (editcurbatch != null) {
                                        $(batchinput).val(editcurbatch);
                                        $(batchinput).change();
                                        editcurbatch = null;
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
                                $('div.DTE_Form_Error').html(errinfo);
                            }
                        })
                    }
                })
            } else {
                var invidnode = tabconf.vouchseditor.field('Vouchs.InvId').input();
                $(invidnode).on('change', function () {
                    var invopts = tabconf.vouchstable.ajax.json().options['Vouchs.InvId'];
                    var curselectinvid = $(this).val();
                    for (var i = 0; i < invopts.length; i++) {
                        if (invopts[i].value == curselectinvid) {
                            tabconf.vouchseditor.field('Inventory.Specs').val(invopts[i].label.Specs);
                            tabconf.vouchseditor.field('UOM.Name').val(invopts[i].label.StockUOMName);
                            break;
                        }
                    }
                    var curwhid = $('#gparamuserwhid').val();
                    if (curselectinvid != null) {
                        curstockdata = null;
                        $.ajax({
                            url: "/api/Editor/Data?model=CurrentStock",
                            dataType: 'json',
                            method: 'POST',
                            data: {
                                draw: 1,
                                columns: [
                                    {
                                        data: 'WhId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: '=' + curwhid, regex: false }
                                    }, {
                                        data: 'LocatorId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: '', regex: false }
                                    }, {
                                        data: 'InvId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: '=' + curselectinvid, regex: false }
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
                                var batchinput = tabconf.vouchseditor.field('Vouchs.Batch').input();
                                if (jsonsk.data == undefined || jsonsk.data.length == 0) {
                                    tabconf.vouchseditor.field('CurStockNum').set('0');
                                    $(batchinput).empty();
                                    tabconf.vouchseditor.field('Vouchs.MadeDate').set('');
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set('');
                                    tabconf.vouchseditor.field('Vouchs.Price').set('');
                                } else {
                                    curstockdata = jsonsk.data;
                                    $(batchinput).empty();
                                    $.each(jsonsk.data, function (k, v) {
                                        $(batchinput).append('<option value="' + v.Batch + '">' + v.Batch + '</option>');
                                    })
                                    tabconf.vouchseditor.field('CurStockNum').set(jsonsk.data[0].Num);
                                    tabconf.vouchseditor.field('Vouchs.MadeDate').set(jsonsk.data[0].MadeDate);
                                    tabconf.vouchseditor.field('Vouchs.InvalidDate').set(jsonsk.data[0].InvalidDate);
                                    tabconf.vouchseditor.field('Vouchs.Price').set(jsonsk.data[0].Price);
                                    if (editcurbatch != null) {
                                        $(batchinput).val(editcurbatch);
                                        $(batchinput).change();
                                        editcurbatch = null;
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
                                $('div.DTE_Form_Error').html(errinfo);
                            }
                        })
                    }
                })
            }

            var batchinput = tabconf.vouchseditor.field('Vouchs.Batch').input();
            $(batchinput).on('change', function () {
                var curselectbatch = $(this).val();
                $.each(curstockdata, function (i, d) {
                    if (curselectbatch == d.Batch) {
                        tabconf.vouchseditor.field('CurStockNum').set(d.Num);
                        tabconf.vouchseditor.field('Vouchs.MadeDate').set(d.MadeDate);
                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(d.InvalidDate);
                    }
                })
            })
        } else if(tabconf.Id=='tab3'){
            var invidnode = tabconf.vouchseditor.field('Vouchs.InvId').input();
            $(invidnode).on('change', function () {
                var invopts = tabconf.vouchstable.ajax.json().options['Vouchs.InvId'];
                var curselectinvid = $(this).val();
                for (var i = 0; i < invopts.length; i++) {
                    if (invopts[i].value == curselectinvid) {
                        tabconf.vouchseditor.field('Inventory.Specs').val(invopts[i].label.Specs);
                        tabconf.vouchseditor.field('UOM.Name').val(invopts[i].label.StockUOMName);
                        //tabconf.vouchseditor.field('isShLife').val(invopts[i].label.IsShelfLife);
                        var inputtmp = tabconf.vouchseditor.field('Vouchs.Price').input();
                        if (invopts[i].label.Price == '' || invopts[i].label.Price == null) {
                            $(inputtmp).attr('readonly', false);
                            $(inputtmp).removeClass('disabled');
                        } else {
                            tabconf.vouchseditor.field('Vouchs.Price').val(invopts[i].label.Price);
                            $(inputtmp).attr('readonly', true);
                            $(inputtmp).addClass('disabled');
                        }

                        if (invopts[i].label.IsShelfLife == true) {
                            if (tabconf.vouchseditor.field('Vouchs.MadeDate').val() == '') {
                                var today = new Date();
                                tabconf.vouchseditor.field('Vouchs.MadeDate').set(today);
                                tabconf.vouchseditor.field('Vouchs.Batch').val(moment().format('YYYY-MM-DD').replace(/-/g, ''));
                                switch (invopts[i].label.ShelfLifeType) {
                                    case 0:
                                        var newday = new Date();
                                        newday.setDate(newday.getDate() + invopts[i].label.ShelfLife);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                    case 1:
                                        var newday = new Date();
                                        newday.setDate(newday.getDate() + invopts[i].label.ShelfLife * 7);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                    case 2:
                                        var newday = new Date();
                                        newday.setMonth(newday.getMonth() + invopts[i].label.ShelfLife);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                    case 3:
                                        var newday = new Date();
                                        newday.setYear(newday.getFullYear() + invopts[i].label.ShelfLife);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                }
                            } else {
                                var madedate = tabconf.vouchseditor.field('Vouchs.MadeDate').val();
                                tabconf.vouchseditor.field('Vouchs.Batch').val(madedate.replace(/-/g, ''));
                                switch (invopts[i].label.ShelfLifeType) {
                                    case 0:
                                        var newday = new Date();
                                        newday.setDate(newday.getDate() + invopts[i].label.ShelfLife);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                    case 1:
                                        var newday = new Date();
                                        newday.setDate(newday.getDate() + invopts[i].label.ShelfLife * 7);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                    case 2:
                                        var newday = new Date();
                                        newday.setMonth(newday.getMonth() + invopts[i].label.ShelfLife);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                    case 3:
                                        var newday = new Date();
                                        newday.setYear(newday.getFullYear() + invopts[i].label.ShelfLife);
                                        tabconf.vouchseditor.field('Vouchs.InvalidDate').set(newday);
                                        break;
                                }
                            }
                        }
                        break;
                    }
                }
            })
        }

        if (tabconf.Id == 'tab2') {
            var invidnode = tabconf.vouchseditor.field('Vouchs.InvId').input();
            $(invidnode).on('change', function () {
                var invopts = tabconf.vouchstable.ajax.json().options['Vouchs.InvId'];
                var curselectinvid = $(this).val();
                for (var i = 0; i < invopts.length; i++) {
                    if (invopts[i].value == curselectinvid) {
                        tabconf.vouchseditor.field('Inventory.Specs').val(invopts[i].label.Specs);
                        tabconf.vouchseditor.field('UOM.Name').val(invopts[i].label.StockUOMName);
                    }
                }
            })

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
                    message: '您确定要删除 ' + eletr.find('td:first-child').html() + ' 吗？',
                    buttons: '删除'
                });
            });
        } else if (tabconf.Id == 'tab5') {
            $('#' + tableid).on('click', 'a.tab5editor_edit', function (e) {
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

            $('#' + tableid).on('click', 'a.tab5editor_remove', function (e) {
                e.preventDefault();
                var eletr = $(this).closest('tr');
                if (eletr.hasClass('child')) {
                    eletr = eletr.prev('tr.parent');
                }
                tabconf.vouchstable.rows(eletr).select();
                tabconf.vouchseditor.remove(eletr, {
                    title: '删除记录',
                    message: '您确定要删除 ' + eletr.find('td:first-child').html() + ' 吗？',
                    buttons: '删除'
                });
            });
        }
    }

    var lenFor = function (str) {
        var byteLen = 0, len = str.length;
        if (str) {
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) > 255) {
                    byteLen += 2;
                }
                else {
                    byteLen++;
                }
            }
            return byteLen;
        }
        else {
            return 0;
        }
    }

    function printtransvouch(tabconf,objtarget) {
        var data = {
            header: [],
            body: []
        };
        data.header[0] = '存货';
        data.header[1] = '规格型号';
        data.header[2] = '计量\n单位';
        data.header[3] = '数量';
        data.header[4] = '单价';
        data.header[5] = '金额';
        data.header[6] = '批号';
        data.header[7] = '生产日期';
        data.header[8] = '过期日期';

        var sumnum = 0;
        var sumamount = 0;
        $.each(tabconf.vouchstable.ajax.json().data, function (k, v) {
            data.body[k] = [];
            var invname = v.Inventory.Name;
            var length = parseInt(invname.length / 7) + 1;
            var strname = '';
            for (var i = 0; i < length; i++) {
                if (i == length - 1) {
                    strname += invname.substr(7 * i, invname.length);
                } else {
                    strname += invname.substr(7 * i, 7 * i + 7) + '\n';
                }
            }

            var specsname = v.Inventory.Specs;
            var strspecname = '';
            if (specsname != '' && specsname != null) {
                var bytelength = lenFor(specsname);

                if (bytelength > 12) {
                    var length = parseInt(specsname.length / 7) + 1;
                    for (var i = 0; i < length; i++) {
                        if (i == length - 1) {
                            strspecname += specsname.substr(7 * i, specsname.length);
                        } else {
                            strspecname += specsname.substr(7 * i, 7 * i + 7) + '\n';
                        }
                    }
                } else {
                    strspecname = specsname;
                }
            }
            data.body[k][0] = strname;
            data.body[k][1] = strspecname == null ? '' : strspecname;
            data.body[k][2] = v.UOM.Name == null ? '' : v.UOM.Name;
            data.body[k][3] = v.Vouchs.Num;
            data.body[k][4] = v.Vouchs.Price;
            data.body[k][5] = v.Vouchs.Amount;
            data.body[k][6] = v.Vouchs.Batch == null ? '' : v.Vouchs.Batch;
            data.body[k][7] = v.Vouchs.MadeDate == null ? '' : v.Vouchs.MadeDate;
            data.body[k][8] = v.Vouchs.InvalidDate == null ? '' : v.Vouchs.InvalidDate;
            sumnum += v.Vouchs.Num;
            sumamount += v.Vouchs.Amount;
        })
        var datalength = data.body.length;
        data.body[datalength] = [];
        data.body[datalength][0] = '';
        data.body[datalength][1] = '';
        data.body[datalength][2] = '合计';
        data.body[datalength][3] = sumnum;
        data.body[datalength][4] = '';
        data.body[datalength][5] = Math.round(sumamount * 100) / 100;
        data.body[datalength][6] = '';
        data.body[datalength][7] = '';
        data.body[datalength][8] = '';
        var rows = [];
        rows.push($.map(data.header, function (d) {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: 'tableHeader'
            };
        }));

        for (var i = 0, ien = data.body.length ; i < ien ; i++) {
            rows.push($.map(data.body[i], function (d) {
                return {
                    text: typeof d === 'string' ? d : d + '',
                    style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
                };
            }));
        }

        var vouchdatatmp = vouchtransdata.data[0];
        var strdate = vouchdatatmp.Vouch.VouchDate == null ? '' : vouchdatatmp.Vouch.VouchDate;
        var strMemo = vouchdatatmp.Vouch.Memo == null ? '' : vouchdatatmp.Vouch.Memo;
        var strprinttime = moment().format('YYYY-MM-DD hh:mm:ss');
        var doc = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [30, 40, 30, 40],
            content: [
                { text: '调拨单', style: 'title' },
                {
                    columns: [
                        {
                            text: "单  据  号: " + vouchdatatmp.Vouch.Code,
                            style: 'tableinfo'
                        },
                        {
                            text: "单据日期: " + vouchdatatmp.Vouch.VouchDate,
                            style: 'tableinfo'
                        },
                        {
                            text: "审核日期: " + strdate,
                            style: 'tableinfo'
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: "转出仓库: " + vouchdatatmp.OutWarehouse.Name,
                            style: 'tableinfo'
                        },
                        {
                            text: "转入仓库: " + vouchdatatmp.InWarehouse.Name,
                            style: 'tableinfo'
                        },
                        {
                            text: "备      注: " + strMemo,
                            style: 'tableinfo'
                        }
                    ]
                },
                {
                    style: 'tabletrans',
                    table: {
                        headerRows: 1,
                        body: rows,
                        widths: [113, 95, 'auto', 60, 70, 70, 'auto', 90, 90]
                    }
                },
                {
                    columns: [
                        {
                            text: "收货人: ",
                            style: 'tableinfofoot'
                        },
                        {
                            text: "发货人: ",
                            style: 'tableinfofoot'
                        },
                        {
                            text: "操作日期: " + strprinttime,
                            style: 'tableinfofoot'
                        }
                    ]
                }
            ],
            styles: {
                tableHeader: {
                    fontSize: 16,
                    alignment: 'center',
                    bold: false
                },
                title: {
                    alignment: 'center',
                    fontSize: 30,
                    margin: [0, 0, 0, 10]
                },
                tabletrans: {
                    fontSize: 16,
                    bold: false,
                    margin: [0, 10, 0, 0],
                    width: '100%'
                },
                tableinfo: {
                    fontSize: 16,
                    bold: false,
                    margin: [0, 5],
                },
                tableinfofoot: {
                    fontSize: 16,
                    bold: false,
                    margin: [0, 10],
                },
                message: {}
            },
            defaultStyle: {
                fontSize: 16,
                bold: false,
                font: 'msjjht',
                columnGap: 10
            }
        };

        //if (config.customize) {
        //    config.customize(doc, config);
        //}

        var pdf = window.pdfMake.createPdf(doc).print();
        panelLoaded(objtarget);
    }

    function printplanvouch(tabconf,objtraget) {
        var data = {
            header: [],
            body: []
        };
        data.header[0] = '品名';
        data.header[1] = '计量单位';
        data.header[2] = '下单数量';
        data.header[3] = '生产数量';
        data.header[4] = '报废数量';
        data.header[5] = '出品数';
        data.header[6] = '经手人';

        var sumnum = 0;
        $.each(tabconf.vouchstable.ajax.json().data, function (k, v) {
            data.body[k] = [];
            data.body[k][0] = v.Inventory.Name;
            data.body[k][1] = v.UOM.Name == null ? '' : v.UOM.Name;
            data.body[k][2] = v.Vouchs.Num;
            data.body[k][3] = '';
            data.body[k][4] = '';
            data.body[k][5] = '';
            data.body[k][6] = '';
            sumnum += v.Vouchs.Num;
        })
        //var datalength = data.body.length;
        //data.body[datalength] = [];
        //data.body[datalength][0] = '';
        //data.body[datalength][1] = '';
        //data.body[datalength][2] = '合计';
        //data.body[datalength][3] = sumnum;
        //data.body[datalength][4] = '';
        //data.body[datalength][5] = sumamount;
        //data.body[datalength][6] = '';
        //data.body[datalength][7] = '';
        //data.body[datalength][8] = '';
        var rows = [];
        rows.push($.map(data.header, function (d) {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: 'tableHeader'
            };
        }));

        for (var i = 0, ien = data.body.length ; i < ien ; i++) {
            rows.push($.map(data.body[i], function (d) {
                return {
                    text: typeof d === 'string' ? d : d + '',
                    style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
                };
            }));
        }

        var vouchdatatmp = vouchplandata.data[0];
        var whname = vouchdatatmp.InWarehouse.Name;
        var strMemo = vouchdatatmp.Vouch.Memo == null ? '' : vouchdatatmp.Vouch.Memo;
        var strprinttime = moment().format('YYYY-MM-DD hh:mm:ss');
        var doc = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            content: [
                { text: '生产计划单', style: 'title' },
                {
                    columns: [
                        {
                            text: "生产仓库: " + whname,
                            style: 'tableinfo'
                        },
                        {
                            text: "操作日期: " + strprinttime,
                            style: 'tableinfo'
                        }
                    ]
                },
                {
                    style: 'tabletrans',
                    table: {
                        headerRows: 1,
                        body: rows,
                        widths: [130, 40, 56, 56, 56,56,56]
                    }
                }
            ],
            styles: {
                tableHeader: {
                    fontSize: 12,
                    alignment: 'center',
                    bold: false
                },
                title: {
                    alignment: 'center',
                    fontSize: 20,
                    margin: [0, 0, 0, 10]
                },
                tabletrans: {
                    fontSize: 12,
                    bold: false,
                    margin: [0, 10, 0, 0],
                    width: '100%'
                },
                tableinfo: {
                    fontSize: 12,
                    bold: false,
                    margin: [0, 5],
                },
                tableinfofoot: {
                    fontSize: 12,
                    bold: false,
                    margin: [0, 10],
                },
                small:{
                    fontSize:12
                },
                message: {}
            },
            defaultStyle: {
                fontSize: 12,
                bold: false,
                font: 'msjjht',
                columnGap: 10
            }
        };

        //if (config.customize) {
        //    config.customize(doc, config);
        //}

        var pdf = window.pdfMake.createPdf(doc).print();
        panelLoaded(objtraget);
    }

    function loadcallvouchlink(tabconf, strvouchid, mixvouchdata,vouchlinklist) {
        $.ajax({
            type: "POST",
            url: "/api/Editor/Data?model=Vouchs",
            data: {
                draw: 1,
                columns: [
                    {
                        data: 'Vouchs.VouchId',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: strvouchid, regex: false }
                    }
                ],
                order: [
                    { column: 0, dir: 'asc' }
                ],
                start: 0,
                length: -1,
                search: { value: '', regex: false }
            },
            dataType: 'json',
            success: function (jsonvouchs) {
                var mixvouchsdata = [];
                $.each(jsonvouchs.data, function (kmvs, vmvs) {
                    mixvouchsdata.push({
                        VouchId: vmvs.Vouchs.VouchId,
                        InvId: vmvs.Vouchs.InvId,
                        Name: vmvs.Inventory.Name,
                        Specs: vmvs.Inventory.Specs,
                        UOM: vmvs.UOM.Name,
                        Num: vmvs.Vouchs.Num
                    })
                })

                //var editortable = getevouchstable(tabconf.Id + 'sumtable');
                //$('#' + tabconf.Id).append(editortable);
                //var head = $('<thead><tr></tr></thead>');
                //head.children('tr').append('<th>存货Id</th>');
                //head.children('tr').append('<th>存货</th>');
                //head.children('tr').append('<th>规格型号</th>');
                //head.children('tr').append('<th>计量单位</th>');
                //head.children('tr').append('<th>数量</th>');
                //$('#' + tabconf.Id + 'sumtable').append(head);
                //tabconf.sumtable = $('#' + tabconf.Id + 'sumtable').DataTable({
                //    dom: "<'row'<'col-sm-12'B>>" + "<'row'<'col-sm-12'rt>>",
                //    autoWidth: false,
                //    columns: [
                //        { data: 'InvId' },
                //        { data: 'Name' },
                //        { data: 'Specs' },
                //        { data: 'UOM' },
                //        { data: 'Num' }
                //    ],
                //    columnDefs: [{ targets: [0], visible: false }],
                //    buttons: [
                //        {
                //            extend: "customButton",
                //            text: '展开/隐藏存货列表',
                //            action: function (e, dt, node, config) {
                //                if ($('#' + tabconf.Id + 'sumtable').hasClass('hide')) {
                //                    $('#' + tabconf.Id + 'sumtable').removeClass('hide');
                //                } else {
                //                    $('#' + tabconf.Id + 'sumtable').addClass('hide');
                //                }
                //            }
                //        },
                //        {
                //            extend: "customButton",
                //            text: '生成生产计划单',
                //            action: function (e, dt, node, config) {
                //                var objtarget = e.currentTarget;
                //                panelLoading(objtarget);
                //                var rowData = tabconf.mixlisttable.rows({ selected: true }).data().toArray();
                //                var strmvids = "";
                //                $.each(rowData, function (k, v) {
                //                    strmvids += v.DT_RowId + ',';
                //                })
                //                if (strmvids=='') {
                //                    addUIAlter('nav.breadcrumb', '请选择要需要生产的存货', 'error');
                //                    return false;
                //                }
                //                strmvids = strmvids.substr(0, strmvids.length - 1);
                //                var reqmvdata = {
                //                    action: "create",
                //                    data: [{
                //                        Vouch : {
                //                            VouchType: "014",
                //                            VouchDate: moment().format('YYYY-MM-DD'),
                //                            ToWhId: $('#gparamuserwhid').val(),
                //                            Memo: strmvids
                //                        }
                //                    }]
                //                };

                //                var reqmvsdata = {
                //                    action: "create",
                //                    data: []
                //                };
                //                var rowsumdata = tabconf.sumtable.data().toArray();
                //                $.each(rowsumdata, function (k, v) {
                //                    reqmvsdata.data.push({
                //                        Vouchs: {
                //                            InvId:v.InvId,
                //                            Num:v.Num
                //                        }
                //                    })
                //                })

                //                $.ajax({
                //                    url: "/api/Editor/Data?model=Vouch&VouchType=014",
                //                    dataType: 'json',
                //                    method: 'POST',
                //                    data: reqmvdata,
                //                    success: function (jsonmv) {
                //                        if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                //                            $.each(jsonmv.fieldErrors, function (key, val) {
                //                                addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                //                            });
                //                            panelLoaded(objtarget);
                //                            return false;
                //                        } else if (jsonmv.error) {
                //                            addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                //                            panelLoaded(objtarget);
                //                            return false;
                //                        }
                //                        var newvouchid=jsonmv.data[0].DT_RowId.replace('row_', '');
                //                        $.each(reqmvsdata.data, function (kk, vv) {
                //                            reqmvsdata.data[kk].Vouchs.VouchId = newvouchid;
                //                        })
                //                        $.ajax({
                //                            url: "/api/Editor/Data?model=Vouchs",
                //                            dataType: 'json',
                //                            method: 'POST',
                //                            data: reqmvsdata,
                //                            success: function (jsonmvs) {
                //                                if (jsonmvs.fieldErrors && jsonmvs.fieldErrors.length > 0) {
                //                                    $.each(jsonmvs.fieldErrors, function (key, val) {
                //                                        addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                //                                    });
                //                                    panelLoaded(objtarget);
                //                                    return false;
                //                                } else if (jsonmvs.error) {
                //                                    addUIAlter('nav.breadcrumb', jsonmvs.error, 'error');
                //                                    panelLoaded(objtarget);
                //                                    return false;
                //                                }
                //                                panelLoaded(objtarget);
                //                                document.location = "/StockMg/MixVouchMakeUp?id=" + newvouchid + "&type=014";
                //                            },
                //                            error: function (jsonmvs) {
                //                                panelLoaded(objtarget);
                //                                var errobj = eval("(" + jsonmvs.responseText + ")");
                //                                var errinfo = '';
                //                                if (errobj.exceptionMessage) {
                //                                    errinfo = errobj.exceptionMessage;
                //                                } else {
                //                                    errinfo = jsonmvs.responseText;
                //                                }
                //                                addUIAlter('nav.breadcrumb', errinfo, 'error');
                //                                return false;
                //                            }
                //                        });
                //                    },
                //                    error: function (jsonmv) {
                //                        panelLoaded(objtarget);
                //                        var errobj = eval("(" + jsonmv.responseText + ")");
                //                        var errinfo = '';
                //                        if (errobj.exceptionMessage) {
                //                            errinfo = errobj.exceptionMessage;
                //                        } else {
                //                            errinfo = jsonmv.responseText;
                //                        }
                //                        addUIAlter('nav.breadcrumb', errinfo, 'error');
                //                        return false;
                //                    }
                //                });
                //            }
                //        }
                //    ],
                //    pageLength: -1,
                //    language: {
                //        "processing": "<span class='spinner-small'></span>",
                //        "zeroRecords": "没有检索到数据",
                //    }
                //})
                createMixVouchTable(tabconf, mixvouchdata, mixvouchsdata,vouchlinklist);
            }
        })
    }

    function createPanelContent(tabconf, mvid, reqdata) {
        switch (tabconf.paneltype) {
            case 'vouchssum':
                //$('#vouchnav ul').append('<li><a href="#tab1" data-toggle="tab">' + tabconf.Name + '</a></li>');
                //$('#rootwizard .tab-content').append('<div class="tab-pane row" id="tab1"></div>');
                $.ajax({
                    type: "POST",
                    url: "/api/Editor/Data?model=CallVouch",
                    data: {
                        draw: 1,
                        columns: [
                            {
                                data: 'Vouch.FromWhId',
                                name: '',
                                searchable: true,
                                orderable: true,
                                search: { value: '=' + $('#gparamuserwhid').val(), regex: false }
                            }
                        ],
                        order: [
                            { column: 0, dir: 'asc' }
                        ],
                        start: 0,
                        length: -1,
                        search: { value: '', regex: false }
                    },
                    dataType: 'json',
                    success: function (jsoncall) {
                        if (mvid == '0') {
                            if (jsoncall.data == undefined) {
                                addUIAlter('nav.breadcrumb', '获取单据错误', 'error');
                                return false;
                            } else if (jsoncall.data.length == 0) {
                                $('#' + tabconf.Id).addClass('tabempty');
                                var strempty = '';
                                if (tabconf.Id == 'tab1') {
                                    strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>无叫货单</h1></div>' +
                                    '<div class="col-sm-12 text-c emptycontent">叫货需求均已列入生产计划，目前没有未处理的叫货单。</div>';
                                }
                                $('#' + tabconf.Id).append(strempty);
                                return false;
                            }
                            var strvouchid = "";
                            $.each(jsoncall.data, function (k, v) {
                                strvouchid += v.Vouch.Id + ',';
                            })
                            strvouchid = 'in(' + strvouchid.substr(0, strvouchid.length - 1) + ')';
                            var mixvouchdata = [];
                            $.each(jsoncall.data, function (kmv, vmv) {
                                mixvouchdata.push({
                                    DT_RowId: vmv.Vouch.Id,
                                    space: '',
                                    check: '',
                                    Code: vmv.Vouch.Code,
                                    InWarehouse: vmv.Warehouse.Name,
                                    MakeDate: vmv.Vouch.MakeTime,
                                    Maker: vmv.Users.FullName,
                                    TransIsVerify: false,
                                    Status:'待生产'
                                })
                            })
                            var vouchlinklist = [];
                            orgvouchlinkdata = vouchlinklist;
                            loadcallvouchlink(tabconf, strvouchid, mixvouchdata,vouchlinklist);
                        } else {
                            $.ajax({
                                type: "POST",
                                url: "/api/Editor/Data?model=VouchLink",
                                data: {
                                    draw: 1,
                                    columns: [
                                        {
                                            data: 'VouchLink.SourceId',
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
                                    length: -1,
                                    search: { value: '', regex: false }
                                },
                                dataType: 'json',
                                success: function (jsonlink) {
                                    if (jsoncall.data == undefined || jsonlink.data == undefined) {
                                        addUIAlter('nav.breadcrumb', '获取单据错误', 'error');
                                        return false;
                                    } else if (jsoncall.data.length == 0 && jsonlink.data.length == 0) {
                                        $('#' + tabconf.Id).addClass('tabempty');
                                        var strempty = '';
                                        if (tabconf.Id == 'tab1') {
                                            strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>获取关联叫货单错误</h1></div>' +
                                            '<div class="col-sm-12 text-c emptycontent">生产计划单异常，请刷新重试，或联系系统管理员。</div>';
                                        }
                                        $('#' + tabconf.Id).append(strempty);
                                        return false;
                                    }
                                    var strvouchid = "";
                                    $.each(jsoncall.data, function (k, v) {
                                        strvouchid += v.Vouch.Id + ',';
                                    })
                                    $.each(jsonlink.data, function (k, v) {
                                        strvouchid += v.VouchLink.Id + ',';
                                    })
                                    strvouchid = 'in(' + strvouchid.substr(0, strvouchid.length - 1) + ')';
                                    var mixvouchdata = [];
                                    var vouchlinklist = [];
                                    $.each(jsoncall.data, function (kmv, vmv) {
                                        mixvouchdata.push({
                                            DT_RowId: vmv.Vouch.Id,
                                            space: '',
                                            check: '',
                                            Code: vmv.Vouch.Code,
                                            InWarehouse: vmv.Warehouse.Name,
                                            MakeDate: vmv.Vouch.MakeTime,
                                            Maker: vmv.Users.FullName,
                                            TransIsVerify: false,
                                            Status: '待生产'
                                        })
                                    })
                                    $.each(jsonlink.data, function (kmv, vmv) {
                                        var status = '待生产';
                                        if (vmv.TransVouch.IsVerify == false && vmv.VouchLink.SourceId != null) {
                                            status= '生产中';
                                        } else if (vmv.TransVouch.IsVerify == true && vmv.OtherInStock.IsVerify == false) {
                                            status= '待收货';
                                        } else if (vmv.TransVouch.IsVerify == true && vmv.OtherInStock.IsVerify == true) {
                                            status= '已完结';
                                        }
                                        mixvouchdata.push({
                                            DT_RowId: vmv.VouchLink.Id,
                                            space: '',
                                            check: '',
                                            Code: vmv.Vouch.Code,
                                            InWarehouse: vmv.Warehouse.Name,
                                            MakeDate: vmv.Vouch.MakeTime,
                                            Maker: vmv.Users.FullName,
                                            TransIsVerify: vmv.TransVouch.IsVerify,
                                            Status: status
                                        })
                                        vouchlinklist.push({ Id: vmv.VouchLink.Id, Code: vmv.Vouch.Code });
                                    })
                                    orgvouchlinkdata = jsonlink.data;
                                    loadcallvouchlink(tabconf, strvouchid, mixvouchdata,vouchlinklist);
                                }
                            })
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
                break;
            case 'vouchsedit':
                $.ajax({
                    type: "POST",
                    url: tabconf.vouchurl,
                    data: reqdata,
                    dataType: 'json',
                    success: function (json) {
                        if (json.data == undefined || json.data.length == 0) {
                            var strempty = '';
                            if (mvid == '0' && tabconf.Id == 'tab2') {
                                $('#' + tabconf.Id).addClass('tabempty');
                                strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>生产计划单未创建</h1></div>' +
                                    '<div class="col-sm-12 text-c emptycontent">' + tabconf.Name + '暂未生成，请在"叫货汇总"中选择关联叫货单，并创建生产计划单。</div>';
                                $('#' + tabconf.Id).append(strempty);

                                $('#tab3').addClass('tabempty');
                                strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>生产计划单未创建</h1></div>' +
                                    '<div class="col-sm-12 text-c emptycontent">' + tabconf.Name + '暂未生成，请在"叫货汇总"中选择关联叫货单，并创建生产计划单。</div>';
                                $('#tab3').append(strempty);
                                return false;
                            }else if (mvid != '0' && tabconf.ismain == true) {
                                addUIAlter('nav.breadcrumb', '获取单据错误', 'error');
                                return false;
                            } else if (tabconf.ismain == false) {
                                if (tabconf.Id == 'tab2') {
                                    $('#' + tabconf.Id).addClass('tabempty');
                                    strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>叫货单未审核</h1></div>' +
                                        '<div class="col-sm-12 text-c emptycontent">' + tabconf.Name + '暂未生成，需等待叫货单审核完成，请先审核叫货单。</div>';
                                    $('#' + tabconf.Id).append(strempty);
                                    createPanelContent(wizsteps.tab3, gmvid, null);
                                }
                                return false;
                            }
                        }
                        vouchorgdata = json;
                        if (tabconf.Id == 'tab5') {
                            vouchtransdata = json;
                            $('#tab5').find('#isverify').val(json.data[0].Vouch.Isverify);
                        }
                        if (tabconf.Id == 'tab2') {
                            vouchplandata = json;
                        }
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
                            if (!$('#' + tabconf.Id).find('div.group1').hasClass('hide')) {
                                $('#' + tabconf.Id).find('div.group1').addClass('hide')
                            }
                            if (!$('#' + tabconf.Id).find('div.group2').hasClass('hide')) {
                                $('#' + tabconf.Id).find('div.group2').addClass('hide')
                            }
                        } else {
                            if (tabconf.Id == 'tab2') {
                                createPanelContent(wizsteps.tab3, gmvid, null);
                            }
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
                            reqdata = {
                                action: 'verify',
                                data: {}
                            }
                            reqdata.data['row_' + vouchid] = { Vouch: { IsVerify: true, VouchType: vouchtype } };
                            if (tabconf.Id == 'tab2') {
                                reqdata.data['row_' + vouchid].Vouch.Step = 1;
                            }
                            var objtarget = this;
                            panelLoading(objtarget);
                            $.ajax({
                                url: "/api/Editor/Data?model=Vouch&VouchType=" + vouchtype,
                                dataType: 'json',
                                method: 'POST',
                                data: reqdata,
                                success: function (jsonmv) {
                                    if (tabconf.Id == 'tab3' || tabconf.Id == 'tab5') {
                                        var requpdstepdata = {
                                            action: "edit",
                                            data: {}
                                        };
                                        var stepvouchid = $('#tab2mvform').data('id');
                                        if (tabconf.Id == 'tab3') {
                                            requpdstepdata.data['row_' + stepvouchid] = { Step: 2 };
                                        } else if (tabconf.Id == 'tab5') {
                                            requpdstepdata.data['row_' + stepvouchid] = { Step: 9 };
                                            requpdstepdata.data['row_' + vouchorgdata.data[0].Vouch.SourceId] = { Step: 3 };
                                        }
                                        $.ajax({
                                            method: "POST",
                                            url: "/api/Editor/Data?model=VouchStep",
                                            data: requpdstepdata,
                                            dataType: "json",
                                            success: function (jsonstep) {

                                            }
                                        })
                                    }
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
                                    if (tabconf.Id == 'tab2' || tabconf.Id == 'tab5') {
                                        document.location = "/StockMg/MixVouchMakeUp?id=" + gmvid + "&type=014&optab=" + tabconf.Id;
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
                        $('#' + tabconf.Id).find('#mvunverify').on('click', function () {
                            var vouchid = $('#' + tabconf.Id + 'mvform').data('id');
                            var vouchtype = tabconf.vchtype;
                            reqdata = {
                                action: 'unverify',
                                data: {}
                            }
                            reqdata.data['row_' + vouchid] = { Vouch: { IsVerify: false, VouchType: vouchtype } };
                            if (tabconf.Id == 'tab2') {
                                reqdata.data['row_' + vouchid].Vouch.Step = 0;
                            }
                            var objtarget = this;
                            panelLoading(objtarget);
                            $.ajax({
                                url: "/api/Editor/Data?model=Vouch&VouchType=" + vouchtype,
                                dataType: 'json',
                                method: 'POST',
                                data: reqdata,
                                success: function (jsonmv) {
                                    if (tabconf.Id == 'tab3' || tabconf.Id == 'tab5') {
                                        var requpdstepdata = {
                                            action: "edit",
                                            data: {}
                                        };
                                        var stepvouchid = $('#tab2mvform').data('id');
                                        if (tabconf.Id == 'tab3') {
                                            requpdstepdata.data['row_' + stepvouchid] = { Step: 1 };
                                        } else if (tabconf.Id == 'tab5') {
                                            requpdstepdata.data['row_' + stepvouchid] = { Step: 2 };
                                            requpdstepdata.data['row_' + vouchorgdata.data[0].Vouch.SourceId] = { Step: 2 };
                                        }
                                        $.ajax({
                                            method: "POST",
                                            url: "/api/Editor/Data?model=VouchStep",
                                            data: requpdstepdata,
                                            dataType: "json",
                                            success: function (jsonstep) {

                                            }
                                        })
                                    }
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
                                    if (tabconf.Id == 'tab2' || tabconf.Id == 'tab5') {
                                        document.location = "/StockMg/MixVouchMakeUp?id=" + gmvid + "&type=014&optab="+tabconf.Id;
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

                        if (tabconf.Id == 'tab5') {
                            $('#' + tabconf.Id).find('#mvtransprint').on('click', function () {
                                var objtarget = this;
                                panelLoading(objtarget);
                                var host = document.location.host;
                                var s = document.createElement("script");
                                s.type = "text/javascript";
                                s.src = 'http://' + host + '/Scripts/vendors/pdfmake/vfs_fonts.js';
                                var head = document.getElementsByTagName("head")[0];
                                var flag = false;
                                $.each(head.children, function (k, v) {
                                    if (v.tagName == 'SCRIPT' && v.src.indexOf('vfs_fonts.js') >= 0) {
                                        flag = true;
                                    }
                                })
                                if (!flag) {
                                    head.appendChild(s);
                                    if (document.all) {
                                        s.onreadystatechange = function () {
                                            if (s.readyState == 'loaded' || s.readyState == 'complete') {
                                                printtransvouch(tabconf, objtarget);
                                            }
                                        }
                                    } else {
                                        s.onload = function () {
                                            printtransvouch(tabconf, objtarget);
                                        }
                                    }
                                } else {
                                    setTimeout(function () {
                                        printtransvouch(tabconf, objtarget);
                                    }, 100);
                                }
                            })
                        }

                        if (tabconf.Id == 'tab2') {
                            $('#' + tabconf.Id).find('#mvplanprint').on('click', function () {
                                var objtarget = this;
                                panelLoading(objtarget);
                                var host = document.location.host;
                                var s = document.createElement("script");
                                s.type = "text/javascript";
                                s.src = 'http://' + host + '/Scripts/vendors/pdfmake/vfs_fonts.js';
                                var head = document.getElementsByTagName("head")[0];
                                var flag = false;
                                $.each(head.children, function (k, v) {
                                    if (v.tagName == 'SCRIPT' && v.src.indexOf('vfs_fonts.js') >= 0) {
                                        flag = true;
                                    }
                                })
                                if (!flag) {
                                    head.appendChild(s);
                                    if (document.all) {
                                        s.onreadystatechange = function () {
                                            if (s.readyState == 'loaded' || s.readyState == 'complete') {
                                                printplanvouch(tabconf, objtarget);
                                            }
                                        }
                                    } else {
                                        s.onload = function () {
                                            printplanvouch(tabconf, objtarget);
                                        }
                                    }
                                } else {
                                    setTimeout(function () {
                                        printplanvouch(tabconf, objtarget);
                                    }, 100);
                                }
                            })
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
                break;
            case 'vouchlist':
                var tableid = tabconf.Id + 'table';
                $('#' + tabconf.Id).append('<table id="' + tableid + '" class="table table-border table-bordered table-bg table-striped display responsive nowrap"></table>');
                var head = $('<thead><tr></tr></thead>');
                $.each(tabconf.vouchfields, function (key, val) {
                    if (val.istable !== undefined && val.istable === true) {
                        head.children('tr').append('<th>' + val.label + '</th>');
                    }
                })
                $('#' + tableid).append(head);
                        
                tfields = [];
                $.each(tabconf.vouchfields, function (key, val) {
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

                tabconf.voucheditor = new $.fn.dataTable.Editor({
                    table: "#" + tableid,
                    ajax: tabconf.vouchurl
                });

                var strdom = "<'row'<'col-sm-4'B><'col-sm-4'><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>";
                var strbuttons = [
                    {
                        extend: "customButton",
                        text: "添加",
                        action: function (e, dt, node, config) {
                            document.location = "/StockMg/ProductInStock?type=006&sid=" + mvid + "&optab=" + tabconf.Id;
                        }
                    },
                    {
                        extend: "selected",
                        text: "编辑",
                        action: function (e, dt, node, config) {
                            var rows = dt.rows({ selected: true });
                            var selmvid = rows.data()[0].DT_RowId.replace('row_','');
                            document.location = "/StockMg/ProductInStock?id=" + selmvid + "&type=006&sid=" + mvid + "&optab=" + tabconf.Id;
                        }
                    },
                    {
                        extend: "remove",
                        editor: tabconf.voucheditor,
                        formMessage: function (e, dt) {
                            var rows = dt.rows(e.modifier()).data()[0];
                            return '您确定要删除单据: '+rows.Vouch.Code+' 吗？';
                        }
                    }
                ]
                        
                tabconf.vouchtable = $('#' + tableid)
                    .DataTable({
                        dom: strdom,
                        processing: true,
                        serverSide: true,
                        autoWidth: false,
                        ajax: {
                            url: tabconf.vouchurl,
                            type: "POST"
                        },
                        columns: tfields,
                        select: 'single',
                        buttons: strbuttons,
                        searchCols: [
                            { search: "='" + tabconf.vchtype + "'" },
                            { search: "='" + tabconf.bstype + "'" },
                            { search: "='" + mvid + "'" }
                        ],
                        pageLength: -1,
                        columnDefs: [{ targets: [0,1,2], visible: false }],
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

                tabconf.vouchtable.on('select', function (e, dt, type, indexes) {
                    if (dt.rows(indexes).data()[0].Vouch.IsVerify == true) {
                        dt.button(2).disable();
                    } else {
                        dt.button(2).enable();
                    }
                })

                $('#' + tableid).on('click', 'button#btnvouchs', tabconf.voucheditor, function (e) {
                    var vid = $(this).data('id').replace('row_', '');
                    if (vid == '') {
                        addUIAlter('nav.breadcrumb', '单据标识错误，无法获取单据明细', 'error');
                    } else {
                        var currow = $(this).closest('tr');
                        if ($('#trdetail-' + vid).length > 0) {
                            $('#trdetail-' + vid).remove();
                            return false;
                        }
                        $.ajax({
                            type:"POST",
                            url: "/api/Editor/Data?model=Vouchs",
                            data: {
                                draw: 1,
                                columns: [
                                    {
                                        data: 'Vouchs.VouchId',
                                        name: '',
                                        searchable: true,
                                        orderable: true,
                                        search: { value: '='+vid, regex: false }
                                    }
                                ],
                                order: [
                                    { column: 0, dir: 'asc' }
                                ],
                                start: 0,
                                length: -1,
                                search: { value: '', regex: false }
                            },
                            dataType: 'json',
                            success: function (json) {
                                if (json.data == undefined || json.data.length == 0) {
                                    currow.after('<tr id="trdetail-'+vid+'" class="trdetailtable"><td colspan="9" class="text-c bg-black-lighter c-white">无单据明细数据</td></tr>');
                                } else {
                                    var detailtable = '<table id="table-' + vid + '" class="table table-bordered radius table-detail-default">' +
                                        '<thead><th>存货</th><th>计量单位</th><th>数量</th><th>批号</th><th>生产日期</th><th>过期日期</th>';
                                    if ($('#gparamisloctor').val() == 'true') {
                                        detailtable += '<th>货位</th>';
                                    }
                                    detailtable += '</thead><tbody>';
                                    $.each(json.data, function (key, val) {
                                        var uom = val.UOM.Name !== null ? val.UOM.Name : '';
                                        var mddate = val.Vouchs.MadeDate !== null ? val.Vouchs.MadeDate : '';
                                        var invdate = val.Vouchs.InvalidDate !== null ? val.Vouchs.InvalidDate : '';
                                        var toloc = val.ToLocator.Name !== null ? val.ToLocator.Name : '';
                                        var fromloc = val.FromLocator.Name !== null ? val.FromLocator.Name : '';
                                        var batch = val.Vouchs.Batch !== null ? val.Vouchs.Batch : '';
                                        detailtable += '<tr><td>' + val.Inventory.Name + '</td>' +
                                            '<td>' + uom + '</td>' +
                                            '<td>' + val.Vouchs.Num + '</td>'+
                                            '<td>' + batch + '</td>' +
                                            '<td>' + mddate + '</td>' +
                                            '<td>' + invdate + '</td>';
                                        if ($('#gparamisloctor').val() == 'true') {
                                            detailtable += '<td>' + toloc + '</td>';
                                        }
                                        detailtable += '</tr>';
                                    })
                                    detailtable += '</tbody></table>';
                                    currow.after('<tr id="trdetail-' + vid + '" class="trdetailtable"><td colspan="9" class="text-c">' + detailtable + '</td></tr>');
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
                    }
                })
                break;
            case "vouchgallery":
                $.ajax({
                    type: "POST",
                    url: tabconf.vouchurl,
                    data: reqdata,
                    dataType: 'json',
                    success: function (jsonlink) {
                        if (jsonlink.data == undefined || jsonlink.data.length == 0) {
                            $('#' + tabconf.Id).addClass('tabempty');
                            var strempty = '';
                            if (mvid == '0') {
                                strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>生产计划单未创建</h1></div>' +
                                    '<div class="col-sm-12 text-c emptycontent">生产计划单暂未生成，请在"叫货汇总"中选择关联叫货单，并创建生产计划单。</div>';
                            } else {
                                strempty = '<div class="col-sm-12 text-c emptytitle"><h1><i class="iconfont icon-jinzhi c-warning"></i>无叫货调拨单</h1></div>' +
                                    '<div class="col-sm-12 text-c emptycontent">该生产计划单未关联任何叫货单，请在"叫货汇总"中选择关联叫货单。</div>';
                            }
                            $('#' + tabconf.Id).append(strempty);
                            return false;
                        }
                        var gydata = {};
                        var hasverify = false;
                        $.each(jsonlink.data, function (k, v) {
                            var vouchtmp = [];
                            if (v.TransVouch.IsVerify=='true') {
                                hasverify = true;
                            }
                            if (gydata[v.TransVouch.MakeDate] !== undefined) {
                                gydata[v.TransVouch.MakeDate].push({
                                    Id: v.TransVouch.Id,
                                    Code: v.Vouch.Code,
                                    transCode: v.TransVouch.Code,
                                    whname: v.Warehouse.Name,
                                    isverify: v.TransVouch.IsVerify,
                                })
                            } else {
                                gydata[v.TransVouch.MakeDate] = [];
                                gydata[v.TransVouch.MakeDate].push({
                                    Id: v.TransVouch.Id,
                                    Code: v.Vouch.Code,
                                    transCode: v.TransVouch.Code,
                                    whname: v.Warehouse.Name,
                                    isverify: v.TransVouch.IsVerify,
                                })
                            }
                        })
                        if (hasverify) {
                            if (!$('#tab3').find('div.group3').hasClass('hide')) {
                                $('#tab3').find('div.group3').addClass('hide')
                            }
                        }
                        var gyoptions = $('<div id="options" class="mb-10">' +
                            '<span class="gallery-option-set" id="filter" data-option-key="filter">' +
                            '<a href="#show-all" class="btn btn-default btn-xs active" data-option-value="*">全部</a>'+
                            '</span></div>');
                        var gylist = $('<div id="gallery" class="gallery"></div>');
                        $.each(gydata, function (k, v) {
                            gyoptions.children('span').append('<a href="#gygroup' + k + '" class="btn btn-default btn-xs" data-option-value="gygroup' + k + '">' + k + '</a>');
                            $.each(v, function (kk, vv) {
                                var vchstable = '<div class="image-dept">叫货仓库：' + vv.whname + '</div>';
                                vchstable += '<div class="image-code">叫货单号：' + vv.Code + '</div>';
                                vchstable += '<div class="image-code">调拨单号：' + vv.transCode + '</div>';
                                if (vv.isverify == true) {
                                    vchstable += '<div class="image-vefiry">状态：已审核</div>'
                                } else {
                                    vchstable += '<div class="image-vefiry">状态：<span class="badge badge-danger radius">未审核</span></div>'
                                }
                                var gyone = '<div class="image gygroup' + k + ' col-sm-6 col-md-4 col-lg-3">';
                                if (vv.isverify == true) {
                                    gyone += '<div class="image-info bg-grey-darker"><a href="javascript:;" class="redito" data-id="' + vv.Id + '">' + vchstable + '</a></div></div>';
                                } else {
                                    gyone += '<div class="image-info bg-purple-lighter"><a href="javascript:;" class="redito" data-id="' + vv.Id + '">' + vchstable + '</a></div></div>';
                                }
                                gylist.append(gyone);
                            })
                        })
                        $('#' + tabconf.Id).append(gyoptions).append(gylist);
                        var i = $("#options .gallery-option-set"), s = i.find("a");
                        s.click(function () {
                            var t = $(this);
                            if (t.hasClass("active")) {
                                return false
                            }
                            var n = t.parents(".gallery-option-set");
                            n.find(".active").removeClass("active");
                            t.addClass("active");
                            var i = n.attr("data-option-key");
                            var s = t.attr("data-option-value");
                            s = s === "false" ? false : s;
                            $("#gallery").children().each(function (key, val) {
                                if (s == '*') {
                                    $(val).removeClass('hide');
                                } else {
                                    if (!$(val).hasClass(s)) {
                                        $(val).addClass('hide');
                                    } else {
                                        $(val).removeClass('hide');
                                    }
                                }
                            })
                            return false;
                        })
                        $('#gallery').find('a.redito').click(function () {
                            $('#rootwizard').find("a[href*='tab5']").data('id', $(this).data('id')).trigger('click');
                        })
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
                createPanelContent(val, gmvid, null);
                break;
            case "tab2":
                reqdata = {
                    draw: 1,
                    columns: [
                        {
                            data: 'DT_RowId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + gmvid, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: 1,
                    search: { value: '', regex: false }
                };
                createPanelContent(val, gmvid, reqdata);
                break;
            case 'tab4':
                reqdata = {
                    draw: 1,
                    columns: [
                        {
                            data: 'VouchLink.SourceId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + gmvid, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: -1,
                    search: { value: '', regex: false }
                }
                createPanelContent(val, gmvid, reqdata);
            default:
                reqdata = null;
                break;
        }
    })

    $('#rootwizard').bootstrapWizard({
        onTabClick: function (tab, navigation, org, target, litab) {
            if (target == 4) {
                var transid = $(litab).find("a[href*='tab5']").data('id');
                if (transid == '' || transid == '0' || transid == undefined) {
                    addUIAlter('nav.breadcrumb', '请选择调拨列表中需要审核的调拨单', 'error');
                    $('#rootwizard').find("a[href*='tab4']").trigger('click');
                    return false;
                }
            } else {
                $('#rootwizard').find("a[href*='tab5']").data('id', '0');
            }
        },
        onPrevious: function (tab, navigation, index) {
            if (index == 4) {
                var transid = $('#rootwizard').find("a[href*='tab5']").data('id');
                if (transid == '' || transid == '0' || transid == undefined) {
                    addUIAlter('nav.breadcrumb', '请选择调拨列表中需要审核的调拨单', 'error');
                    $('#rootwizard').find("a[href*='tab4']").trigger('click');
                    return false;
                }
            } else {
                $('#rootwizard').find("a[href*='tab5']").data('id', '0');
            }
        },
        onNext: function (tab, navigation, index) {
            if (index == 4) {
                var transid = $('#rootwizard').find("a[href*='tab5']").data('id');
                if (transid == '' || transid == '0' || transid == undefined) {
                    addUIAlter('nav.breadcrumb', '请选择调拨列表中需要审核的调拨单', 'error');
                    $('#rootwizard').find("a[href*='tab4']").trigger('click');
                    return false;
                }
            } else {
                $('#rootwizard').find("a[href*='tab5']").data('id', '0');
            }
        },
        onTabShow: function (tab, navigation, index) {
            var transid = $('#rootwizard').find("a[href*='tab5']").data('id');
            if (index == 4 && transid != '0') {
                $('#tab5').empty();
                var reqdata = {
                    draw: 1,
                    columns: [
                        {
                            data: 'DT_RowId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + transid, regex: false }
                        },
                        {
                            data: 'Vouch.VouchType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + wizsteps.tab5.vchtype, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: 1,
                    search: { value: '', regex: false }
                };
                createPanelContent(wizsteps.tab5, gmvid, reqdata);
            }
        }
    });

    if ($('#optab').val() != '') {
        if ($('#optab').val() == 'tab5') {
            $('#rootwizard').find("a[href*='tab4']").trigger('click');
        } else {
            $('#rootwizard').find("a[href*='" + $('#optab').val() + "']").trigger('click');
        }
    }

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
                if (tabconf.Id == 'tab3') {
                    tabconf.vouchstable.button(0).disable();
                    tabconf.vouchstable.button(3).disable();
                }
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
                if (tabconf.Id == 'tab3') {
                    tabconf.vouchstable.buttons(0).enable();
                    tabconf.vouchstable.button(3).enable();
                }
                break;
            default:
                break;
        }
    }
})