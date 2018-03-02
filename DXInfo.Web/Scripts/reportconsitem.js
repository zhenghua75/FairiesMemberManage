var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportconsitempanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportConsItem",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        },
        {
            extend: 'excel',
            text: '导出',
            action: function (e, dt, button, config) {
                var reqdata = dt.ajax.params();
                reqdata.length = -1;
                $.ajax({
                    url: "/api/Editor/Data?model=ReportConsItem",
                    dataType: 'json',
                    method: 'POST',
                    data: reqdata,
                    success: function (json) {
                        var data = {};
                        data.header = ['流水', '会员姓名', '会员类型', '会员卡号', '商品名称', '单价', '数量', '合计', '付款类型', '备注', '有效状态', '消费日期', '操作员', '门店'];
                        data.body = [];
                        var asstype = '';
                        var pttype = '';
                        var cflag = '';
                        $.each(json.data, function (k, v) {
                            data.body[k] = [];
                            asstype = '';
                            pttype = '';
                            cflag = '';
                            data.body[k][0] = { type: 'string', value: v.tbConsItemOther.iSerial };
                            data.body[k][1] = { type: 'string', value: v.tbAssociator.vcAssName };
                            $.each(json.options['tbAssociator.vcAssType'], function (kk, vv) {
                                if (v.tbAssociator.vcAssType == vv.value) {
                                    asstype = vv.label;
                                    return false;
                                }
                            })
                            data.body[k][2] = { type: 'string', value: asstype };
                            data.body[k][3] = { type: 'string', value: v.tbConsItemOther.vcCardID };
                            data.body[k][4] = { type: 'string', value: v.Inventory.Name };
                            data.body[k][5] = { type: 'number', value: v.tbConsItemOther.nPrice };
                            data.body[k][6] = { type: 'number', value: v.tbConsItemOther.iCount };
                            data.body[k][7] = { type: 'number', value: v.tbConsItemOther.nFee };
                            $.each(json.options['tbBillOther.vcConsType'], function (kk, vv) {
                                if (v.tbBillOther.vcConsType == vv.value) {
                                    pttype = vv.label;
                                    return false;
                                }
                            })
                            data.body[k][8] = { type: 'string', value: pttype };
                            data.body[k][9] = { type: 'string', value: v.tbConsItemOther.vcComments };
                            $.each(json.options['tbConsItemOther.cFlag'], function (kk, vv) {
                                if (v.tbConsItemOther.cFlag == vv.value) {
                                    cflag = vv.label;
                                    return false;
                                }
                            })
                            data.body[k][10] = { type: 'string', value: cflag };
                            data.body[k][11] = { type: 'string', value: v.tbConsItemOther.dtConsDate };
                            data.body[k][12] = { type: 'string', value: v.tbConsItemOther.vcOperName };
                            data.body[k][13] = { type: 'string', value: v.Depts.Name };
                        })
                        data.footer = [];
                        config.customtoaction(data, config);
                    }
                })
            }
        }
    ]
};

var g_fields = [
    {
        label: "流水",
        name: "tbConsItemOther.iSerial",
        istable: true,
        searchidx: 0,
        searchcond:"="
    }, {
        label: "会员名称",
        name: "tbAssociator.vcAssName",
        istable: true,
        searchidx: 1,
        searchcond: "%"
    }, {
        label: "会员类型",
        name: "tbAssociator.vcAssType",
        istable: true,
        searchidx: 2,
        type: "select",
        render: function (val, type, row, dt) {
            var opts = dt.settings.json.options['tbAssociator.vcAssType'];
            var newval = '';
            $.each(opts, function (k, v) {
                if (val == v.value) {
                    newval = v.label;
                    return false;
                }
            })
            return newval;
        }
    }, {
        label: "会员卡号",
        name: "tbConsItemOther.vcCardID",
        istable: true,
        searchidx: 3,
        searchcond: "="
    }, {
        label: "商品名称",
        name: "Inventory.Name",
        istable: true,
        searchable: false,
        orderable:false
    }, {
        label: "单价",
        name: "tbConsItemOther.nPrice",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "数量",
        name: "tbConsItemOther.iCount",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "合计",
        name: "tbConsItemOther.nFee",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "付款类型",
        name: "tbBillOther.vcConsType",
        istable: true,
        searchidx: 8,
        type: "select",
        render: function (val, type, row, dt) {
            var opts = dt.settings.json.options['tbBillOther.vcConsType'];
            var newval = '';
            $.each(opts, function (k, v) {
                if (val == v.value) {
                    newval = v.label;
                    return false;
                }
            })
            return newval;
        }
    }, {
        label: "备注",
        name: "tbConsItemOther.vcComments",
        istable: true,
        orderable: false
    }, {
        label: "有效状态",
        name: "tbConsItemOther.cFlag",
        istable: true,
        searchidx: 10,
        type: "select",
        render: function (val, type, row, dt) {
            var opts = dt.settings.json.options['tbConsItemOther.cFlag'];
            var newval = '';
            $.each(opts, function (k, v) {
                if (val == v.value) {
                    newval = v.label;
                    return false;
                }
            })
            return newval;
        }
    }, {
        label: "消费日期",
        name: "tbConsItemOther.dtConsDate",
        istable: true,
        searchidx: 11,
        type: "datetimebetween"
    }, {
        label: "操作员",
        name: "tbConsItemOther.vcOperName",
        istable: true,
        searchidx: 12,
        type: "select"
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true,
        searchable: false
    }, {
        label: "门店",
        name: "tbConsItemOther.vcDeptID",
        istable: true,
        istablehide: true,
        searchidx: 14,
        type: "select"
    }
];