var editor;

function createPanel(data) {
    var id = data.DT_RowId;
    $(
        '<div class="col-sm-6 col-md-4 col-lg-3 mb-20" data-editor-id="' + id + '">' +
            '<div class="widget radius bg-green-lighter">' +
            '<i class="remove iconfont icon-close c-green" data-id="' + id + '"/>' +
            '<div class="pl-content">'+
            '<dl>' +
                '<dt>角色名:</dt>' +
                '<dd class="c-white" data-editor-field="Name">' + data.Name + '</dd>' +
            '</dl>' +
            '</div>' +
            '<div class="pl-footer">' +
            '<span class="c-white">' + data.Name + '</span>' +
            '</div>'+
            '</div>' +
        '</div>'
    ).appendTo('.alone-panels');
    $("[data-editor-field='Name']").on('click', function (e) {
        editor.inline(this);
    });
}

$(document).ready(function () {
    editor = new $.fn.dataTable.Editor({
        ajax: "/api/Editor/Data?model=AccountRoles",
        fields: [
            {
                label: "角色名:",
                name: "Name"
            }
        ]
    });

    editor.on('preSubmit', function (e, o, action) {
        if (action !== 'remove') {
            var rolename = editor.field('Name');
            if (rolename.val().length > 10) {
                rolename.error('角色名称不能超过10个字');
                return false;
            }
            //o.data[0].Id = undefined;
        }
    });

    editor.on('postCreate', function (e, json) {
        createPanel(json.data[0]);
    });

    editor.on('postEdit', function (e, json) {
        var plwidget = $("[data-editor-id='" + json.data[0].DT_RowId + "']").children();
        plwidget.children('.pl-footer').children('span').html(json.data[0].Name);
    });

    $('button.alone-create').on('click', function () {
        editor
            .title('新建角色')
            .buttons('确定')
            .create();
    });

    $('.alone-panels').on('click', 'i.remove', function () {
        editor
            .title('删除')
            .buttons('确定')
            .message('您确定要删除该记录吗?')
            .remove($(this).data('id'));
    });

    $.ajax({
        url: '/api/Editor/Data?model=AccountRoles',
        dataType: 'json',
        type: 'POST',
        data: {
            draw: 1,
            columns: [
                {
                    data: 'Name',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: '', regex: false }
                }
            ],
            order: [
                { column: 0, dir: 'asc' }
            ],
            start: 0,
            length: -1,
            search: { value: '', regex: false }
        },
        success: function (json) {
            if (json.data == undefined) {
                document.location = "/Home/Error?err=401";
                return false;
            } else {
                for (var i = 0, ien = json.data.length ; i < ien ; i++) {
                    createPanel(json.data[i]);
                }
            }
        }
    });
});