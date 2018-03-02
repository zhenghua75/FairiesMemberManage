var editorInvalid = false;

function fnInitEditorFields() {
    var efields = [];
    $.each(g_fields, function (key, val) {
        if (val.iseditor != undefined && val.iseditor === true) {
            var newfield = { label: val.label, name: val.name };
            if (val.type != undefined) {
                newfield.type = val.type;
            }
            if (val.separator != undefined) {
                newfield.separator = val.separator;
            }
            if (val.options != undefined) {
                newfield.options = val.options;
            }
            if (val.multiple != undefined) {
                newfield.multiple = val.multiple;
            }
            if (val.placeholder != undefined) {
                newfield.placeholder = val.placeholder;
                newfield.placeholderValue = null;
            }
            if (val.placeholderValue != undefined) {
                newfield.placeholderValue = val.placeholderValue;
            }
            if (val.placeholderDisabled != undefined) {
                newfield.placeholderDisabled = val.placeholderDisabled;
            }
            if (val.def != undefined) {
                newfield.def = val.def;
            }
            if (val.format != undefined) {
                newfield.format = val.format;
            }
            if (val.errorinfo != undefined) {
                newfield.errorinfo = val.errorinfo;
                editorInvalid = true;
            }
            if (val.optcond != undefined) {
                newfield.optcond = val.optcond;
            }
            if (val.isdisabled != undefined) {
                newfield.isdisabled = val.isdisabled;
            }
            efields.push(newfield);
        }
    })
    return efields;
}

function fnInitDatatablesFields() {
    var tfields = [];
    $.each(g_fields, function (key, val) {
        if (val.istable != undefined && val.istable === true) {
            var newfield = { data: val.name };
            if (val.render != undefined) {
                newfield.render = val.render;
            }
            if (val.searchable != undefined) {
                newfield.searchable = val.searchable;
            }
            if (val.orderable != undefined) {
                newfield.orderable = val.orderable;
            }
            if (val.className != undefined) {
                newfield.className = val.className;
            }
            if (val.defaultContent != undefined) {
                newfield.defaultContent = val.defaultContent;
            }
            tfields.push(newfield);
        }
    })
    return tfields;
}

function fnInitDatatablesHideFields(tfields) {
    var hidecol=[];
    $.each(g_fields, function (key, val) {
        if (val.istable != undefined && val.istable === true && val.istablehide != undefined && val.istablehide === true) {
            $.each(tfields,function(i,d){
                if(d.data==val.name){
                    hidecol.push(i);
                    return false;
                }
            })
        }
    })
    return hidecol;
}

function fnInitSearchFields() {
    var sfields = [];
    $.each(g_fields, function (key, val) {
        if (val.searchidx != undefined) {
            var searchtype = "";
            var options = [];
            switch (val.type) {
                case 'select':
                    searchtype = 'select';
                    if (val.options !== undefined) {
                        options = val.options;
                    }
                    break;
                case 'select2':
                    searchtype = 'select2';
                    if (val.options !== undefined) {
                        options = val.options;
                    }
                    break;
                case 'datetime':
                    searchtype = 'datetime';
                    break;
                case 'datetimebetween':
                    searchtype = 'datetimebetween';
                    break;
                default:
                    searchtype = 'text';
                    break;
            }
            filedname = val.name.replace('.', '_').replace('[]', '');
            if (val.search !== undefined) {
                searchvalue = val.search;
            } else {
                searchvalue = '';
            }
            sfields.push(
                {
                    index: val.searchidx,
                    id: 'search-' + filedname,
                    value: '',
                    type: searchtype,
                    label: val.label,
                    name: val.name,
                    search: searchvalue,
                    options: options
                });
        }
    })
    return sfields;
}

function fnCreateTable(tableid,panelid) {
    var strtable = '<table id="' + tableid + '" class="table table-border table-bordered table-bg table-striped display responsive nowrap"><thead><tr>';
    $.each(g_fields, function (key, val) {
        if (val.istable != undefined && val.istable === true) {
            strtable += '<th>' + val.label + '</th>';
        }
    })
    strtable += '</tr></thead></table>';
    $(strtable).appendTo('#' + panelid + ' .panel-body');
}

function fnCreateSearchModal(tableid,sfields) {
    var diag = '<div id="searchModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="searchModalLabel" aria-hidden="false">' +
        '<div class="modal-dialog" style="z-index:1040"><div class="modal-content">' +
        '<div class="modal-header"><button class="close" data-dismiss="modal" aria-hidden="true" href="javascript:void();">×</button><h4 class="modal-title">高级查找</h4></div>' +
        '<div class="modal-body form-horizontal">';
    $.each(sfields, function (key, val) {
            diag += '<div class="row row-form"><label class="form-label col-xs-4 col-sm-3">';
            diag += val.label + '</label><div class="col-xs-8 col-sm-9">';
            switch (val.type) {
                case 'select':
                    diag += '<select class="select" id="' + val.id + '"></select>';
                    break;
                case 'select2':
                    diag += '<select class="select" id="' + val.id + '"></select>';
                    break;
                case 'text':
                    diag += '<input type="text" class="input-text" id="' + val.id + '"></input>';
                    break;
                case 'datetime':
                    diag += '<input type="text" class="input-text" id="dtp-' + val.id + '" />';
                    break;
                case 'datetimebetween':
                    diag += '<input type="text" class="input-text" id="dtp-' + val.id + '-be" style="width:195px" />'+
                        '--<input type="text" class="input-text" id="dtp-' + val.id + '-nd" style="width:195px" />';
                    break;
            }
            diag += '</div></div>';
    })
    diag += '</div><div class="modal-footer">';
    diag += '<button class="btn btn-primary radius" id="searchModalBtn">查找</button>';
    diag += '</div></div></div></div>';
    $('body').append(diag);

    $.each(sfields, function (key, val) {
        if (val.type == 'datetime') {
            $("#dtp-" + val.id).datetimepicker({
                format: "yyyy-mm-dd",
                minView: "month",
                todayHighlight: true,
                autoclose: true
            })
        }
        if (val.type == 'datetimebetween') {
            $("#dtp-" + val.id+'-be').datetimepicker({
                format: "yyyy-mm-dd",
                minView: "month",
                todayHighlight: true,
                autoclose: true
            })
            $("#dtp-" + val.id + '-nd').datetimepicker({
                format: "yyyy-mm-dd",
                minView: "month",
                todayHighlight: true,
                autoclose: true
            })
        }
    })

    var searchclick = function () {
        var tabletmp = $('#' + tableid).DataTable();
        $.each(sfields, function (key, val) {
            var searchval = $('#' + val.id).val();
            switch (val.type) {
                case "text":
                    if (searchval == '') {
                        sfields[key].value = '';
                    } else {
                        sfields[key].value = "like '%" + searchval + "%'";
                    }
                    break;
                case "select":
                    if (searchval == '0') {
                        sfields[key].value = '';
                    } else {
                        sfields[key].value = "='" + searchval + "'";
                    }
                    break;
                case "select2":
                    if (searchval == '0') {
                        sfields[key].value = '';
                    } else {
                        sfields[key].value = "='" + searchval + "'";
                    }
                    break;
                case "datetime":
                    searchval = $('#dtp-' + val.id).val();
                    if (searchval == '') {
                        sfields[key].value = '';
                    } else {
                        sfields[key].value = "='" + searchval + "'";
                    }
                    break;
                case "datetimebetween":
                    searchvalbe = $('#dtp-' + val.id + '-be').val();
                    searchvalnd = $('#dtp-' + val.id + '-nd').val();
                    if (searchvalbe == '' && searchvalnd=='') {
                        sfields[key].value = '';
                    } else if (searchvalbe != '' && searchvalnd == '') {
                        sfields[key].value = ">='" + searchvalbe + "'";
                    } else if (searchvalbe == '' && searchvalnd != '') {
                        sfields[key].value = "<='" + searchvalnd + "'";
                    } else {
                        sfields[key].value = "between '" + searchvalbe + "' and '" + searchvalnd + "'";
                    }
                    break;
            }
            if (val.search != '') {
                if (sfields[key].value == '') {
                    sfields[key].value = val.search;
                } else {
                    sfields[key].value += ' and ' + val.name + ' ' + val.search;
                }
            }

            tabletmp
                .column(val.index)
                .search(sfields[key].value);
        })

        $('#searchModal').modal('hide');
        tabletmp.draw();
    }

    $("#searchModalBtn").bind("click", searchclick);
}

function fnDatatableLang() {
    return {
        "lengthMenu": "每页显示 _MENU_ 条记录",
        "zeroRecords": "抱歉， 没有找到",
        "info": "当前 : _START_ - _END_ / 共_TOTAL_条",
        "infoEmpty": "没有数据",
        "infoFiltered": "",
        "loadingRecords": "加载中......",
        "processing": "<span class='spinner-small'></span>",
        "search": "快速查找:",
        "zeroRecords": "没有检索到数据",
        "paginate": {
            "sFirst": "首页",
            "sPrevious": "<<",
            "sNext": ">>",
            "sLast": "尾页"
        },
        "buttons": {
            "copy": "复制",
            "print": "打印"
        }
    }
}

$(document).ready(function () {
    var table = [];
    var editor = [];
    $.each(g_table, function (key, val) {
        var editorfields = fnInitEditorFields();
        var tablefields = fnInitDatatablesFields();
        var tablehidecols = fnInitDatatablesHideFields(tablefields);
        var tablelang = fnDatatableLang();

        fnCreateTable(val.tableid, val.panelid);
        var searchfields = fnInitSearchFields();
        if (val.hassearchmodel === true) {
            fnCreateSearchModal(val.tableid, searchfields);
        }

        if (val.editorajax !== undefined && editorfields.length > 0)
        {
            editor[key] = new $.fn.dataTable.Editor({
                ajax: val.editorajax,
                table: "#" + val.tableid,
                fields: editorfields
            });
        }

        $.each(val.editorevent, function (k, v) {
            editor[key].on(v.event, v.fn);
        })

        if (editorInvalid) {
            editor[key].on('preSubmit', function (e, o, action) {
                if (action != 'remove') {
                    var iserror = true;
                    $.each(editorfields, function (k, v) {
                        if (v.errorinfo !== undefined) {
                            var field = editor[key].field(v.name);
                            if (!field.val()) {
                                iserror = false;
                                field.error(v.errorinfo);
                            }
                        }
                    })
                    if (!iserror) {
                        return false;
                    }
                }
            })
        }

        $.each(val.tablebuttons, function (k, v) {
            if (v.editor != undefined) {
                val.tablebuttons[k].editor = editor[key];
            }
        })

        if (val.rowcallback == undefined) {
            val.rowcallback = null;
        }

        $.each(val.dependent, function (k, v) {
            editor[key].dependent(v.name, v.fn);
        })

        table[key] = $('#' + val.tableid)
            .on('preXhr.dt', function (e, settings, json) {
                if (json.search.value != '') {
                    json.search.value = "like '%" + json.search.value + "%'";
                }
                if(json.columns[0].data=='Vouch.VouchType' && json.columns[0].search.value.indexOf('012')>0){
                    if (json.columns[11].search.value == '' || json.columns[11].search.value.indexOf('unfinal') > 0) {
                        json.columns[11].search.value = '';
                        json.columns[0].search.value += " and (Vouch.IsVerify=0 or TransVouch.IsVerify=0 or OtherInStock.IsVerify=0)";
                    } else {
                        json.columns[11].search.value = '';
                        json.columns[0].search.value += " and (TransVouch.IsVerify=1 and OtherInStock.IsVerify=1)";
                    }
                }
            })
            .on('xhr.dt', function (e, settings, json, xhr) {
                if (json == undefined) {
                    errobj = eval("(" + xhr.responseText + ")");
                    var errinfo = "";
                    if (errobj.exceptionMessage) {
                        errinfo = errinfo + errobj.exceptionMessage;
                    }
                    $.each(errobj.modelState, function (key, value) {
                        if (key == "other") {
                            errinfo += "<p>详细信息：";
                            $.each(value, function (i, val) {
                                errinfo += val + '|';
                            });
                            errinfo = errinfo.substr(0, errinfo.length - 1);
                            errinfo += "</p>";
                        } else {
                            errinfo += '<p>' + key + '：' + value + '</p>';
                        }
                    });
                    addUIAlter('nav.breadcrumb', errinfo, 'error');
                    return false;
                }
                if (json.data == undefined) {
                    document.location = "/Home/Error?err=401";
                    return false;
                }
            })
            .on('init.dt', function (e, settings, json) {
                if (val.hassearchmodel === true) {
                    $.each(searchfields, function (key, val) {
                        if (val.type == 'select' || val.type == 'select2') {
                            var selecttmp = json.options[val.name];
                            if (selecttmp == undefined && val.options.length>0) {
                                selecttmp = val.options;
                            }
                            $('#' + val.id).empty();
                            if (val.label != '流程状态') {
                                $('#' + val.id).append('<option value="0">所有' + val.label + '</option>');
                            }
                            $.each(selecttmp, function (i, d) {
                                $('#' + val.id).append('<option value="' + d.value + '">' + d.label + '</option>');
                            });
                        }
                        if (val.type == 'select2') {
                            $('#' + val.id).select2({
                                dropdownParent: $('#searchModal')
                            });
                        }
                    })
                }
            })
            .DataTable({
                dom: val.tabledom,
                processing: true,
                serverSide: true,
                autoWidth: false,
                ajax: val.tableajax,
                columns: tablefields,
                columnDefs: val.columndefs,
                select: 'single',
                buttons: val.tablebuttons,
                rowCallback: val.rowcallback,
                drawCallback: function () {
                    table[key].responsive.rebuild();
                    table[key].responsive.recalc();
                },
                searchCols: val.searchcols,
                order: val.order,
                pageLength:val.pagelength,
                language: tablelang
            });

        if (tablehidecols.length > 0) {
            table[key].columns(tablehidecols).visible(false);
        }
        
        $.each(val.tableevent, function (k, v) {
            if (editor.length == 0) {
                $('#' + val.tableid).on(v.event, v.selector, v.fn);
            } else {
                $('#' + val.tableid).on(v.event, v.selector, { editor: editor[key] }, v.fn);
            }
        })

        $.each(val.tableapievent, function (k, v) {
            table[key].on(v.event, v.fn);
        })

        $.each(val.editorcontrolbind, function (k, v) {
            v.fn(editor[key], table[key]);
        })
    })
});