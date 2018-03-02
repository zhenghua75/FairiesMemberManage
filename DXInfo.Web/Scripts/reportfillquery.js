var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportfillquerypanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportFillQuery",
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
                    url: "/api/Editor/Data?model=ReportFillQuery",
                    dataType: 'json',
                    method: 'POST',
                    data: reqdata,
                    success: function (json) {
                        var data = {};
                        data.header = ['流水', '会员姓名', '会员类型', '会员卡号', '充值金额', '赠款金额', '上次余额', '当前余额', '备注', '充值日期', '操作员', '操作员门店', '交易类型'];
                        data.body = [];
                        $.each(json.data, function (k, v) {
                            data.body[k] = [];
                            data.body[k][0] = { type: 'string', value: v.tbFillFeeOther.iSerial };
                            data.body[k][1] = { type: 'string', value: v.tbAssociator.vcAssName };
                            data.body[k][2] = { type: 'string', value: v.NameCodeAT.Name };
                            data.body[k][3] = { type: 'string', value: v.tbFillFeeOther.vcCardID };
                            data.body[k][4] = { type: 'number', value: v.tbFillFeeOther.nFillFee };
                            data.body[k][5] = { type: 'number', value: v.tbFillFeeOther.nFillProm };
                            data.body[k][6] = { type: 'number', value: v.tbFillFeeOther.nFeeLast };
                            data.body[k][7] = { type: 'number', value: v.tbFillFeeOther.nFeeCur };
                            data.body[k][8] = { type: 'string', value: v.tbFillFeeOther.vcComments };
                            data.body[k][9] = { type: 'string', value: v.tbFillFeeOther.dtFillDate };
                            data.body[k][10] = { type: 'string', value: v.tbFillFeeOther.vcOperName };
                            data.body[k][11] = { type: 'string', value: v.Depts.Name };
                            data.body[k][12] = { type: 'string', value: v.tbFillFeeOther.vcOperType };
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
        name: "tbFillFeeOther.iSerial",
        istable: true,
        searchidx: 0,
        searchcond: "="
    }, {
        label: "会员名称",
        name: "tbAssociator.vcAssName",
        istable: true,
        searchidx: 1,
        searchcond: "%"
    }, {
        label: "会员类型",
        name: "NameCodeAT.Name",
        istable: true,
        searchable:false
    }, {
        label: "会员类型",
        name: "tbAssociator.vcAssType",
        istable: true,
        searchidx: 3,
        istablehide: true,
        type: "select"
    }, {
        label: "会员卡号",
        name: "tbFillFeeOther.vcCardID",
        istable: true,
        searchidx: 4,
        searchcond: "="
    }, {
        label: "充值金额",
        name: "tbFillFeeOther.nFillFee",
        istable: true,
        searchable: false
    }, {
        label: "赠款金额",
        name: "tbFillFeeOther.nFillProm",
        istable: true,
        searchable: false
    }, {
        label: "上次余额",
        name: "tbFillFeeOther.nFeeLast",
        istable: true,
        searchable: false
    }, {
        label: "当前余额",
        name: "tbFillFeeOther.nFeeCur",
        istable: true,
        searchable: false
    }, {
        label: "备注",
        name: "tbFillFeeOther.vcComments",
        istable: true
    }, {
        label: "充值日期",
        name: "tbFillFeeOther.dtFillDate",
        istable: true,
        searchidx: 10,
        type:"datetimebetween"
    }, {
        label: "操作员",
        name: "tbFillFeeOther.vcOperName",
        istable: true,
        type: "select",
        searchidx: 11
    }, {
        label: "操作员门店",
        name: "Depts.Name",
        istable: true
    }, {
        label: "门店",
        name: "tbFillFeeOther.vcDeptID",
        istable: true,
        type: "select",
        searchidx: 13,
        istablehide: true
    }, {
        label: "交易类型",
        name: "tbFillFeeOther.vcOperType",
        istable: true
    }
];