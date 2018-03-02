var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportgoodstoppanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportGoodsTopQuery",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype: "goodstop"
};

var g_fields = [
    {
        label: "商品ID",
        name: "tbConsItemOther.vcGoodsId",
        istable: true
    }, {
        label: "商品类型",
        name: "InvCategory.Name",
        istable: true
    }, {
        label: "商品名称",
        name: "Inventory.Name",
        istable: true
    }, {
        label: "销售数量",
        name: "tbConsItemOther.SaleCount",
        istable: true
    }, {
        label: "销售金额",
        name: "tbConsItemOther.nFee",
        istable: true
    }, {
        label: "门店",
        name: "tbConsItemOther.vcDeptId",
        istable: true,
        istablehide: true,
        type: "select",
        searchidx: 5
    }, {
        label: "日期",
        name: "tbConsItemOther.dtConsDate",
        istable: true,
        istablehide: true,
        type: "datetimebetween",
        searchidx: 6
    }
];