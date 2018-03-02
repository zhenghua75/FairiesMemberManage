function getfields(opers) {
    var tfields = [];
    tfields[0] = {
        data: 'item',
        orderable: false
    }
    for (var i = 0; i < opers.length; i++) {
        tfields[i+1] = {
            data: opers[i].id,
            orderable: false
        }
    }
    return tfields;
}

function gettabedata(opers,data) {
    var newdata = [];
    newdata[0] = { itemtype: 'CradRoll', item: '回收卡数', field: 'ConsCount' };
    newdata[1] = { itemtype: 'CradRoll', item: '回收退款金额', field: 'ConsFee' };
    newdata[2] = { itemtype: 'Fill', item: '现金充值次数', field: 'ConsCount' };
    newdata[3] = { itemtype: 'Fill', item: '现金充值金额', field: 'ConsFee' };
    newdata[4] = { itemtype: 'FillBank', item: '银行卡充值次数', field: 'ConsCount' };
    newdata[5] = { itemtype: 'FillBank', item: '银行卡充值金额', field: 'ConsFee' };
    newdata[6] = { itemtype: 'PT001', item: '消费次数', field: 'ConsCount' };
    newdata[7] = { itemtype: 'PT001', item: '会员消费金额', field: 'ConsFee' };
    newdata[8] = { itemtype: 'PT002', item: '现金零售金额', field: 'ConsFee' };
    newdata[9] = { itemtype: 'PT003', item: '积分兑换次数', field: 'ConsCount' };
    newdata[10] = { itemtype: 'PT003', item: '积分兑换', field: 'ConsFee' };
    newdata[11] = { itemtype: 'PT004', item: '赠送次数', field: 'ConsCount' };
    newdata[12] = { itemtype: 'PT004', item: '赠送金额', field: 'ConsFee' };
    newdata[13] = { itemtype: 'PT005', item: '门店报损次数', field: 'ConsCount' };
    newdata[14] = { itemtype: 'PT005', item: '门店报损金额', field: 'ConsFee' };
    newdata[15] = { itemtype: 'PT006', item: '门店品尝次数', field: 'ConsCount' };
    newdata[16] = { itemtype: 'PT006', item: '门店品尝金额', field: 'ConsFee' };
    newdata[17] = { itemtype: 'PT007', item: '门店退货次数', field: 'ConsCount' };
    newdata[18] = { itemtype: 'PT007', item: '门店退货金额', field: 'ConsFee' };
    newdata[19] = { itemtype: 'PT008', item: '银行卡零售金额', field: 'ConsFee' };
    newdata[20] = { itemtype: 'Cash', item: '现金总额', field: 'ConsFee' };

    $.each(opers, function (k, v) {
        $.each(newdata, function (kk, vv) {
            newdata[kk][v.id] = '';
        })
    })

    $.each(data, function (k, v) {
        $.each(newdata, function (kk, vv) {
            if (vv.itemtype == v.Cons.vcConsType) {
                if (vv.field == 'ConsFee') {
                    var fee = Math.round(v['Cons'][vv.field]*100)/100;
                    newdata[kk][v.operid] = fee;
                } else {
                    newdata[kk][v.operid] = v['Cons'][vv.field];
                }
            }
        })
    })

    $.each(data, function (k, v) {
        if (v.Cons.vcConsType == 'PT002') {
            if (newdata[6][v.operid] == '') {
                newdata[6][v.operid] = v.Cons.ConsCount;
            } else {
                newdata[6][v.operid] = parseInt(v.Cons.ConsCount) + parseInt(newdata[6][v.operid]);
            }
        }
    })

    $.each(opers, function (k, v) {
        var cash = newdata[3][v.id] + newdata[8][v.id] + newdata[1][v.id];
        newdata[20][v.id] = Math.round(cash*100)/100;
    })
    return newdata;
}

$(document).ready(function () {
    var table = null;
    function drawtable(reqdata) {
        panelLoading($('div.panel-body'));
        $.ajax({
            type: "POST",
            url: "/api/Editor/Data?model=ReportDailyCashQuery",
            data: reqdata,
            dataType: 'json',
            success: function (json) {
                if (json.data == undefined) {
                    panelLoaded($('div.panel-body'));
                    addUIAlter('nav.breadcrumb', '获取数据错误', 'error');
                    return false;
                }
                panelLoaded($('div.panel-body'));
                if (table != null) {
                    table.clear();
                    table.destroy();
                }

                if ($('#consdept').children().length == 0) {
                    var selecttmp = json.options['Cons.vcDeptId'];
                    $('#consdept').empty();
                    $('#consdept').append('<option value="0">所有门店</option>');
                    $.each(selecttmp, function (i, d) {
                        $('#consdept').append('<option value="' + d.value + '">' + d.label + '</option>');
                    });
                }

                if ($('#consopername').children().length == 0) {
                    selecttmp = json.options['Cons.vcOperName'];
                    $('#consopername').empty();
                    $('#consopername').append('<option value="0">所有操作员</option>');
                    $.each(selecttmp, function (i, d) {
                        $('#consopername').append('<option value="' + d.value + '">' + d.label + '</option>');
                    });
                }

                var tablefields = [];
                var tablenewdata = [];
                if (json.data.length == 0) {
                    tablefields[0] = {
                        data: 'item',
                        orderable:false
                    }
                } else {
                    var operlist = [];
                    $.each(json.data, function (k, v) {
                        var flag = false;
                        $.each(operlist, function (kk, vv) {
                            if (v.Cons.vcOperName == vv.name) {
                                flag = true;
                                json.data[k].operid=vv.id;
                                return false;
                            }
                        })
                        if (!flag) {
                            var operid='oper' + operlist.length;
                            operlist.push({ id: operid, name: v.Cons.vcOperName });
                            json.data[k].operid=operid;
                        }
                    })
                    tablefields = getfields(operlist);
                    tablenewdata = gettabedata(operlist, json.data);
                }

                $('#dailycashtable thead tr').empty();
                $('#dailycashtable thead tr').append('<th>统计项</th>');
                $.each(operlist, function (k, v) {
                    $('#dailycashtable thead tr').append('<th>' + v.name+ '</th>');
                })

                table = $('#dailycashtable').DataTable({
                    dom: "<'row'<'col-sm-4'B><'col-sm-4'><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'><'col-sm-8'>>",
                    autoWidth: false,
                    data: tablenewdata,
                    columns: tablefields,
                    select: 'single',
                    ordering:false,
                    buttons: [
                        {
                            extend: "customButton",
                            text: "查找",
                            action: function (e, dt, node, config) {
                                $('#searchModal').modal('show');
                            }
                        }
                    ],
                    pageLength:-1,
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
            },
            error: function (e) {
                panelLoaded($('div.panel-body'));
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

    $('#begindate').datetimepicker({
        format: "yyyy-mm-dd",
        minView: "month",
        todayHighlight: true,
        autoclose: true
    })
    $('#enddate').datetimepicker({
        format: "yyyy-mm-dd",
        minView: "month",
        todayHighlight: true,
        autoclose: true
    })
    $('#begindate').val(moment().format('YYYY-MM-DD'));
    $('#enddate').val(moment().format('YYYY-MM-DD'));

    var reqdata = {
        draw: 1,
        columns: [
            {
                data: 'Cons.vcOperName',
                name: '',
                searchable: true,
                orderable: true,
                search: { value: '', regex: false }
            }, {
                data: 'Cons.vcDeptId',
                name: '',
                searchable: true,
                orderable: true,
                search: { value: '=0', regex: false }
            }, {
                data: 'Cons.dtConsDate',
                name: '',
                searchable: true,
                orderable: true,
                search: { value: "='1900-01-01'", regex: false }
            }
        ],
        order: [
            { column: 0, dir: 'asc' }
        ],
        start: 0,
        length: 1,
        search: { value: '', regex: false }
    };
    drawtable(reqdata);

    $('#searchModalBtn').click(function () {
        var deptid = $('#consdept').val();
        var opername = $('#consopername').val();
        var begdate = $('#begindate').val();
        var endate = $('#enddate').val();
        if (begdate == '' || begdate == null || endate == '' || endate == null) {
            addUIAlter('nav.breadcrumb', '请选择查找日期', 'error');
            return false
        }
        if (deptid == '' || deptid == '0') {
            deptid = '';
        } else {
            deptid = "='" + deptid + "'";
        }
        if (opername == '' || opername == '0') {
            opername = '';
        } else {
            opername = "='" + opername + "'";
        }

        var dtConsDate = "between '" + begdate + "' and '" + endate + " 23:59:59'";
        var reqdata = {
            draw: 1,
            columns: [
                {
                    data: 'Cons.vcOperName',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: opername, regex: false }
                }, {
                    data: 'Cons.vcDeptId',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: deptid, regex: false }
                }, {
                    data: 'Cons.dtConsDate',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: dtConsDate, regex: false }
                }
            ],
            order: [
                { column: 0, dir: 'asc' }
            ],
            start: 0,
            length: -1,
            search: { value: '', regex: false }
        };
        drawtable(reqdata);
        $('#searchModal').modal('hide');
    })
})