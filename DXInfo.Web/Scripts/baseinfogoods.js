var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'basegoodstable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=BaseInfoGoods",
            type: "POST"
        },
        editorajax: {
            create: "/api/Editor/Data?model=BaseInfoGoodss",
            edit: "/api/Editor/Data?model=BaseInfoGoods",
            remove: "/api/Editor/Data?model=BaseInfoGoods"
        },
        tablebuttons: [
            { extend: "create", editor: 0 },
            { extend: "edit", editor: 0 },
            {
                extend: "customButton",
                text: "查找",
                action: function (e, dt, node, config) {
                    $('#searchModal').modal('show');
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "商品编号",
        name: "Inventory.Code",
        istable: true,
        searchidx: 0
    }, {
        label: "商品名称",
        name: "Inventory.Name",
        istable: true,
        iseditor:true,
        searchidx: 1
    }, {
        label: "商品类别",
        name: "Inventory.Category",
        istable: true,
        iseditor: true,
        type:"select2",
        searchidx: 2,
        istablehide:true
    }, {
        label: "商品类别",
        name: "InvCategory.Name",
        istable: true
    }, {
        label: "拼音简写",
        name: "InvSale.Spell",
        istable: true,
        iseditor: true
    }, {
        label: "单价",
        name: "InvSale.Price",
        istable: true,
        iseditor: true,
        render: $.fn.dataTable.render.number('', '.', 2, '$')
    }, {
        label: "是否推荐新品",
        name: "InvSale.NewFlag",
        istable: true,
        iseditor: true,
        type:"radio",
        options: [
            { label: "是", value: true },
            { label: "否", value: false }
        ],
        render: function (val, type, row) {
            return val == true ? "是" : "否";
        }
    }, {
        label: "兑换分值",
        name: "InvSale.IgValue",
        istable: true,
        iseditor: true
    }
];