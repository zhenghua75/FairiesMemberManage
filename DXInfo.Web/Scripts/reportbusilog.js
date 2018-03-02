var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportbusilogpanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportBusiLogQuery",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ]
};

var g_fields = [
    {
        label: "流水",
        name: "tbBusiLogOther.iSerial",
        istable: true
    }, {
        label: "会员名称",
        name: "tbAssociator.vcAssName",
        istable: true
    }, {
        label: "会员类型",
        name: "NameCodeAT.Name",
        istable: true
    }, {
        label: "会员卡号",
        name: "tbBusiLogOther.vcCardID",
        istable: true,
        searchidx: 3,
        searchcond: "="
    }, {
        label: "操作类型",
        name: "NameCodeOP.Name",
        istable: true
    }, {
        label: "操作类型",
        name: "tbBusiLogOther.vcOperType",
        istable: true,
        searchidx: 5,
        type: "select",
        istablehide:true
    }, {
        label: "操作员",
        name: "tbBusiLogOther.vcOperName",
        istable: true
    }, {
        label: "操作员",
        name: "tbBusiLogOther.vcOperName",
        istable: true,
        searchidx: 7,
        type: "select",
        istablehide:true
    }, {
        label: "操作日期",
        name: "tbBusiLogOther.dtOperDate",
        istable: true,
        searchidx: 8,
        type: "datetimebetween"
    }, {
        label: "操作门店",
        name: "Depts.Name",
        istable: true
    }, {
        label: "操作门店",
        name: "tbBusiLogOther.vcDeptID",
        istable: true,
        searchidx: 10,
        type: "select",
        istablehide:true
    }, {
        label: "备注",
        name: "tbBusiLogOther.vcComments",
        istable: true
    }
];