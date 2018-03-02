var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportintegrallogpanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportIntegralLog",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype: "integlog"
};

var g_fields = [
    {
        label: "流水",
        name: "tbIntegralLogOther.iSerial",
        istable: true
    }, {
        label: "会员卡号",
        name: "tbIntegralLogOther.vcCardId",
        istable: true,
        searchidx: 1,
        searchcond: "="
    }, {
        label: "积分类型",
        name: "tbIntegralLogOther.vcIgType",
        istable: true,
        type: "select",
        render: function (val, type, row, dt) {
            var opts = dt.settings.json.options['tbIntegralLogOther.vcIgType'];
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
        label: "上次积分",
        name: "tbIntegralLogOther.iIgLast",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "变动积分",
        name: "tbIntegralLogOther.iIgGet",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "到达积分",
        name: "tbIntegralLogOther.iIgArrival",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "操作日期",
        name: "tbIntegralLogOther.dtIgDate",
        istable: true,
        orderable: false,
        searchidx: 6,
        type:"datetimebetween"
    }, {
        label: "操作员",
        name: "tbIntegralLogOther.vcOperName",
        istable: true,
        orderable: false
    }, {
        label: "备注",
        name: "tbIntegralLogOther.vcComments",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true,
        searchable: false,
        orderable: false
    }
];