var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'inventorytable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=BaseInfoInventory",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=BaseInfoInventory",
        tablebuttons: [
            { extend: "create", editor: 0 },
            { extend: "edit", editor: 0 },
            { extend: "remove", editor: 0 },
            {
                extend: "customButton",
                text: "查找",
                action: function (e, dt, node, config) {
                    $('#searchModal').modal('show');
                }
            }
        ],
        rowcallback: function (row, data, index) {
            $('input.editor-IsInvalid', row).prop('checked', data.Inventory.IsInvalid == true);
        },
        tableevent: [
            {
                event: "change",
                selector: "input.editor-IsInvalid",
                fn: function (e) {
                    e.data.editor
                        .edit($(this).closest('tr'), false)
                        .set('Inventory.IsInvalid', $(this).prop('checked') ? true : false)
                        .submit();
                }
            }
        ],
        editorevent: [
            {
                event: "preSubmit",
                fn: function (e, o, action) {
                    if (action !== 'remove') {
                        var iserror = false;
                        var isinvd = this.field('Inventory.IsInvalid');
                        if (isinvd.val() == null || isinvd.val() == "") {
                            $.each(o.data, function (key, val) {
                                o.data[key].Inventory.IsInvalid = false;
                            })
                        }
                        var isshlife = this.field('InvStock.IsShelfLife');
                        if (isshlife.val() == null || isshlife.val() == "") {
                            $.each(o.data, function (key, val) {
                                o.data[key].InvStock.IsShelfLife = false;
                                o.data[key].InvStock.ShelfLife = undefined;
                                o.data[key].InvStock.ShelfLifeType = undefined;
                            })
                        } else {
                            var shlife = this.field('InvStock.ShelfLife');
                            var shlifetype = this.field('InvStock.ShelfLifeType');
                            $.each(o.data, function (key, val) {
                                if (o.data[key].InvStock.ShelfLife == null || o.data[key].InvStock.ShelfLife == '') {
                                    shlife.error('请输入保质期');
                                    iserror = true;
                                }
                                if (o.data[key].InvStock.ShelfLifeType == null || (o.data[key].InvStock.ShelfLifeType == '' && o.data[key].InvStock.ShelfLifeType!=0)) {
                                    shlifetype.error('请选择保质期单位');
                                    iserror = true;
                                }
                            })
                        }
                        $.each(o.data, function (key, val) {
                            if (o.data[key].InvStock.HighStock == null || o.data[key].InvStock.HighStock == '') {
                                o.data[key].InvStock.HighStock = undefined;
                            }
                            if (o.data[key].InvStock.LowStock == null || o.data[key].InvStock.LowStock == '') {
                                o.data[key].InvStock.LowStock = undefined;
                            }
                            if (o.data[key].InvStock.SecurityStock == null || o.data[key].InvStock.SecurityStock == '') {
                                o.data[key].InvStock.SecurityStock = undefined;
                            }
                            if (o.data[key].InvStock.EarlyWarningDay == null || o.data[key].InvStock.EarlyWarningDay == '') {
                                o.data[key].InvStock.EarlyWarningDay = undefined;
                            }
                        })

                        if (iserror) {
                            return false;
                        }
                    }
                }
            }
        ],
        dependent: [
            {
                name: 'InvStock.IsShelfLife',
                fn: function (val) {
                    return val == false ?
                        { hide: ['InvStock.ShelfLife', 'InvStock.ShelfLifeType'] } :
                        { show: ['InvStock.ShelfLife', 'InvStock.ShelfLifeType'] }
                }
            }
        ],
        editorcontrolbind: [
            {
                fn: function (cureditor, curtable) {
                    var ugroupnode = cureditor.field('InvStock.UOMGroup').input();
                    $(ugroupnode).on('change', function () {
                        var rowsdata = curtable.rows({ selected: true }).data();
                        var ugroup = $(this).val();
                        if (ugroup != null && ugroup != '') {
                            var optsale = [];
                            $.each(curtable.ajax.json().options['InvStock.SaleUOM'], function (k, v) {
                                if (v.label.UOMGroup == ugroup) {
                                    optsale.push({ label: v.label.Name, value: v.value });
                                }
                            })
                            cureditor.field('InvStock.SaleUOM').update(optsale);
                            var optpuch = [];
                            $.each(curtable.ajax.json().options['InvStock.PurchaseUOM'], function (k, v) {
                                if (v.label.UOMGroup == ugroup) {
                                    optpuch.push({ label: v.label.Name, value: v.value });
                                }
                            })
                            cureditor.field('InvStock.PurchaseUOM').update(optpuch);
                            var optstock = [];
                            $.each(curtable.ajax.json().options['InvStock.StockUOM'], function (k, v) {
                                if (v.label.UOMGroup == ugroup) {
                                    optstock.push({ label: v.label.Name, value: v.value });
                                }
                            })
                            cureditor.field('InvStock.StockUOM').update(optstock);

                            if (cureditor.s.action == "edit") {
                                if (rowsdata.length > 0) {
                                    if (rowsdata[0].InvStock.SaleUOM != null && rowsdata[0].InvStock.SaleUOM != '') {
                                        cureditor.field('InvStock.SaleUOM').set(rowsdata[0].InvStock.SaleUOM);
                                    }
                                    if (rowsdata[0].InvStock.PurchaseUOM != null && rowsdata[0].InvStock.PurchaseUOM != '') {
                                        cureditor.field('InvStock.PurchaseUOM').set(rowsdata[0].InvStock.PurchaseUOM);
                                    }
                                    if (rowsdata[0].InvStock.StockUOM != null && rowsdata[0].InvStock.StockUOM != '') {
                                        cureditor.field('InvStock.StockUOM').set(rowsdata[0].InvStock.StockUOM);
                                    }
                                }
                            }
                        }
                    })
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "编码",
        name: "Inventory.Code",
        istable: true,
        iseditor: true,
        searchidx: 0,
        errorinfo: "请输入编码"
    }, {
        label: "名称",
        name: "Inventory.Name",
        istable: true,
        iseditor: true,
        searchidx: 1,
        errorinfo: "请输入名称"
    }, {
        label: "存货分类",
        name: "Inventory.Category",
        istable: true,
        iseditor: true,
        type: "select2",
        searchidx: 2,
        istablehide: true,
        errorinfo: "请选择分类"
    }, {
        label: "存货分类",
        name: "InvCategory.Name",
        istable: true
    }, {
        label: "规格型号",
        name: "Inventory.Specs",
        istable: true,
        iseditor: true
    }, {
        label: "是否失效",
        name: "Inventory.IsInvalid",
        istable: true,
        iseditor: true,
        type: "checkbox",
        separator: "|",
        options: [
            { label: '', value: true }
        ],
        render: function (val, type, row) {
            if (type === 'display') {
                return '<input type="checkbox" class="editor-IsInvalid">';
            }
            return val;
        }
    }, {
        label: "计量单位组",
        name: "UOMGroup.Name",
        istable: true
    }, {
        label: "计量单位组",
        name: "InvStock.UOMGroup",
        iseditor: true,
        type: "select",
        placeholder: "请选择...",
        placeholderValue: null,
        errorinfo: "请选择计量单位组"
    } , {
        label: "零售单位",
        name: "SaleUOM.Name",
        istable: true
    }, {
        label: "零售单位",
        name: "InvStock.SaleUOM",
        iseditor: true,
        type: "select",
        placeholder: "请选择...",
        placeholderValue: null
    }, {
        label: "销售单位",
        name: "PurchaseUOM.Name",
        istable: true
    }, {
        label: "销售单位",
        name: "InvStock.PurchaseUOM",
        iseditor: true,
        type: "select",
        placeholder: "请选择...",
        placeholderValue: null
    }, {
        label: "库存单位",
        name: "StockUOM.Name",
        istable: true
    }, {
        label: "库存单位",
        name: "InvStock.StockUOM",
        iseditor: true,
        type: "select",
        placeholder: "请选择...",
        placeholderValue: null,
        errorinfo: "请选择库存单位"
    }, {
        label: "最高库存",
        name: "InvStock.HighStock",
        istable: true,
        iseditor: true
    }, {
        label: "最低库存",
        name: "InvStock.LowStock",
        istable: true,
        iseditor: true
    }, {
        label: "安全库存",
        name: "InvStock.SecurityStock",
        istable: true,
        iseditor: true
    }, {
        label: "是否有保质期",
        name: "InvStock.IsShelfLife",
        istable: true,
        iseditor: true,
        type: "checkbox",
        separator: "|",
        options: [
            { label: '', value: true }
        ],
        render: function (val, type, row) {
            return val == true ? '是' : '否';
        }
    }, {
        label: "保质期",
        name: "InvStock.ShelfLife",
        istable: true,
        iseditor: true
    }, {
        label: "保质期单位",
        name: "NameCode.Name",
        istable: true
    }, {
        label: "保质期单位",
        name: "InvStock.ShelfLifeType",
        istable: true,
        iseditor: true,
        istablehide: true,
        type:"select"
    }, {
        label: "预警天数",
        name: "InvStock.EarlyWarningDay",
        istable: true,
        iseditor: true
    }, {
        label: "描述",
        name: "Inventory.Comment",
        istable: true,
        iseditor: true
    }
];