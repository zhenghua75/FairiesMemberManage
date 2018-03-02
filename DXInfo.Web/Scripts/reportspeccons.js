var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportspecconspanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportSpecConsQuery",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"speccons"
};

var g_fields = [
    {
        label: "特殊消费类型",
        name: "tbBillOther.vcConsType",
        searchidx: 0,
        type: "select",
        istable: true,
        istablehide:true
    }, {
        label: "日期",
        name: "tbBillOther.dtConsDate",
        searchidx: 1,
        type: "datetimebetween",
        istable: true,
        istablehide: true
    }, {
        label: "操作员",
        name: "tbBillOther.vcOperName",
        searchidx: 2,
        type: "select",
        istable: true,
        istablehide: true
    }, {
        label: "门店",
        name: "tbBillOther.vcDeptId",
        searchidx: 3,
        type: "select",
        istable: true,
        istablehide: true
    }, {
        label: "特殊消费类型",
        name: "NameCodePT.Name",
        istable: true
    }, {
        label: "商品名称",
        name: "Inventory.Name",
        istable: true
    }, {
        label: "数量",
        name: "tbConsItemOther.tolCount",
        istable: true
    }, {
        label: "销售金额",
        name: "tbConsItemOther.tolfee",
        istable: true,
        render: function (val, type, row) {
            return Math.round(val * 100) / 100;
        }
    }, {
        label: "现金",
        name: "tbConsItemOther.tolcash",
        istable: true,
        render: function (val, type, row) {
            return Math.round(val * 100) / 100;
        }
    }
];