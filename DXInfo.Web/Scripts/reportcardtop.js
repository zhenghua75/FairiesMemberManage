var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportcardtoppanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportCardTopQuery",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"cardtop"
};

var g_fields = [
    {
        label: "会员卡号",
        name: "tbConsItemOther.vcCardID",
        istable: true
    }, {
        label: "会员名称",
        name: "tbAssociator.vcAssName",
        istable: true
    }, {
        label: "消费额",
        name: "tbConsItemOther.SaleFee",
        istable: true
    }, {
        label: "日期",
        name: "tbConsItemOther.dtConsDate",
        searchidx: 3,
        type: "datetimebetween",
        istable: true,
        istablehide: true
    }, {
        label: "门店",
        name: "tbConsItemOther.vcDeptId",
        searchidx: 4,
        type: "select",
        istable: true,
        istablehide: true
    }
];