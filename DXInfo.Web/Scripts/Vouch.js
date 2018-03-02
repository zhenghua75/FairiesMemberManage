var searchcol = [];
var tableajaxurl = "/api/Editor/Data?model=Vouch";
var vouchoperurl = "/Home/Error";
var tabletrans = null;
switch ($('#vtype').val()) {
    case "001":
        searchcol.push({ search: "='001'" });
        searchcol.push({ search: "='001'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=001";
        vouchoperurl = "/StockMg/PurchaseInStock";
        break;
    case "002":
        searchcol.push({ search: "='002'" });
        searchcol.push({ search: "='002'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=002";
        vouchoperurl = "/StockMg/SaleOutStock";
        break;
    case "006":
        searchcol.push({ search: "='006'" });
        searchcol.push({ search: "='011'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=006";
        vouchoperurl = "/StockMg/ProductInStock";
        break;
    case "012":
        searchcol.push({ search: "='012'" });
        searchcol.push(null);
        searchcol.push({ search: "="+$('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=012";
        vouchoperurl = "/StockMg/MixVouch";
        break;
    case "005":
        searchcol.push({ search: "='005'" });
        searchcol.push({ search: "='010'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=005";
        vouchoperurl = "/StockMg/MaterialOutStock";
        break;
    case "003":
        searchcol.push({ search: "='003'" });
        searchcol.push({ search: "='005'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=003";
        vouchoperurl = "/StockMg/OtherInStock";
        break;
    case "004":
        searchcol.push({ search: "='004'" });
        searchcol.push({ search: " in('008','009','017','019','020','021','022')" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=004";
        vouchoperurl = "/StockMg/OtherOutStock";
        break;
    case "009":
        searchcol.push({ search: "='009'" });
        searchcol.push({ search: "in('015','016') and (Vouch.ToWhId='" + $('#gparamuserwhid').val() + "' or Vouch.FromWhId='" + $('#gparamuserwhid').val() + "')" });
        tableajaxurl += "&VouchType=009";
        vouchoperurl = "/StockMg/TransVouch";
        break;
    case "010":
        searchcol.push({ search: "='010'" });
        searchcol.push({ search: "" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=010";
        vouchoperurl = "/StockMg/CheckVouch";
        break;
    case "011":
        searchcol.push({ search: "='011'" });
        searchcol.push({ search: "" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=011";
        vouchoperurl = "/StockMg/AdjustLocatorVouch";
        break;
    case "013":
        searchcol.push({ search: "='013'" });
        searchcol.push({ search: "" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=013";
        vouchoperurl = "/StockMg/MonthBalance";
        break;
    case "014":
        searchcol.push({ search: "='014'" });
        searchcol.push({ search: "" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=014";
        vouchoperurl = "/StockMg/MixVouchMakeUp";
        break;
    case "007":
        searchcol.push({ search: "='007'" });
        searchcol.push({ search: "='012'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=007";
        vouchoperurl = "/StockMg/InitStock";
        break;
    case "016":
        searchcol.push({ search: "='016'" });
        searchcol.push({ search: "" });
        searchcol.push({ search: "=" +$('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=016";
        vouchoperurl = "/StockMg/DeptCheckVouch";
        break;
    case "015":
        searchcol.push({ search: "='015'" });
        searchcol.push({ search: "='018'" });
        searchcol.push({ search: "=" + $('#gparamuserwhid').val() });
        tableajaxurl += "&VouchType=015";
        vouchoperurl = "/StockMg/RetailOutStock";
        break;
    default:
        document.location = "/Home/Error";
        break;
}

var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'stockmgvouch',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: tableajaxurl,
            type: "POST"
        },
        editorajax: tableajaxurl,
        tablebuttons: [
            {
                extend: "customButton",
                text: "添加",
                action: function (e, dt, node, config) {
                    document.location = vouchoperurl + "?type=" + $('#vtype').val();
                }
            },
            {
                extend: "selected",
                text: "编辑",
                action: function (e, dt, node, config) {
                    var rows = dt.rows({ selected: true });
                    var selmvid = rows.data()[0].DT_RowId;
                    var sourceid = rows.data()[0].Vouch.SourceId;
                    var vtype=rows.data()[0].Vouch.VouchType;
                    var btype=rows.data()[0].Vouch.BusType;
                    selmvid = selmvid.replace('row_', '');
                    if (selmvid == '') {
                        addUIAlter('nav.breadcrumb', '单据标识错误，无法获取单据明细', 'error');
                    } else {
                        if (vtype == '009' && btype == '016') {
                            document.location = vouchoperurl + "?id=" + selmvid + "&type=" + $('#vtype').val() +"&sid="+sourceid;
                        } else if (vtype == '006' && sourceid!=null) {
                            document.location = vouchoperurl + "?id=" + selmvid + "&type=" + $('#vtype').val() + "&sid=" + sourceid;
                        } else {
                            document.location = vouchoperurl + "?id=" + selmvid + "&type=" + $('#vtype').val();
                        }
                    }
                }
            },
            {
                extend: "remove",
                editor: 0,
                formMessage: function (e, dt) {
                    var rows = dt.rows(e.modifier()).data()[0];
                    if (rows.Vouch.IsVerify == true) {
                        return '要删除的单据已经审核，不能删除。';
                    } else {
                        return '您确定要删除单据: '+rows.Vouch.Code+' 吗？';
                    }
                }
            },
            {
                extend: "customButton",
                text: "查找",
                action: function (e, dt, node, config) {
                    $('#searchModal').modal('show');
                }
            }
        ],
        order: [[6, 'desc'],[5, 'desc']],
        searchcols: searchcol,
        columndefs: [{targets:[0,1,2,3,4],visible:false}],
        tableevent: [
            {
                event: "click",
                selector: "button#btnvouchs",
                fn: function (e) {
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
                                        '<thead><th>存货</th><th>规格型号</th><th>计量单位</th><th>数量</th>';
                                    if ($('#vtype').val() == '001' || $('#vtype').val() == '003' || $('#vtype').val() == '015') {
                                        detailtable += '<th>单价</th><th>金额</th>';
                                    }
                                    if ($('#vtype').val() != '012' && $('#vtype').val() != '014') {
                                        detailtable += '<th>批号</th><th>生产日期</th><th>过期日期</th>';
                                    }
                                    if ($('#gparamisloctor').val() == 'true') {
                                        if ($('#vtype').val() == '011') {
                                            detailtable += '<th>调整前货位</th><th>调整后货位</th>';
                                        } else if ($('#vtype').val() != '012' && $('#vtype').val() != '014') {
                                            detailtable += '<th>货位</th>';
                                        }
                                    }
                                    detailtable += '<th>行备注</th></thead><tbody>';
                                    $.each(json.data, function (key, val) {
                                        var specs = val.Inventory.Specs !== null ? val.Inventory.Specs : '';
                                        var uom = val.UOM.Name !== null ? val.UOM.Name : '';
                                        var memo = val.Vouchs.Memo !== null ? val.Vouchs.Memo : '';
                                        var mddate = val.Vouchs.MadeDate !== null ? val.Vouchs.MadeDate : '';
                                        var invdate = val.Vouchs.InvalidDate !== null ? val.Vouchs.InvalidDate : '';
                                        var toloc = val.ToLocator.Name !== null ? val.ToLocator.Name : '';
                                        var fromloc = val.FromLocator.Name !== null ? val.FromLocator.Name : '';
                                        var batch = val.Vouchs.Batch !== null ? val.Vouchs.Batch : '';
                                        detailtable += '<tr><td>' + val.Inventory.Name + '</td>' +
                                            '<td>' + specs + '</td>' +
                                            '<td>' + uom + '</td>' +
                                            '<td>' + val.Vouchs.Num + '</td>';
                                        if ($('#vtype').val() == '001' || $('#vtype').val() == '003'|| $('#vtype').val() == '015') {
                                            detailtable += '<td>' + val.Vouchs.Price + '</td>' +
                                                '<td>' + val.Vouchs.Amount + '</td>';
                                        }
                                        if ($('#vtype').val() != '012' && $('#vtype').val() != '014') {
                                            detailtable += '<td>' + batch + '</td>' +
                                                '<td>' + mddate + '</td>' +
                                                '<td>' + invdate + '</td>';
                                        }
                                        if ($('#gparamisloctor').val() == 'true') {
                                            if ($('#vtype').val() == '011') {
                                                detailtable += '<td>' + fromloc + '</td><td>' + toloc + '</td>';
                                            } else if ($('#vtype').val() != '012' && $('#vtype').val() != '014') {
                                                detailtable += '<td>' + toloc + '</td>';
                                            }
                                        }
                                        detailtable += '<td>' + memo + '</td></tr>';
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
                }
            }
        ],
        tableapievent:[
            {
                event: "select",
                fn: function (e, dt, type, indexes) {
                    dt.button(2).enable();
                    if (dt.rows(indexes).data()[0].Vouch.IsVerify == true && dt.rows(indexes).data()[0].Vouch.VouchType != '015') {
                        dt.button(2).disable();
                    }
                    if (dt.rows(indexes).data()[0].Vouch.VouchType == '009') {
                        if (dt.rows(indexes).data()[0].Vouch.SourceId != '' && dt.rows(indexes).data()[0].Vouch.SourceId != null) {
                            dt.button(2).disable();
                        }
                    }
                    if (dt.rows(indexes).data()[0].Vouch.VouchType == '004') {
                        var bustype = dt.rows(indexes).data()[0].Vouch.BusType;
                        if (bustype == '020' || bustype == '021' || bustype == '022') {
                            dt.button(2).disable();
                        }
                    }
                    if (dt.rows(indexes).data()[0].Vouch.VouchType == '015') {
                        dt.button(1).disable();
                    }
                }
            }
        ],
        editorevent: [
            {
                event: "preSubmit",
                fn: function (e, o, action) {
                    if (action == 'remove') {
                        var flag = false;
                        $.each(o.data, function (k, v) {
                            if (v.Vouch.IsVerify == true) {
                                flag = true;
                                return false;
                            }
                        })
                        if (flag) {
                            this.close();
                            return false;
                        }
                    }
                }
            },
            {
                event: "open",
                fn: function (e, display, action) {
                    if (action == 'remove') {
                        var index = e.target.modifier()[0];
                        if (e.target.modifier().data()[index].Vouch.IsVerify == true) {
                            $(e.target.dom.footer).find('button').addClass('hide');
                        }
                    }
                }
            }
        ]
    }
];

//if ($('#vtype').val() == '009') {
//    g_table[0].tablebuttons.push({
//        extend: 'collection',
//        text: '导出',
//        buttons: [
//            'print',
//            'pdf',
//            'excel'
//        ]
//    });
//}

var g_fields = [
    {
        label: "单据类型",
        name: "Vouch.VouchType",
        istable: true
    }, {
        label: "业务类型",
        name: "Vouch.BusType",
        istable: true
    }, {
        label: "转入仓库",
        name: "Vouch.ToWhId",
        istable: true
    }, {
        label: "转出仓库",
        name: "Vouch.FromWhId",
        istable: true
    }, {
        label: "业务类型",
        name: "Vouch.BusType",
        istable: true,
        render: function (val, type, row) {
            var disval = '';
            switch (val) {
                case '008':
                    disval = '不合格品';
                    break;
                case '009':
                    disval = '其它出库';
                    break;
                case '017':
                    disval = '运输损耗';
                    break;
                case '015':
                    disval = '普通调拨';
                    break;
                case '016':
                    disval = '叫货调拨';
                    break;
                case '019':
                    disval = '仓库损耗';
                    break;
                case '020':
                    disval = '门店报损';
                    break;
                case '021':
                    disval = '门店退货';
                    break;
                case '022':
                    disval = '门店品尝';
                    break;
                case '023':
                    disval = '产成品';
                    break;
                case '024':
                    disval = '半成品';
                    break;
                case '025':
                    disval = '原材料';
                    break;
                default:
                    break;
            }
            return disval;
        }
    }, {
        label: "入库单号",
        name: "Vouch.Code",
        istable: true,
        searchidx: 5
    }, {
        label: "日期",
        name: "Vouch.VouchDate",
        istable: true,
        searchidx: 6,
        type:"datetimebetween"
    }, {
        label: "转出仓库",
        name: "OutWarehouse.Name",
        istable: true
    }, {
        label: "转入仓库",
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
        render:function(val,type,row){
            return val == true ? '已审核' : '';
        }
    }
];



function getMixMakeUpStatus(row) {
    if (row.Vouch.IsVerify == true) {
        var sourceid = row.DT_RowId.replace('row_', '');
        $.ajax({
            url: "/api/Editor/Data?model=VouchLink",
            dataType: 'json',
            method: 'POST',
            data: {
                draw: 1,
                columns: [
                    {
                        data: 'VouchLink.SourceId',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=' + sourceid, regex: false }
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
                var tdstatus = $('#' + row.DT_RowId).children('td').children('div.dotting');
                if (json.data === undefined || json.data.length == 0) {
                    tdstatus.removeClass();
                    tdstatus.html('未关联叫货单');
                    $('#' + row.DT_RowId).addClass('unfinal');
                } else {
                    var istrans = true;
                    var isotherin = true;
                    $.each(json.data, function (k, v) {
                        if (v.TransVouch.IsVerify == false) {
                            istrans = false;
                        }
                        if (v.OtherInStock.IsVerify == false) {
                            isotherin = false;
                        }
                    })
                    if (istrans == true && isotherin==true) {
                        tdstatus.removeClass();
                        tdstatus.html('已完结');
                    } else if (istrans == true && isotherin == false) {
                        tdstatus.removeClass();
                        tdstatus.html('待收货');
                        $('#' + row.DT_RowId).addClass('unfinal');
                    } else if (istrans == false) {
                        tdstatus.removeClass();
                        tdstatus.html('待发货');
                        $('#' + row.DT_RowId).addClass('unfinal');
                    }
                }
            },
            error: function (json) {
                var tdstatus = $('#' + row.DT_RowId).children('td').children('div.dotting');
                tdstatus.removeClass();
                tdstatus.html('状态错误');
                $('#' + row.DT_RowId).addClass('unfinal');
            }
        })
        return '<div class="dotting"></div>';
    } else {
        return '未审核';
    }
}

function getTransStatus(row) {
    if (row.Vouch.IsVerify == true) {
        var sourceid = row.DT_RowId.replace('row_', '');
        $.ajax({
            url: "/api/Editor/Data?model=Vouch&VouchType=003",
            dataType: 'json',
            method: 'POST',
            data: {
                draw: 1,
                columns: [
                    {
                        data: 'Vouch.VouchType',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: "=003", regex: false }
                    },
                    {
                        data: 'Vouch.SourceId',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=' + sourceid, regex: false }
                    }
                ],
                order: [
                    { column: 0, dir: 'asc' }
                ],
                start: 0,
                length: 1,
                search: { value: '', regex: false }
            },
            success: function (json) {
                var tdstatus = $('#' + row.DT_RowId).children('td').children('div.dotting');
                if (json.data === undefined || json.data.length == 0) {
                    tdstatus.removeClass();
                    tdstatus.html('未审核');
                } else {
                    if (json.data[0].Vouch.IsVerify == true) {
                        tdstatus.removeClass();
                        tdstatus.html('已完成');
                    } else {
                        tdstatus.removeClass();
                        tdstatus.html('待收货');
                    }
                }
            },
            error: function (json) {
                var tdstatus = $('#' + row.DT_RowId).children('td').children('div.dotting');
                tdstatus.removeClass();
                tdstatus.html('状态错误');
            }
        })
        return '<div class="dotting"></div>';
    } else {
        return '未审核';
    }
}

switch ($('#vtype').val()) {
    case "001":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide=true;
            }
        })
        break;
    case "002":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '转出仓库';
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '出库单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
        })
        break;
    case "006":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
        })
        break;
    case "012":
        $.each(g_fields, function (k, v) {
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '叫货仓库';
            }
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].label = '生产仓库';
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '叫货单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
        })
        g_fields.push({
            label: "流程状态",
            name: "DT_RowId",
            istable: true,
            searchidx: 11,
            type:"select",
            options: [
                { label: '未完结', value: 'unfinal' },
                { label: '已完结', value: 'final' }
            ],
            searchable:false,
            orderable:false,
            render: function (val, type, row) {
                if (row.Vouch.IsVerify == false) {
                    return '待审核';
                } else if (row.TransVouch.IsVerify == false && row.VouchLink.SourceId == null) {
                    return '待生产';
                } else if (row.TransVouch.IsVerify == false && row.VouchLink.SourceId != null) {
                    return '生产中';
                } else if (row.TransVouch.IsVerify == true && row.OtherInStock.IsVerify == false) {
                    return '待收货';
                } else if (row.TransVouch.IsVerify == true && row.OtherInStock.IsVerify == true) {
                    return '已完结';
                } else {
                    return '无';
                }
            }
        });
        break;
    case "005":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '转出仓库';
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '出库单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
        })
        break;
    case "003":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
        })
        break;
    case "004":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '出库单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '转出仓库';
            }
            if (v.name == 'Vouch.BusType' && k==1) {
                g_fields[k].searchidx=1;
                g_fields[k].iseditor=true;
                g_fields[k].type="select";
                g_fields[k].search = "in('008','017','009','019','020','021','022')";
                g_fields[k].options = [
                    { label: "不合格品", value: '008' },
                    { label: "运输损耗", value: '017' },
                    { label: "其它出库", value: '009' },
                    { label: "仓库损耗", value: '019' },
                    { label: "门店报损", value: '020' },
                    { label: "门店退货", value: '021' },
                    { label: "门店品尝", value: '022' }
                ];
            }
        })
        g_table[0].columndefs = [{ targets: [0, 1, 2, 3], visible: false }];
        break;
    case "009":
        $.each(g_fields, function (k, v) {
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '调拨单号';
            }
            if (v.name == 'Vouch.BusType' && k == 1) {
                g_fields[k].searchidx = 1;
                g_fields[k].iseditor = true;
                g_fields[k].type = "select";
                g_fields[k].search = "in('015','016')";
                g_fields[k].options = [
                    { label: "普通调拨", value: '015' },
                    { label: "叫货调拨", value: '016' }
                ];
            }
        })
        g_fields.push({
            label: "流程状态",
            name: "DT_RowId",
            istable: true,
            searchable: false,
            orderable: false,
            render: function (val, type, row) {
                return getTransStatus(row);
            }
        });
        g_table[0].columndefs = [{ targets: [0, 1, 2, 3], visible: false }];
        break;
    case "010":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '盘点单号';
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '仓库';
            }
        })
        break;
    case "011":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '仓库';
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
        })
        //g_fields.push(getWFStatusField('003', null));
        break;
    case "013":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '仓库';
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
        })
        var period={
            label: "周期",
            name: "CheckPeriod.Code",
            istable: true
        };
        g_fields.splice(7, 0, period);
        break;
    case "014":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '仓库';
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
        })
        g_fields.push({
            label: "流程状态",
            name: "DT_RowId",
            istable: true,
            searchable: false,
            orderable: false,
            render: function (val, type, row) {
                return getMixMakeUpStatus(row);
            }
        });
        break;
    case "007":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
        })
    case "016":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '盘点单号';
                }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '仓库';
            }
        })
        g_table[0].columndefs = [{ targets: [0, 1, 2, 3], visible: false }];
        break;
    case "015":
        $.each(g_fields, function (k, v) {
            if (v.name == 'OutWarehouse.Name') {
                g_fields[k].istablehide = true;
            }
            if (v.name == 'Vouch.Code') {
                g_fields[k].label = '出库单号';
            }
            if (v.name == 'Vouch.VouchDate') {
                g_fields[k].label = '日期';
            }
            if (v.name == 'InWarehouse.Name') {
                g_fields[k].label = '转出仓库';
            }
        })
        g_table[0].columndefs = [{ targets: [0, 1, 2, 3, 4], visible: false }];
        var newbuttons = [];
        for (var i = 1; i < g_table[0].tablebuttons.length; i++) {
            newbuttons.push(g_table[0].tablebuttons[i]);
        }
        g_table[0].tablebuttons = newbuttons;
        break;
}

var strmemo = {
    label: "备注",
    name: "Vouch.Memo",
    istable: true,
    iseditor: true
};
var strdetail = {
    label: "单据明细",
    name: "DT_RowId",
    istable: true,
    searchable: false,
    orderable: false,
    render: function (val, type, row) {
        var content = '<button class="btn btn-warning radius size-MINI" id="btnvouchs" data-id="' + val + '">明细</button>';
        return content;
    }
};
g_fields.push(strdetail);
g_fields.push(strmemo);

if ($('#vtype').val() == '014') {
    $(document).ready(function () {
        var whid = $('#gparamuserwhid').val();
        var timeline = $('<ul class="timeline"></ul>');
        var datetmp = new Date();
        var today = datetmp.getFullYear() + '-' + (datetmp.getMonth() + 1) + '-' + datetmp.getDate();
        datetmp = new Date(datetmp.getFullYear(), datetmp.getMonth(), datetmp.getDate() - 6);
        var firstday = datetmp.getFullYear() + '-' + (datetmp.getMonth() + 1) + '-' + datetmp.getDate();
        var makedate = "between '" + firstday + "' and '" + today + " 23:59:59'";

        function timelineerror() {
            return '<li>' +
                '<div class="timeline-icon">' +
                '<a href="javascript:;"><i class="fa fa-spinner"></i></a>' +
                '</div>' +
                '<div class="timeline-body">' +
                '加载待处理的叫货单时出错。' +
                '</div>' +
                '</li>' +
                '<li>' +
                '<div class="timeline-icon">' +
                '<a href="javascript:;"><i class="fa fa-spinner"></i></a>' +
                '</div>' +
                '<div class="timeline-body">' +
                '已经到底了' +
                '</div>' +
                '</li>';
        }

        function loadmixtrans(objmixvouch) {
            var mixvid = objmixvouch.DT_RowId.replace('row_', '');
            if (objmixvouch.VouchLink.SourceId == null && objmixvouch.TransVouch.IsVerify == false) {
                var header = $('#tlin-' + mixvid).find('.timeline-header');
                strbtn = '<a href="/StockMg/TransVouch?id=' + objmixvouch.TransVouch.Id + '&type=009&sid=' + mixvid + '" class="btn btn-primary size-MINI f-r">直接出库</a>';
                strbtn += '<a href="/StockMg/MixVouchMakeUp?type=014" class="btn btn-primary size-MINI f-r mr-10">开始生产</a>';
                header.append(strbtn);
            } else if (objmixvouch.VouchLink.SourceId!=null) {
                var header = $('#tlin-' + mixvid).find('.timeline-header');
                strbtn = '<a href="/StockMg/MixVouchMakeUp?id=' + objmixvouch.VouchLink.SourceId + '&type=014" class="btn btn-primary size-MINI f-r">生产计划单</a>';
                header.append(strbtn);
            } else if (objmixvouch.VouchLink.SourceId == null && objmixvouch.TransVouch.IsVerify == true) {
                var header = $('#tlin-' + mixvid).find('.timeline-header');
                strbtn = '<a href="/StockMg/TransVouch?id=' + objmixvouch.TransVouch.Id + '&type=009&sid=' + mixvid + '" class="btn btn-primary size-MINI f-r">调拨单</a>';
                header.append(strbtn);
            }
            var footer = $('#tlin-' + mixvid).find('.timeline-footer');
            footer.append('<small class="ml-15">调拨：' + objmixvouch.TransVouch.Code + '</small>');
        }

        function loadmixvouchs(objmixvouch, mixvouchid) {
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
                            search: { value: '=' + mixvouchid, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'desc' }
                    ],
                    start: 0,
                    length: -1,
                    search: { value: '', regex: false }
                },
                dataType: 'json',
                success: function (jsonmvs) {
                    loadmixtrans(objmixvouch);
                    if (jsonmvs.data == undefined) {
                        $('#line-' + mixvouchid).html('获取单据信息错误');
                        return false;
                    }
                    if (jsonmvs.data.length == 0) {
                        $('#line-' + mixvouchid).removeClass('dotting');
                        $('#line-' + mixvouchid).html('无数据');
                        return false;
                    }
                    var list = $('<table class="table table-border tr-shrink" style="border-top:0"></table>');
                    list.append('<thead><th>存货</th><th>规格型号</th><th>计量单位</th><th>数量</th><th>状态</th></thead>');
                    list.append('<tbody></tbody>');
                    $.each(jsonmvs.data, function (k, v) {
                        var listrow = $('<tr></tr>');
                        var specs = v.Inventory.Specs == null ? '' : v.Inventory.Specs;
                        var dealstatus = '未列入生产';
                        var tdclass = "c-error";
                        if (objmixvouch.VouchLink.SourceId != null) {
                            if (objmixvouch.TransVouch.IsVerify == false) {
                                dealstatus = '正在生产';
                                tdclass = "c-warning";
                            } else if (objmixvouch.TransVouch.IsVerify == true && objmixvouch.OtherInStock.IsVerify == false) {
                                dealstatus = '待收货';
                                tdclass = "c-primary";
                            } else if (objmixvouch.TransVouch.IsVerify == true && objmixvouch.OtherInStock.IsVerify == true) {
                                dealstatus = '已完结';
                                tdclass = "";
                            }
                        } else {
                            if (objmixvouch.TransVouch.IsVerify == true && objmixvouch.OtherInStock.IsVerify == false) {
                                dealstatus = '待收货';
                                tdclass = "c-primary";
                            } else if (objmixvouch.TransVouch.IsVerify == true && objmixvouch.OtherInStock.IsVerify == true) {
                                dealstatus = '已完结';
                                tdclass = "";
                            }
                        }
                        listrow.append('<td>' + v.Inventory.Name + '</td><td>' + specs + '</td><td>' + v.UOM.Name + '</td><td>' + v.Vouchs.Num + '</td><td class="'+tdclass+'">' + dealstatus + '</td>');
                        list.children('tbody').append(listrow);
                    })
                    $('#line-' + mixvouchid).removeClass('dotting');
                    $('#line-' + mixvouchid).html(list);
                    if (jsonmvs.data.length > 3) {
                        $('#line-' + mixvouchid).append('<div class="row text-c"><a href="javascript:;" class="line-exp shrink">--展开--</a></div>');
                        $('#line-' + mixvouchid).find('a.shrink').click(function () {
                            if ($(this).hasClass('shrink')) {
                                $('#line-' + mixvouchid).find('table').removeClass('tr-shrink');
                                $(this).removeClass('shrink');
                                $(this).addClass('expend');
                                $(this).html('--收缩--');
                            } else {
                                $('#line-' + mixvouchid).find('table').addClass('tr-shrink');
                                $(this).addClass('shrink');
                                $(this).removeClass('expend');
                                $(this).html('--展开--');
                            }
                        })
                    }
                },
                error: function (jsonmvs) {
                    $('#line-' + mixvouchid).html('获取单据信息错误');
                }
            })
        }

        function loadpagevouch(beginindex) {
            $.ajax({
                type: "POST",
                url: "/api/Editor/Data?model=Vouch&VouchType=012",
                data: {
                    draw: 1,
                    columns: [
                        {
                            data: 'Vouch.FromWhId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + whid, regex: false }
                        },
                        {
                            data: 'Vouch.VouchType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=012', regex: false }
                        },
                        {
                            data: 'Vouch.MakeTime',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: makedate, regex: false }
                        },
                        {
                            data: 'Vouch.IsVerify',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=1', regex: false }
                        }
                    ],
                    order: [
                        { column: 2, dir: 'desc' }
                    ],
                    start: beginindex,
                    length: 10,
                    search: { value: '', regex: false }
                },
                dataType: 'json',
                success: function (json) {
                    timeline.find('li:last-child').remove();
                    var line = '';
                    if (json.data == undefined) {
                        addUIAlter('nav.breadcrumb', '获取单据错误', 'error');
                        line = timelineerror();
                        timeline.append(line);
                    } else if (json.data.length == 0) {
                        line = '<li>' +
                            '<div class="timeline-icon">' +
                            '<a href="javascript:;"><i class="fa fa-spinner"></i></a>' +
                            '</div>' +
                            '<div class="timeline-body">' +
                            '最近7日内没有需要处理的叫货单' +
                            '</div>' +
                            '</li>';
                        timeline.append(line);
                        line = '<li>' +
                            '<div class="timeline-icon">' +
                            '<a href="javascript:;"><i class="fa fa-spinner"></i></a>' +
                            '</div>' +
                            '<div class="timeline-body">' +
                            '已经到底了' +
                            '</div>' +
                            '</li>';
                        timeline.append(line);
                    } else {
                        var day = new Date();
                        var today = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
                        var lastday = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
                        var yestoday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();
                        $.each(json.data, function (k, v) {
                            var mixmainid = v.DT_RowId.replace('row_', '');
                            var daytmp = new Date(v.Vouch.MakeDate);
                            var makeday = daytmp.getFullYear() + '-' + (daytmp.getMonth() + 1) + '-' + daytmp.getDate();
                            var hourminu = new Date(v.Vouch.MakeTime);
                            var clock = hourminu.getHours() + ':' + hourminu.getMinutes();
                            line = '<li>' +
                                '<div class="timeline-time">';
                            if (today == makeday) {
                                line += '<span class="date">今天</span>';
                            } else if (yestoday == makeday) {
                                line += '<span class="date">昨天</span>';
                            } else {
                                line += '<span class="date">' + makeday + '</span>';
                            }
                            line += '<span class="time">' + clock + '</span>' +
                                '</div>' +
                                '<div class="timeline-icon">' +
                                '<a href="javascript:;"><i class="iconfont icon-shuqian"></i></a>' +
                                '</div>' +
                                '<div class="timeline-body" id="tlin-' + mixmainid + '">' +
                                '<div class="timeline-header">' +
                                '<span class="userimage"><i class="iconfont icon-dianpu"></i></span>' +
                                '<span class="username">' + v.InWarehouse.Name + '</span>'+
                                '</div>' +
                                '<div class="timeline-content dotting" id="line-' + mixmainid + '"></div>' +
                                '<div class="timeline-footer"><small>叫货：' + v.Vouch.Code + '</small></div>' +
                                '</div>' +
                                '</li>';
                            timeline.append(line);
                            loadmixvouchs(v,mixmainid);
                        })

                        if (json.recordsFiltered <= beginindex+10) {
                            line = '<li>' +
                            '<div class="timeline-icon">' +
                            '<a href="javascript:;"><i class="iconfont icon-huanyipi"></i></a>' +
                            '</div>' +
                            '<div class="timeline-body">' +
                            '已经到底了' +
                            '</div>' +
                            '</li>';
                            timeline.append(line);
                        } else {
                            line = $('<li>' +
                            '<div class="timeline-icon">' +
                            '<a href="javascript:;"><i class="iconfont icon-huanyipi"></i></a>' +
                            '</div>' +
                            '<div class="timeline-body">' +
                            '加载更多' +
                            '</div>' +
                            '</li>');
                            timeline.append(line);
                            line.find('a').click(function () {
                                loadpagevouch(beginindex+10);
                            })
                        }
                    }
                    $('#default-tab-1').append(timeline);
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
                    var line = timelineerror();
                    timeline.append(line);
                    $('#default-tab-1').append(timeline);
                }
            })
        }
        
        loadpagevouch(0);
    })
}