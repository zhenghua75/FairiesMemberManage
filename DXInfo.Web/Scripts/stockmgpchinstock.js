var vouchfields = [
    {
        label: "入库单号",
        name: "Vouch.Code",
        isdisabled: true
    }, {
        label: "入库日期",
        name: "Vouch.VouchDate",
        type: "datetime",
        issubmit: true,
        format: 'YYYY-MM-DD'
    }, {
        label: "仓库",
        name: "Vouch.ToWhId",
        type: "select",
        issubmit: true,
        isdisabled: true
    }, {
        label: "供应商",
        name: "Vouch.VenId",
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
        label: "单价",
        name: "Vouchs.Price",
        istable: true,
        iseditor: true,
        issubmit: true,
        errorinfo: '请输入单价'
    }, {
        label: "金额",
        name: "Vouchs.Amount",
        istable: true
    }, {
        label: "批号",
        name: "Vouchs.Batch",
        istable: true,
        iseditor: true,
        issubmit: true,
        errorinfo: '请输入批号'
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
var mvseditor = null;
var table = null;
var vouchorgdata = null;
$(document).ready(function () {
    var curmvid = $('#curmvid').val();
    var curmvtype = $('#curmvtype').val();

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

    function printvouch(objtarget) {
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
        $.each(table.ajax.json().data, function (k, v) {
            data.body[k] = [];
            var invname = v.Inventory.Name;
            var length = parseInt(invname.length / 7)+1;
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

        var vouchdatatmp = vouchorgdata.data[0];
        var strdate = vouchdatatmp.Vouch.VouchDate == null ? '' : vouchdatatmp.Vouch.VouchDate;
        var strMemo = vouchdatatmp.Vouch.Memo == null ? '' : vouchdatatmp.Vouch.Memo;
        var strprinttime = moment().format('YYYY-MM-DD hh:mm:ss');
        var doc = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [30, 40, 30, 40],
            content: [
                { text: '采购入库单', style: 'title' },
                {
                    columns: [
                        {
                            text: "单 据 号: " + vouchdatatmp.Vouch.Code,
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
                            text: "仓     库: " + vouchdatatmp.InWarehouse.Name,
                            style: 'tableinfo'
                        },
                        {
                            text: "供 应  商: " + vouchdatatmp.Vendor.Name,
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
                font: 'msyh',
                columnGap: 10
            }
        };

        //if (config.customize) {
        //    config.customize(doc, config);
        //}

        var pdf = window.pdfMake.createPdf(doc).print();
        panelLoaded(objtarget);
    }

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
                if (!$('div.group1').hasClass('hide')) {
                    $('div.group1').addClass('hide')
                }
                if (!$('div.group2').hasClass('hide')) {
                    $('div.group2').addClass('hide')
                }
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
                $(inputtmp).attr('disabled',true);
            }
            
            if (vouchfields.length % 3 == 1 && i == vouchfields.length-1) {
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
        var eletable = $('#stockmgpchinstock');
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

        mvseditor = new $.fn.dataTable.Editor({
            table: "#stockmgpchinstock",
            fields: efields,
            ajax: {
                create: function (method, url, data, successCallback, errorCallback) {
                    var vouchid = $('#curmvid').val();
                    var vouchtype = $('#curmvtype').val();
                    if (vouchid == '0') {
                        var reqmvdata = {
                            action: "create",
                            data: {}
                        };
                        var datatmp = {};
                        datatmp.Vouch = {
                            VouchType: vouchtype,
                            BusType: '001'
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
                        reqmvdata.data[0] = datatmp;

                        $.ajax({
                            url: "/api/Editor/Data?model=Vouch&VouchType=" + vouchtype,
                            dataType: 'json',
                            method: 'POST',
                            data: reqmvdata,
                            success: function (jsonmv) {
                                if (jsonmv.fieldErrors && jsonmv.fieldErrors.length > 0) {
                                    $.each(jsonmv.fieldErrors, function (key, val) {
                                        addUIAlter('nav.breadcrumb', '字段：' + val.name + '，错误：' + val.status, 'error');
                                    });
                                    mvseditor.close();
                                    return false;
                                } else if (jsonmv.error) {
                                    addUIAlter('nav.breadcrumb', jsonmv.error, 'error');
                                    mvseditor.close();
                                    return false;
                                }
                                var newvid = jsonmv.data[0].DT_RowId.replace('row_', '');
                                $('#curmvid').val(newvid);
                                var reqmvsdata = {
                                    action: "create",
                                    data: {}
                                };
                                var datatmp = { Vouchs: { VouchId: newvid } };
                                $.each(vouchsfields, function (k, v) {
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
                                    url: "/api/Editor/Data?model=Vouchs",
                                    data: reqmvsdata,
                                    dataType: "json"
                                })
                                .done(function (json) {
                                    successCallback(json);
                                    document.location = "/StockMg/PurchaseInStock?id=" + newvid + '&type=' + vouchtype;
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
                                mvseditor.close();
                                return false;
                            }
                        });
                    } else {
                        var reqmvsdata = {
                            action: "create",
                            data: {}
                        };
                        vouchid = vouchid.replace('row_', '');
                        var datatmp = { Vouchs: { VouchId: vouchid } };
                        $.each(vouchsfields, function (k, v) {
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
                            url: "/api/Editor/Data?model=Vouchs",
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
                        url: "/api/Editor/Data?model=Vouchs",
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
                remove: "/api/Editor/Data?model=Vouchs"
            }
        });

        mvseditor.on('preSubmit', function (e, o, action) {
            if (action != 'remove') {
                var iserror = false;
                $.each(efields, function (k, v) {
                    if (v.errorinfo !== undefined) {
                        var field = mvseditor.field(v.name);
                        if (!field.val() && !$(field.input()).val()) {
                            field.error(v.errorinfo);
                            iserror = true;
                        }
                        if (v.type == 'datetime') {
                            var dateformat = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/;
                            if (!dateformat.test($(field.input()).val())) {
                                field.error('日期格式应为yyyy-mm-dd');
                                iserror = true;
                            }
                        }
                    }
                })
                
                if (!iserror) {
                    if (action == 'create') {
                        var existdata = table.ajax.json().data;
                        var flag = false;
                        $.each(existdata, function (k, v) {
                            if (o.data[0].Vouchs.InvId == v.Vouchs.InvId) {
                                if (o.data[0].Vouchs.Batch !== undefined && o.data[0].Vouchs.Batch == v.Vouchs.Batch) {
                                    if (o.data[0].Vouchs.MadeDate !== undefined && o.data[0].Vouchs.MadeDate == v.Vouchs.MadeDate && o.data[0].Vouchs.InvalidDate == v.Vouchs.InvalidDate) {
                                        flag = true;
                                        iserror = true;
                                        return false;
                                    }
                                }
                            }
                        })
                        if (flag) {
                            mvseditor.field('Vouchs.InvId').error('该单据中已经存在相同的存货记录');
                        }
                    }
                }

                if (iserror) {
                    return false;
                }
            }
        })

        mvseditor.on('initCreate', function (e, tr, data) {
            var inputtmp = mvseditor.field('Vouchs.InvId').input();
            inputtmp.attr('disabled', false);
            mvseditor.field('Vouchs.Batch').val(mvseditor.field('Vouchs.MadeDate').val().replace(/-/g, ''));
        })

        mvseditor.on('initEdit', function (e, tr, data) {
            var inputtmp = mvseditor.field('Vouchs.InvId').input();
            inputtmp.attr('disabled', true);
        })

        table = $('#stockmgpchinstock')
            .on('preXhr.dt', function (e, settings, json) {
                if (json.search.value != '') {
                    json.search.value = "like '%" + json.search.value + "%'";
                }
            })
            .DataTable({
                dom: "<'row'<'col-sm-4'B><'col-sm-4'><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
                processing: true,
                serverSide: true,
                autoWidth: false,
                ajax: {
                    url: "/api/Editor/Data?model=Vouchs",
                    type: "POST"
                },
                columns: tfields,
                select: 'single',
                buttons: [
                    {
                        extend: "create",
                        editor: mvseditor,
                        action: function () {
                            mvseditor.create({
                                title: '<h3>添加新记录</h3>',
                                buttons: {
                                    label: '添加',
                                    fn: function (e) {
                                        this.submit(null, null, null, false);
                                        table.button(0).trigger();
                                    }
                                }
                            });
                        }
                    },
                    { extend: "edit", editor: mvseditor },
                    { extend: "remove", editor: mvseditor }
                ],
                searchCols: [
                    { search: "='" + curmvid + "'" }
                ],
                pageLength: -1,
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

        var invidnode = mvseditor.field('Vouchs.InvId').input();
        $(invidnode).on('change', function () {
            var invopts = table.ajax.json().options['Vouchs.InvId'];
            var curselectinvid = $(this).val();
            for (var i = 0; i < invopts.length; i++) {
                if (invopts[i].value == curselectinvid) {
                    mvseditor.field('Inventory.Specs').val(invopts[i].label.Specs);
                    mvseditor.field('UOM.Name').val(invopts[i].label.StockUOMName);
                    if (invopts[i].label.IsShelfLife == true) {
                        var today = new Date();
                        mvseditor.field('Vouchs.MadeDate').set(today);
                        switch (invopts[i].label.ShelfLifeType) {
                            case 0:
                                var newday = new Date();
                                newday.setDate(newday.getDate() + invopts[i].label.ShelfLife);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                            case 1:
                                var newday = new Date();
                                newday.setDate(newday.getDate() + invopts[i].label.ShelfLife*7);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                            case 2:
                                var newday = new Date();
                                newday.setMonth(newday.getMonth() + invopts[i].label.ShelfLife);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                            case 3:
                                var newday = new Date();
                                newday.setYear(newday.getFullYear() + invopts[i].label.ShelfLife);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                        }
                    }
                    break;
                }
            }
        })

        var madedatenode = mvseditor.field('Vouchs.MadeDate').input();
        $(madedatenode).on('focus', function () {
            var invopts = table.ajax.json().options['Vouchs.InvId'];
            var curselectinvid = $(mvseditor.field('Vouchs.InvId').input()).val();
            for (var i = 0; i < invopts.length; i++) {
                if (invopts[i].value == curselectinvid) {
                    if (invopts[i].label.IsShelfLife == true) {
                        var madedate = mvseditor.field('Vouchs.MadeDate').val();
                        var newday = new Date(madedate);
                        switch (invopts[i].label.ShelfLifeType) {
                            case 0:
                                newday.setDate(newday.getDate() + invopts[i].label.ShelfLife);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                            case 1:
                                newday.setDate(newday.getDate() + invopts[i].label.ShelfLife * 7);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                            case 2:
                                newday.setMonth(newday.getMonth() + invopts[i].label.ShelfLife);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                            case 3:
                                newday.setYear(newday.getFullYear() + invopts[i].label.ShelfLife);
                                mvseditor.field('Vouchs.InvalidDate').set(newday);
                                break;
                        }
                    }
                    break;
                }
            }
        })
    }

    function checkMvControlDis(mod) {
        switch(mod){
            case '0':
                if ($('div.group1').hasClass('hide')) {
                    $('div.group1').removeClass('hide')
                }
                if (!$('div.group2').hasClass('hide')) {
                    $('div.group2').addClass('hide')
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
                if (!$('div.group1').hasClass('hide')) {
                    $('div.group1').addClass('hide')
                }
                if (!$('div.group2').hasClass('hide')) {
                    $('div.group2').addClass('hide')
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
                if ($('div.group1').hasClass('hide')) {
                    $('div.group1').removeClass('hide')
                }
                if (!$('div.group2').hasClass('hide')) {
                    $('div.group2').addClass('hide')
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

    $('#mvedit').on('click', function () {
        checkMvControlDis('1');
        if(!$('#mvverify').hasClass('disabled')){
            $('#mvverify').addClass('disabled')
        }
        if (!$('#mvunverify').hasClass('disabled')) {
            $('#mvunverify').addClass('disabled')
        }
    })

    $('#mvunsave').on('click', function () {
        for (var i = 0; i < vouchfields.length; i++) {
            var fieldsp = vouchfields[i].name.split('.');
            var fieldvalue = vouchorgdata.data.length == 0 ? '' : vouchorgdata.data[0][fieldsp[0]][fieldsp[1]];
            var inputtmp = $('#formmv').find('#DTE_Field_' + vouchfields[i].name.replace('.', '-'));
            $(inputtmp).val(fieldvalue);
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
        checkMvControlDis('0');
    })

    $('#mvsave').on('click', function () {
        var vouchid = $('#curmvid').val();
        var vouchtype = $('#curmvtype').val();
        if (vouchid != '0') {
            var reqmvdata = {
                action: "edit",
                data: {}
            };
            var datatmp = {};
            datatmp.Vouch = {
                VouchType: vouchtype,
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
            reqmvdata.data['row_' + vouchid] = datatmp;
            var objtarget = this;
            panelLoading(objtarget);
            $.ajax({
                url: "/api/Editor/Data?model=Vouch&VouchType="+vouchtype,
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
                    checkMvControlDis('0');
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
            url: "/api/Editor/Data?model=Vouch&VouchType="+vouchtype,
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

    $('#mvprint').on('click', function () {
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
                        printvouch(objtarget);
                    }
                }
            } else {
                s.onload = function () {
                    printvouch(objtarget);
                }
            }
        } else {
            printvouch(objtarget);
        }
        panelLoaded(objtarget);
    })
});