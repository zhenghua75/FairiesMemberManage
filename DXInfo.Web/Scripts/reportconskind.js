var createtabledata = function (json) {
    var newdata = [];
    for (var i = 0; i < json.data.length; i++) {
        var dataone = json.data[i];
        if (dataone.Cons.tolcount == '' || dataone.Cons.tolcount == null) {
            dataone.Cons.tolcount = 0;
        }
        if (dataone.Cons.tolfee == '' || dataone.Cons.tolfee == null) {
            dataone.Cons.tolfee = 0;
        }
        newdata.push(dataone);
    }
    return newdata;
}

var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportconskindpanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=ReportConsKindQuery",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    datasrccallback: createtabledata,
    reporttype:"conskind"
};

var g_fields = [
    {
        label: "门店",
        name: "Cons.vcDeptId",
        istable: true,
        searchidx: 0,
        type: "select",
        istablehide: true,
        hascheck: true
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true
    }, {
        label: "会员类型",
        name: "Cons.vcAssType",
        istable: true,
        searchidx: 2,
        type: "select",
        hascheck: true,
        istablehide: true
    }, {
        label: "会员类型",
        name: "NameCodeAT.Name",
        istable: true
    }, {
        label: "商品类型",
        name: "Cons.vcGoodsType",
        istable: true,
        searchidx: 4,
        type: "select",
        hascheck: true,
        istablehide: true
    }, {
        label: "商品类型",
        name: "InvCategory.Name",
        istable: true
    }, {
        label: "商品名称",
        name: "Cons.vcGoodsName",
        istable: true,
        searchidx: 6,
        hascheck: true
    }, {
        label: "数量合计",
        name: "Cons.tolcount",
        istable: true
    }, {
        label: "金额合计",
        name: "Cons.tolfee",
        istable: true
    }, {
        label: "消费日期",
        name: "Cons.dtConsDate",
        istable: true,
        searchidx: 9,
        istablehide: true,
        type: "datetimebetween"
    }
];