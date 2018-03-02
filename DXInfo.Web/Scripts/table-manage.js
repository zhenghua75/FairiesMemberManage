var data=[
    {
        "DT_RowId": "row_1",
        "username":   "Tiger Nixon",
        "mobile": "1298347345",
        "email":  "dkje@123.com",
        "sex":    "男",
        "age":    "20"
    },
    {
        "DT_RowId": "row_2",
        "username":   "Jjf kewoi",
        "mobile": "34983s47345",
        "email":  "ddde@123.com",
        "sex":    "女",
        "age":    "27"
    },
    {
        "DT_RowId": "row_3",
        "username":   "Tiger Nixon",
        "mobile": "1298347345",
        "email":  "dkje@123.com",
        "sex":    "男",
        "age":    "20"
    },
    {
        "DT_RowId": "row_4",
        "username":   "Jjf kewoi",
        "mobile": "34983s47345",
        "email":  "ddde@123.com",
        "sex":    "女",
        "age":    "27"
    },
    {
        "DT_RowId": "row_5",
        "username":   "Tiger Nixon",
        "mobile": "1298347345",
        "email":  "dkje@123.com",
        "sex":    "男",
        "age":    "20"
    },
    {
        "DT_RowId": "row_6",
        "username":   "Jjf kewoi",
        "mobile": "34983s47345",
        "email":  "ddde@123.com",
        "sex":    "女",
        "age":    "27"
    },
    {
        "DT_RowId": "row_7",
        "username":   "Tiger Nixon",
        "mobile": "1298347345",
        "email":  "dkje@123.com",
        "sex":    "男",
        "age":    "20"
    },
    {
        "DT_RowId": "row_8",
        "username":   "Jjf kewoi",
        "mobile": "34983s47345",
        "email":  "ddde@123.com",
        "sex":    "女",
        "age":    "27"
    },
    {
        "DT_RowId": "row_9",
        "username":   "Tiger Nixon",
        "mobile": "1298347345",
        "email":  "dkje@123.com",
        "sex":    "男",
        "age":    "20"
    },
    {
        "DT_RowId": "row_10",
        "username":   "Jjf kewoi",
        "mobile": "34983s47345",
        "email":  "ddde@123.com",
        "sex":    "女",
        "age":    "27"
    },
    {
        "DT_RowId": "row_11",
        "username":   "Tiger Nixon",
        "mobile": "1298347345",
        "email":  "dkje@123.com",
        "sex":    "男",
        "age":    "20"
    },
    {
        "DT_RowId": "row_12",
        "username":   "Jjf kewoi",
        "mobile": "34983s47345",
        "email":  "ddde@123.com",
        "sex":    "女",
        "age":    "27"
    }
]

var editor;

function createPanel ( data ){
    var id = data.DT_RowId;
    $(
        '<div class="col-sm-6 col-md-3" data-editor-id="'+id+'">'+
            '<div class="widget radius bg-green-lighter">'+
            '<i class="edit iconfont icon-shuru c-green" data-id="'+id+'"/>'+
            '<i class="remove iconfont icon-close c-green" data-id="'+id+'"/>'+
            '<dl>'+
                '<dt>User name:</dt>'+
                '<dd class="c-white" data-editor-field="username">'+data.username+'</dd>'+
                '<dt>Mobile:</dt>'+
                '<dd class="c-white" data-editor-field="mobile">'+data.mobile+'</dd>'+
                '<dt>Email:</dt>'+
                '<dd class="c-white" data-editor-field="email">'+data.email+'</dd>'+
                '<dt>Sex:</dt>'+
                '<dd class="c-white" data-editor-field="sex">'+data.sex+'</dd>'+
                '<dt>Age:</dt>'+
                '<dd class="c-white" data-editor-field="age">'+data.age+'</dd>'+
            '</dl>'+
            '</div>'+
        '</div>'
    ).appendTo( '.alone-panels' );
}

$(document).ready(function() {
    editor = new $.fn.dataTable.Editor( {
        //ajax: "http://192.168.3.150:9000/testshop",
        // data: data,
        table: "#data-table-exp",
        fields: [ {
                label: "User name:",
                name: "username"
            }, {
                label: "Mobile:",
                name: "mobile"
            }, {
                label: "Email:",
                name: "email"
            }, {
                label: "Sex:",
                name: "sex"
            }, {
                label: "Age:",
                name: "age"
            }
        ]
    } );
 
    var table=$('#data-table-exp').DataTable( {
        //dom: "Bfrtip",
        dom: "<'alone-panels row mb-20'><'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'rt>>" + "<'row'<'col-sm-4'i><'col-sm-8'p>>",
        //ajax: "http://192.168.3.150:9000/testshop",
        data: data,
        autoWidth: false,
        columns: [
            { data: "username" },
            { data: "mobile" },
            { data: "email" },
            { data: "sex" },
            { data: "age" },
        ],
        select: true,
        buttons: [
            { extend: "create", editor: editor },
            { extend: "edit",   editor: editor },
            { extend: "remove", editor: editor },
            {
                extend: 'collection',
                text: '导出',
                buttons: [
                    'copy',
                    'excel',
                    'print'
                ]
            }
        ],
        language: {
            "lengthMenu": "每页显示 _MENU_ 条记录",
            "zeroRecords": "抱歉， 没有找到",
            "info": "当前 : _START_ - _END_ / 共_TOTAL_条",
            "infoEmpty": "没有数据",
            "infoFiltered": "(从 _MAX_ 条数据中检索)",
            "loadingRecords":"加载中......",
            "processing": "<span class='spinner'></span>",
            "search":"查找:",
            "zeroRecords": "没有检索到数据",
            "paginate": {
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "尾页"
            },
            "buttons":{
                "copy":"复制",
                "print":"打印"
            }
        }
    } );

    createPanel( data[0] );
    $('.alone-panels').on( 'click', 'i.edit', function () {
        editor
            .title('编辑')
            .buttons('确定')
            .edit( $(this).data('id') );
    });
    $('.alone-panels').on( 'click', 'i.remove', function () {
        editor
            .title('删除')
            .buttons('确定')
            .message('您确定要删除该记录吗?')
            .remove( $(this).data('id') );
    });
} );