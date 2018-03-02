var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportcurrentstockpanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=StockManageCurrentStock",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"currentstock"
};

var g_fields = [
    {
        label: "仓库",
        name: "CurrentStock.WhId",
        istable: true,
        istablehide: true,
        searchidx: 0,
        type:"select"
    },{
        label: "仓库",
        name: "Warehouse.Name",
        istable: true,
        searchable:false
    }
]

if ($('#gparamisloctor').val() == 'true') {
    g_fields.push({
        label: "货位",
        name: "Locator.Name",
        istable: true,
        searchable: false
    });
    g_fields.push({
        label: "货位",
        name: "CurrentStock.LocatorId",
        istable: true,
        istablehide: true,
        searchidx: 3,
        type: "select",
        optcond:{WhId:''}
    });
}

var tmpother = [
    {
        label: "存货分类",
        name: "Inventory.Category",
        searchidx: g_fields.length,
        type: "select",
        istable: true,
        istablehide:true,
    }, {
        label: "分类编码",
        name: "InvCategory.Code",
        istable: true
    }, {
        label: "分类名称",
        name: "InvCategory.Name",
        istable: true
    }, {
        label: "存货编码",
        name: "Inventory.Code",
        istable: true
    }, {
        label: "存货名称",
        name: "Inventory.Name",
        istable: true,
    }, {
        label: "存货",
        name: "CurrentStock.InvId",
        istable: true,
        istablehide: true,
        searchidx: g_fields.length+5,
        type: "select2"
    }, {
        label: "规格型号",
        name: "Inventory.Specs",
        istable: true,
        searchable: false,
        orderable:false
    }, {
        label: "计量单位",
        name: "UOM.Name",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "批号",
        name: "CurrentStock.Batch",
        istable: true,
        searchidx: g_fields.length + 8
    }, {
        label: "数量",
        name: "CurrentStock.Num",
        istable: true,
        searchable: false
    }, {
        label: "单价",
        name: "CurrentStock.Price",
        istable: true,
        render: function (val, type, row) {
            var num = Math.round(val * 100) / 100;
            return num;
        }
    }, {
        label: "金额",
        name: "CurrentStock.Amount",
        istable: true,
        render: function (val, type, row) {
            var num = Math.round(val * 100) / 100;
            return num;
        }
    }, {
        label: "生产日期",
        name: "CurrentStock.MadeDate",
        istable: true
    }, {
        label: "过期日期",
        name: "CurrentStock.InvalidDate",
        istable: true
    }, {
        label: "是否冻结",
        name: "CurrentStock.StopFlag",
        istable: true,
        render: function (val, type, row) {
            return val == true ? '是' : '否';
        }
    }
];

$.merge(g_fields, tmpother);