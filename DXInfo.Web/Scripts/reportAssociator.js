var g_table = [
    {
        tableid: 'data-table-exp',
        panelid: 'reportassociatortable',
        hassearchmodel: true,
        tabledom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        tableajax: {
            url: "/api/Editor/Data?model=ReportAssInfo",
            type: "POST"
        },
        editorajax: "/api/Editor/Data?model=ReportAssInfo",
        tablebuttons: [
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
        label: "会员卡号",
        name: "tbAssociator.vcCardID",
        istable: true,
        iseditor: true,
        type:"readonly",
        searchidx: 0
    }, {
        label: "会员姓名",
        name: "tbAssociator.vcAssName",
        istable: true,
        iseditor: true,
        searchidx: 1
    }, {
        label: "联系电话",
        name: "tbAssociator.vcLinkPhone",
        istable: true,
        iseditor: true,
        searchidx: 2
    }, {
        label: "拼音简码",
        name: "tbAssociator.vcSpell",
        istable: true,
        iseditor: true
    }, {
        label: "会员类型",
        name: "NameCodeAT.Name",
        istable: true,
        searchable:false
    }, {
        label: "会员类型",
        name: "tbAssociator.vcAssType",
        istable: true,
        istablehide: true,
        searchidx: 5,
        type:"select"
    }, {
        label: "会员状态",
        name: "NameCodeAS.Name",
        istable: true,
        searchable:false
    }, {
        label: "会员状态",
        name: "tbAssociator.vcAssState",
        istable: true,
        istablehide: true,
        searchidx: 7,
        type: "select"
    }, {
        label: "当前余额",
        name: "tbAssociator.nCharge",
        istable: true,
        searchable: false
    }, {
        label: "当前积分",
        name: "tbAssociator.iIgValue",
        istable: true,
        searchable: false
    }, {
        label: "门店",
        name: "Depts.Name",
        istable: true,
        searchable: false
    }, {
        label: "门店",
        name: "tbAssociator.vcDeptID",
        istable: true,
        istablehide: true,
        searchidx: 11,
        type: "select"
    }, {
        label: "创建时间",
        name: "tbAssociator.dtCreateDate",
        istable: true,
        searchidx: 12,
        type:"datetimebetween"
    }, {
        label: "身份证号",
        name: "tbAssociator.vcAssNbr",
        istable: true,
        iseditor: true
    }, {
        label: "联系地址",
        name: "tbAssociator.vcLinkAddress",
        istable: true,
        iseditor: true,
        orderable: false
    }, {
        label: "Email",
        name: "tbAssociator.vcEmail",
        istable: true,
        iseditor: true,
        orderable: false
    }, {
        label: "操作日期",
        name: "tbAssociator.dtOperDate",
        istable: true,
        searchable: false
    }, {
        label: "备注",
        name: "tbAssociator.vcComments",
        istable: true,
        iseditor: true,
        orderable:false
    }
];