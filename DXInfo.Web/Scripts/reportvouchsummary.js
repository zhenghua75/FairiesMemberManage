var g_table = {
    tableid: 'data-table-exp',
    panelid: 'reportvouchsummarypanel',
    hassearchmodel: true,
    tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f'>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
    ajaxurl: "/api/Editor/Data?model=StockManageVouchSummary",
    tablebuttons: [
        {
            extend: "customButton",
            text: "查找",
            action: function (e, dt, node, config) {
                $('#searchModal').modal('show');
            }
        }
    ],
    reporttype:"vouchsummary"
};

var g_fields = [
    {
        label: "存货",
        name: "Vouchs.InvId",
        istable: true,
        istablehide:true,
        searchidx: 0,
        type: "select2"
    }, {
        label: "存货",
        name: "Inventory.Name",
        istable: true,
    }, {
        label: "单据类型",
        name: "Vouch.VouchType",
        istable: true,
        searchidx: 2,
        type: "select",
        render: function (val, type, row, dt) {
            var opts = dt.settings.json.options['Vouch.VouchType'];
            var newval = '';
            $.each(opts, function (k, v) {
                if (val == v.value) {
                    newval = v.label;
                    return false;
                }
            })
            return newval;
        }
    }, {
        label: "业务类型",
        name: "Vouch.BusType",
        istable: true,
        searchidx: 3,
        type: "select",
        render: function (val, type, row, dt) {
            var opts = dt.settings.json.options['Vouch.BusType'];
            var newval = '';
            $.each(opts, function (k, v) {
                if (val == v.value) {
                    newval = v.label;
                    return false;
                }
            })
            return newval;
        }
    }, {
        label: "转出仓库",
        name: "Vouch.FromWhId",
        istable: true,
        searchidx: 4,
        type: "select",
        render: function (val, type, row, dt) {
            var newval = '';
            if (val == '' || val==null) {
                var opts = dt.settings.json.options['Vouch.ToWhId'];
                $.each(opts, function (k, v) {
                    if (row.Vouch.ToWhId == v.value) {
                        newval = v.label;
                        return false;
                    }
                })
            } else {
                var opts = dt.settings.json.options['Vouch.FromWhId'];
                $.each(opts, function (k, v) {
                    if (val == v.value) {
                        newval = v.label;
                        return false;
                    }
                })
                opts = dt.settings.json.options['Vouch.ToWhId'];
                $.each(opts, function (k, v) {
                    if (row.Vouch.ToWhId == v.value) {
                        newval +='->'+ v.label;
                        return false;
                    }
                })
            }
            return newval;
        }
    }, {
        label: "转入仓库",
        name: "Vouch.ToWhId",
        istable: true,
        searchidx: 5,
        type: "select",
        istablehide:true
    }, {
        label: "数量",
        name: "Vouchs.Num",
        istable: true,
        searchable: false,
        orderable:false
    }, {
        label: "平均单价",
        name: "Vouchs.Price",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "金额",
        name: "Vouchs.Amount",
        istable: true,
        searchable: false,
        orderable: false
    }, {
        label: "日期",
        name: "Vouch.VouchDate",
        istable: true,
        searchidx: 9,
        type: "datetimebetween",
        istablehide: true,
        orderable: false
    }
];
