var curwhid = $('#gparamuserwhid').val();
if (curwhid == undefined || curwhid == null || curwhid == '') {
    curwhid = '0';
}
var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'batchstoptable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=StockManageCurrentStock",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=StockManageCurrentStock",
        tablebuttons: [
            { extend: "edit", editor: 0 },
            {
                extend: "customButton",
                text: "查找",
                action: function (e, dt, node, config) {
                    $('#searchModal').modal('show');
                }
            }
        ],
        searchcols: [
            { search: "='" + curwhid + "'" }
        ],
        editorevent: [
            {
                event: "preSubmit",
                fn: function (e, o, action) {
                    if (action !== 'remove') {
                        var iserror = false;
                        var isinvd = this.field('CurrentStock.StopFlag');
                        if (isinvd.val() == null || isinvd.val() == "") {
                            $.each(o.data, function (key, val) {
                                o.data[key].CurrentStock.StopFlag = false;
                            })
                        }
                        var isshlife = this.field('InvStock.IsShelfLife');
                        if (isshlife.val() == null || isshlife.val() == "") {
                            $.each(o.data, function (key, val) {
                                o.data[key].CurrentStock.MadeDate = undefined;
                                o.data[key].CurrentStock.InvalidDate = undefined;
                            })
                        } else {
                            var madedate = this.field('CurrentStock.MadeDate');
                            var invdate = this.field('CurrentStock.InvalidDate');
                            $.each(o.data, function (key, val) {
                                if (o.data[key].CurrentStock.MadeDate == null || o.data[key].CurrentStock.MadeDate == '') {
                                    shlife.error('请输入生产日期');
                                    iserror = true;
                                }
                                if (o.data[key].CurrentStock.InvalidDate == null || o.data[key].CurrentStock.InvalidDate == '') {
                                    shlifetype.error('请输入失效日期');
                                    iserror = true;
                                }
                            })
                        }
                        $.each(o.data, function (key, val) {
                            o.data[key].CurrentStock.InvId = undefined;
                            o.data[key].CurrentStock.Batch = undefined;
                            o.data[key].InvStock.IsShelfLife = undefined;
                            o.data[key].InvStock.ShelfLife = undefined;
                            o.data[key].NameCodeShelfLifeType.Name = undefined;
                        })

                        if (iserror) {
                            return false;
                        }
                    }
                }
            },
            {
                event:'open',
                fn: function(e, display, action) {
                    if (action != 'remove') {
                        var inputtmp = this.field('CurrentStock.InvId').input();
                        $(inputtmp).attr('disabled', true);
                        inputtmp = this.field('CurrentStock.InvalidDate').input();
                        $(inputtmp).attr('disabled', true);
                        inputtmp = this.field('InvStock.IsShelfLife').input();
                        $(inputtmp).attr('disabled', true);
                        if (this.field('InvStock.IsShelfLife').val() != true) {
                            inputtmp = this.field('CurrentStock.MadeDate').input();
                            $(inputtmp).attr('disabled', true);
                            this.field('CurrentStock.MadeDate').hide();
                            this.field('InvStock.IsShelfLife').hide();
                            this.field('InvStock.ShelfLife').hide();
                            this.field('NameCodeShelfLifeType.Name').hide();
                            this.field('CurrentStock.InvalidDate').hide();
                        } else {
                            this.field('CurrentStock.MadeDate').show();
                            this.field('InvStock.IsShelfLife').show();
                            this.field('InvStock.ShelfLife').show();
                            this.field('NameCodeShelfLifeType.Name').show();
                            this.field('CurrentStock.InvalidDate').show();
                        }
                    }
                }
            }
        ],
        editorcontrolbind: [
            {
                fn: function (cureditor, curtable) {
                    var inputtmp = cureditor.field('CurrentStock.MadeDate').input();
                    $(inputtmp).on('focus', function () {
                        var rowdata = curtable.rows({ selected: true }).data();
                        var shlife = parseInt(cureditor.field('InvStock.ShelfLife').val());
                        var shlifetype = rowdata[0].InvStock.ShelfLifeType;
                        var madedate = cureditor.field('CurrentStock.MadeDate').val();
                        var newday = new Date(madedate);
                        switch (shlifetype) {
                            case '0':
                                newday.setDate(newday.getDate() + shlife);
                                cureditor.field('CurrentStock.InvalidDate').set(newday);
                                break;
                            case '1':
                                newday.setDate(newday.getDate() + shlife * 7);
                                cureditor.field('CurrentStock.InvalidDate').set(newday);
                                break;
                            case '2':
                                newday.setMonth(newday.getMonth() + shlife);
                                cureditor.field('CurrentStock.InvalidDate').set(newday);
                                break;
                            case '3':
                                newday.setYear(newday.getFullYear() + shlife);
                                cureditor.field('CurrentStock.InvalidDate').set(newday);
                                break;
                        }
                    })
                }
            }
        ]
    }
];

var g_fields = [
    {
        label: "仓库",
        name: "CurrentStock.WhId",
        istable: true,
        istablehide: true
    }, {
        label: "仓库",
        name: "Warehouse.Name",
        istable: true,
        searchable: false,
        orderable: false
    }
]

if($('#gparamisloctor').val()=='true'){
    g_fields.push({
        label: "货位",
        name: "Locator.Name",
        istable: true
    });
}

var tmpother=[
    {
        label: "存货",
        name: "Inventory.Name",
        istable: true,
        type: "readonly"
    }, {
        label: "存货",
        name: "CurrentStock.InvId",
        istable: true,
        iseditor: true,
        istablehide: true,
        type: "select2",
        searchidx: g_fields.length+1
    }, {
        label: "规格型号",
        name: "Inventory.Specs",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "计量单位",
        name: "UOM.Name",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "数量",
        name: "CurrentStock.Num",
        istable: true,
        searchable: false
    }, {
        label: "是否冻结",
        name: "CurrentStock.StopFlag",
        istable: true,
        iseditor: true,
        type: "checkbox",
        separator: "|",
        options: [
            { label: '', value: true }
        ],
        render: function (val, type, row) {
            return val == true ? '是' : '否';
        },
        searchidx: g_fields.length + 5
    }, {
        label: "批号",
        name: "CurrentStock.Batch",
        istable: true,
        iseditor: true,
        type: "readonly",
        searchidx: g_fields.length + 6
    }, {
        label: "生产日期",
        name: "CurrentStock.MadeDate",
        istable: true,
        iseditor: true,
        type: "datetime",
        searchidx: g_fields.length + 7
    }, {
        label: "是否保质期",
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
        iseditor: true,
        type:"readonly"
    }, {
        label: "保质期单位",
        name: "NameCodeShelfLifeType.Name",
        istable: true,
        iseditor:true,
        type: "readonly",
        searchable: false,
        orderable: false
    }, {
        label: "失效日期",
        name: "CurrentStock.InvalidDate",
        istable: true,
        iseditor: true,
        type: "datetime",
        searchidx: g_fields.length + 11
    }
];

$.merge(g_fields, tmpother);