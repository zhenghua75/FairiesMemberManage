var createtabledata = function (json) {
    var newdata = [];
    if (json.draw == null || json.draw <= 1) {
        return newdata;
    }
    
    var ldata = [];
    var Odata = [];
    var Xdata = [];
    for (var i = 0; i < json.data.length; i++) {
        var lasttype=json.data[i].tbBusiIncomeReport.Type.substr(-2);
        if (lasttype == '-L') {
            ldata.push(json.data[i]);
        } else if (lasttype == '-O') {
            Odata.push(json.data[i]);
        } else if (lasttype == '-X') {
            Xdata.push(json.data[i]);
        } else {
            if (json.data[i].tbBusiIncomeReport.Type == 'Total') {
                var ddata = json.data[i];
                ddata.tbBusiIncomeReport.REP1 = '会员新增：' + ddata.tbBusiIncomeReport.REP1;
                ddata.tbBusiIncomeReport.REP2 = '积分新增：' + ddata.tbBusiIncomeReport.REP2;
                ddata.tbBusiIncomeReport.REP3 = '余额新增：' + ddata.tbBusiIncomeReport.REP3;
                ddata.tbBusiIncomeReport.REP4 = '现金新增：' + ddata.tbBusiIncomeReport.REP4;
                ddata.tbBusiIncomeReport.REP5 = '赠款新增：' + ddata.tbBusiIncomeReport.REP5;
                ddata.tbBusiIncomeReport.REP6 = '销售总额：' + ddata.tbBusiIncomeReport.REP6;
                ddata.tbBusiIncomeReport.REP7 = '商品销量：' + ddata.tbBusiIncomeReport.REP7;
                newdata.push(ddata);
            } else {
                newdata.push(json.data[i]);
            }
        }
    }
    $.merge(newdata, ldata);
    $.merge(newdata, Odata);
    $.merge(newdata, Xdata);
    return newdata;
}

var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportbusiincomepanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'><'col-sm-4'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'><'col-sm-8'>>",
    ajaxurl: "/api/Editor/Data?model=ReportBusiIncome",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    pagelength:-1,
    datasrccallback: createtabledata,
    reporttype: "busiincome"
};

var g_fields = [
    {
        label: "门店",
        name: "tbBusiIncomeReport.vcDeptId",
        searchidx: 0,
        type: "select"
    }, {
        label: "日期",
        name: "searchdate",
        searchidx: 1,
        type: "datetimebetween"
    }, {
        label: "",
        name: "BusiIncome.Name",
        istable: true,
        orderable:false
    }, {
        label: "会员数",
        name: "tbBusiIncomeReport.REP1",
        istable: true,
        orderable: false
    }, {
        label: "可用积分",
        name: "tbBusiIncomeReport.REP2",
        istable: true,
        orderable: false
    }, {
        label: "使用积分",
        name: "tbBusiIncomeReport.REP3",
        istable: true,
        orderable: false
    }, {
        label: "金额",
        name: "tbBusiIncomeReport.REP4",
        istable: true,
        orderable: false
    }, {
        label: "附赠情况",
        name: "tbBusiIncomeReport.REP5",
        istable: true,
        orderable: false
    }, {
        label: "次数",
        name: "tbBusiIncomeReport.REP6",
        istable: true,
        orderable: false
    }, {
        label: "商品数",
        name: "tbBusiIncomeReport.REP7",
        istable: true,
        orderable: false
    }
];