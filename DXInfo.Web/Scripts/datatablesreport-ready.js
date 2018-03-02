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
                case 'textbetween':
                    searchtype = 'textbetween';
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
                    options: options,
                    mode: val.searchcond,
                    hascheck: val.hascheck !== undefined ? val.hascheck : false
                });
        }
    })
    return sfields;
}

function fnCreateTable(tableid,panelid) {
    var strtable = '<table id="' + tableid + '" class="table table-border table-bordered table-bg table-striped display responsive nowrap"><thead><tr>';
    $.each(g_fields, function (key, val) {
        if (val.istable != undefined && val.istable === true) {
            if (g_table.reporttype == 'vouchsummary' && val.name=='Vouch.FromWhId') {
                strtable += '<th>仓库</th>';
            } else {
                strtable += '<th>' + val.label + '</th>';
            }
        }
    })
    strtable += '</tr></thead></table>';
    $(strtable).appendTo('#' + panelid + ' .panel-body');
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
    var table = null;
    var drawnum = 1;
    var tablefields = fnInitDatatablesFields();
    var tablehidecols = fnInitDatatablesHideFields(tablefields);
    var tablelang = fnDatatableLang();
    var searchfields = fnInitSearchFields();
    var tabledatasrc = function (json) {
        return json.data;
    }
    if (g_table.datasrccallback !== undefined) {
        tabledatasrc = function (json) {
            return g_table.datasrccallback(json);
        }
    }
    var reporttype = null;
    if (g_table.reporttype !== undefined) {
        reporttype = g_table.reporttype;
    }
    function fnCreateSearchModal() {
        var diag = '<div id="searchModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="searchModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog" style="z-index:1040"><div class="modal-content">' +
            '<div class="modal-header"><button class="close" data-dismiss="modal" aria-hidden="true" href="javascript:void();">×</button>'+
            '<h4 class="modal-title">高级查找<span class="f-12 c-warning">--至少输入一个查找条件，否则视为放弃查找</span></h4></div>' +
            '<div class="modal-body form-horizontal">';
        $.each(searchfields, function (key, val) {
            diag += '<div class="row row-form"><label class="form-label col-xs-4 col-sm-3">';
            diag += val.label;
            if (g_table.reporttype == 'conskind' && val.hascheck==true) {
                diag += '&nbsp<input type="checkbox" id="chk-' + val.id + '"/>';
            }
            diag += '</label><div class="col-xs-8 col-sm-9">';
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
                    diag += '<input type="text" class="input-text" id="dtp-' + val.id + '-be" style="max-width:195px" />' +
                        '至<input type="text" class="input-text" id="dtp-' + val.id + '-nd" style="max-width:195px" />';
                    break;
                case 'textbetween':
                    diag += '<input type="text" class="input-text" id="txt-' + val.id + '-be" style="max-width:195px" />' +
                        '至<input type="text" class="input-text" id="txt-' + val.id + '-nd" style="max-width:195px" />';
                    break;
            }
            diag += '</div></div>';
        })
        diag += '</div><div class="modal-footer">';
        diag += '<div class="modal-footer_error c-danger"></div>';
        diag += '<div class="modal-footer_button"><button class="btn btn-primary radius" id="searchModalBtn">查找</button></div>';
        diag += '</div></div></div></div>';
        $('body').append(diag);        

        $.each(searchfields, function (key, val) {
            if (val.type == 'datetime') {
                $("#dtp-" + val.id).datetimepicker({
                    format: "yyyy-mm-dd",
                    minView: "month",
                    todayHighlight: true,
                    autoclose: true
                })
                $("#dtp-" + val.id).val(moment().format('YYYY-MM-DD'));
            }
            if (val.type == 'datetimebetween') {
                $("#dtp-" + val.id + '-be').datetimepicker({
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
                $("#dtp-" + val.id + '-be').val(moment().format('YYYY-MM-DD'));
                $("#dtp-" + val.id + '-nd').val(moment().format('YYYY-MM-DD'));
            }
            if (g_table.reporttype == 'currentstock') {
                if (val.id == 'search-CurrentStock_WhId') {
                    $("#" + val.id).on('change', function () {
                        var curwhid = $(this).val();
                        $('#search-CurrentStock_LocatorId').empty();
                        $('#search-CurrentStock_LocatorId').append('<option value="0">所有货位</option>');
                        var selecttmp = table.ajax.json().options['CurrentStock.LocatorId'];
                        $.each(selecttmp, function (i, d) {
                            if (typeof d.label === ('object')) {
                                if (curwhid == '0') {
                                    $('#search-CurrentStock_LocatorId').append('<option value="' + d.value + '">' + d.label.Name + '</option>');
                                } else if (d.label.WhId == curwhid) {
                                    $('#search-CurrentStock_LocatorId').append('<option value="' + d.value + '">' + d.label.Name + '</option>');
                                }
                            }
                        });
                    })
                }
            }
        })

        $("#searchModalBtn").bind("click", function () {
            if (g_table.reporttype == 'busiincome') {
                if ($('#dtp-search-searchdate-be').val() == '' || $('#dtp-search-searchdate-be').val() == undefined) {
                    $('div.modal-footer_error').html('请输入查找日期范围');
                    return false;
                }
                if ($('#dtp-search-searchdate-nd').val() == '' || $('#dtp-search-searchdate-nd').val() == undefined) {
                    $('div.modal-footer_error').html('请输入查找日期范围');
                    return false;
                }
            }
            if (g_table.reporttype == 'integlog') {
                if ($('#search-tbIntegralLogOther_vcCardId').val() == '' || $('#search-tbIntegralLogOther_vcCardId').val() == undefined) {
                    $('div.modal-footer_error').html('请输入查询会员卡号');
                    return false;
                } else {
                    $('div.modal-footer_error').html('');
                }
            }
            $('#searchModal').modal('hide');
            if (g_table.reporttype == 'conskind') {
                $.each(searchfields, function (key, val) {
                    var colidx = val.index;
                    if (colidx == 0 || colidx == 2 || colidx == 4) {
                        colidx = colidx + 1;
                    }
                    if (val.hascheck == true && $('#chk-' + val.id).is(":checked")) {
                        table.column(colidx).visible(true);
                    } else {
                        table.column(colidx).visible(false);
                    }
                })
            }
            table.columns.adjust().draw();
        });
    }

    function tabledrawdata(data,reptype) {
        var isallempty = true;
        $.each(searchfields, function (key, val) {
            var searchval = $('#' + val.id).val();
            switch (val.type) {
                case "text":
                    if (searchval == '' || searchval == undefined) {
                        searchfields[key].value = '';
                    } else {
                        if (val.mode == '%') {
                            searchfields[key].value = "like '%" + searchval + "%'";
                        } else {
                            searchfields[key].value = "='" + searchval + "'";
                        }
                        
                    }
                    break;
                case "select":
                    if (searchval == '0' || searchval == undefined) {
                        searchfields[key].value = '';
                    } else {
                        searchfields[key].value = "='" + searchval + "'";
                    }
                    break;
                case "select2":
                    if (searchval == '0' || searchval == undefined) {
                        searchfields[key].value = '';
                    } else {
                        searchfields[key].value = "='" + searchval + "'";
                    }
                    break;
                case "datetime":
                    searchval = $('#dtp-' + val.id).val();
                    if (searchval == '' || searchval == undefined) {
                        searchfields[key].value = '';
                    } else {
                        searchfields[key].value = "='" + searchval + "'";
                    }
                    break;
                case "datetimebetween":
                    searchvalbe = $('#dtp-' + val.id + '-be').val();
                    searchvalnd = $('#dtp-' + val.id + '-nd').val();
                    if ((searchvalbe == '' && searchvalnd == '') || (searchvalbe == undefined && searchvalnd == undefined)) {
                        searchfields[key].value = '';
                    } else if (searchvalbe != '' && searchvalnd == '') {
                        searchfields[key].value = ">='" + searchvalbe + "'";
                    } else if (searchvalbe == '' && searchvalnd != '') {
                        searchfields[key].value = "<='" + searchvalnd + " 23:59:59'";
                    } else {
                        searchfields[key].value = "between '" + searchvalbe + "' and '" + searchvalnd + "  23:59:59'";
                    }
                    break;
                case "textbetween":
                    searchvalbe = $('#txt-' + val.id + '-be').val();
                    searchvalnd = $('#txt-' + val.id + '-nd').val();
                    if ((searchvalbe == '' && searchvalnd == '') || (searchvalbe == undefined && searchvalnd == undefined)) {
                        searchfields[key].value = '';
                    } else if (searchvalbe != '' && searchvalnd == '') {
                        searchfields[key].value = ">='" + searchvalbe + "'";
                    } else if (searchvalbe == '' && searchvalnd != '') {
                        searchfields[key].value = "<='" + searchvalnd + "'";
                    } else {
                        searchfields[key].value = "between '" + searchvalbe + "' and '" + searchvalnd + "'";
                    }
                    break;
            }
            data.columns[val.index].search.value = searchfields[key].value;
            if (g_table.reporttype == 'conskind') {
                if (val.hascheck == true && $('#chk-' + val.id).is(":checked")) {
                    data.columns[val.index].groupable = true;
                } else {
                    data.columns[val.index].groupable = false;
                }
            }
            if (g_table.reporttype == 'goodstop') {
                data.order = [{ column: 3, dir: 'desc' }];
            }
            if (searchfields[key].value != '') {
                isallempty=false;
            }
        })
        if (reptype == 'shlifewarn' || reptype == 'secustock' || reptype == 'abovestock' || reptype == 'lowstock') {
            if (data.draw == 1) {
                isallempty = true;
            } else {
                isallempty = false;
            }
        }
        if (isallempty) {
            data.columns = [];
            switch (reptype) {
                case "conskind":
                    data.columns[0] = {
                        data: "Cons.vcDeptId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        groupable: true,
                        search: { value: '=0', regex: false },
                    };
                    data.columns[1] = {
                        data: "Cons.dtConsDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "='1900-01-01'", regex: false },
                    };
                    break;
                case "goodstop":
                    data.columns[0] = {
                        data: "tbConsItemOther.vcDeptId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: '=0', regex: false },
                    };
                    data.columns[1] = {
                        data: "tbConsItemOther.dtConsDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "='1900-01-01'", regex: false },
                    };
                    data.columns[2] = {
                        data: "tbConsItemOther.vcGoodsId",
                        name: "",
                        searchable: true,
                        orderable: true,
                        search: { value: '', regex: false },
                    };
                    data.order = [{ column: 2, dir: 'asc' }];
                    break;
                case "busiincome":
                    data.columns[0] = {
                        data: "tbBusiIncomeReport.vcDeptId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: '0', regex: false },
                    };
                    data.columns[1] = {
                        data: "BeginDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "1900-01-01", regex: false },
                    };
                    data.columns[2] = {
                        data: "EndDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "1900-01-01", regex: false },
                    };
                    break;
                case "speccons":
                    data.columns[0] = {
                        data: "tbBillOther.vcConsType",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "='0'", regex: false },
                    };
                    data.columns[1] = {
                        data: "tbBillOther.dtConsDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "=1900-01-01", regex: false },
                    };
                    break;
                case "cardtop":
                    data.columns[0] = {
                        data: "tbConsItemOther.vcCardID",
                        name: "",
                        searchable: false,
                        orderable: true,
                        search: { value: '', regex: false },
                    };
                    data.columns[1] = {
                        data: "tbConsItemOther.dtConsDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "='1900-01-01'", regex: false },
                    };
                    data.columns[2] = {
                        data: "tbConsItemOther.vcDeptId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "=0", regex: false },
                    };
                    break;
                case "currentstock":
                    if ($('#gparamauthtype').val() == '0') {
                        data.columns[0] = {
                            data: "CurrentStock.WhId",
                            name: "",
                            searchable: true,
                            orderable: true,
                            search: { value: '', regex: false },
                        };
                    } else {
                        data.columns[0] = {
                            data: "CurrentStock.WhId",
                            name: "",
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + $(gparamwhid).val(), regex: false },
                        };
                    }
                    break;
                case "rdsummary":
                    data.columns[0] = {
                        data: "Vouch.WhId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: '=0', regex: false },
                    };
                    data.columns[1] = {
                        data: "BeginDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "1900-01-01", regex: false },
                    };
                    data.columns[2] = {
                        data: "EndDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "1900-01-01", regex: false },
                    };
                    break;
                case "batchsummary":
                    data.columns[0] = {
                        data: "Vouch.WhId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: '=0', regex: false },
                    };
                    data.columns[1] = {
                        data: "BeginDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "1900-01-01", regex: false },
                    };
                    data.columns[2] = {
                        data: "EndDate",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: "1900-01-01", regex: false },
                    };
                    break;
                default:
                    data.columns[0] = {
                        data: "DT_RowId",
                        name: "",
                        searchable: true,
                        orderable: false,
                        search: { value: '=0', regex: false },
                    };
                    break;
            }
        } else {
            switch (g_table.reporttype) {
                case 'busiincome':
                    data.columns = [];
                    data.columns[0] = {
                        data: "tbBusiIncomeReport.ReNo",
                        name: '',
                        searchable: false,
                        orderable: true,
                        search: {
                            value: '',
                            regex: false
                        }
                    };
                    data.columns[1] = {
                        data: searchfields[0].name,
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: searchfields[0].value.replace(/'/g, '').replace('=', '').trim(),
                            regex: false
                        }
                    }
                    var day = searchfields[1].value.split('and');
                    var begin = day[0].replace(/'/g, '').replace('between', '').trim();
                    var end = day[1].replace(/'/g, '').replace('and', '').trim();
                    data.columns[2] = {
                        data: "BeginDate",
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: begin,
                            regex: false
                        }
                    };
                    data.columns[3] = {
                        data: "EndDate",
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: end,
                            regex: false
                        }
                    };
                    data.order = [{ column: 0, dir: 'asc' }];
                    break;
                case 'rdsummary':
                    data.columns = [];
                    data.columns[0] = {
                        data: "Vouch.WhId",
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: {
                            value: searchfields[1].value,
                            regex: false
                        }
                    };
                    data.columns[1] = {
                        data: "Inventory.Name",
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: {
                            value: searchfields[2].value,
                            regex: false
                        }
                    }
                    var day = searchfields[0].value.split('and');
                    var begin = day[0].replace(/'/g, '').replace('between', '').trim();
                    var end = day[1].replace(/'/g, '').replace('and', '').trim();
                    data.columns[2] = {
                        data: "BeginDate",
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: begin,
                            regex: false
                        }
                    };
                    data.columns[3] = {
                        data: "EndDate",
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: end,
                            regex: false
                        }
                    };
                    data.order = [{ column: 0, dir: 'asc' }];
                    break;
                case 'batchsummary':
                    data.columns = [];
                    data.columns[0] = {
                        data: "Vouch.WhId",
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: {
                            value: searchfields[1].value,
                            regex: false
                        }
                    };
                    data.columns[1] = {
                        data: "Inventory.Name",
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: {
                            value: searchfields[2].value,
                            regex: false
                        }
                    }
                    var day = searchfields[0].value.split('and');
                    var begin = day[0].replace(/'/g, '').replace('between', '').trim();
                    var end = day[1].replace(/'/g, '').replace('and', '').trim();
                    data.columns[2] = {
                        data: "BeginDate",
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: begin,
                            regex: false
                        }
                    };
                    data.columns[3] = {
                        data: "EndDate",
                        name: '',
                        searchable: true,
                        orderable: false,
                        search: {
                            value: end,
                            regex: false
                        }
                    };
                    data.columns[4] = {
                        data: "Vouch.Batch",
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: {
                            value: searchfields[3].value,
                            regex: false
                        }
                    }
                    data.order = [{ column: 0, dir: 'asc' }];
                    break;
                case 'shlifewarn':
                    data.columns[9].search.value = '';

                    if (searchfields[3].value != '') {
                        data.columns[9].search.value = searchfields[3].value;
                    }

                    var querytype = searchfields[0].value;
                    var querytype = querytype.replace(/'/g, '').replace('=', '').trim();
                    var today = moment().format('YYYY-MM-DD');
                    var next10day=moment().add(10,'days').format('YYYY-MM-DD');
                    if (querytype == '1') {
                        if (data.columns[9].search.value == '') {
                            data.columns[9].search.value = "<='" + today + "'";
                        } else {
                            data.columns[9].search.value += " and CurrentStock.InvalidDate<='" + today + "'";
                        }
                    } else if (querytype == '2') {
                        if (data.columns[9].search.value == '') {
                            data.columns[9].search.value = ">'" + today + "'";
                        } else {
                            data.columns[9].search.value += " and CurrentStock.InvalidDate>'" + today + "'";
                        }
                    } else if (querytype == '3') {
                        if (data.columns[9].search.value == '') {
                            data.columns[9].search.value = ">'" + today + "' and CurrentStock.InvalidDate<='" + next10day + "'";
                        } else {
                            data.columns[9].search.value += " and CurrentStock.InvalidDate>'" + today + "' and CurrentStock.InvalidDate<='" + next10day + "'";
                        }
                    }

                    if (searchfields[4].value != '') {
                        var num = searchfields[4].value.replace(/'/g, '').replace('=', '').trim();
                        var tmpday = moment().subtract(num, 'days').format('YYYY-MM-DD');
                        if (data.columns[9].search.value == '') {
                            data.columns[9].search.value = "<='" + tmpday+"'";
                        } else {
                            data.columns[9].search.value += " and CurrentStock.InvalidDate<='" + tmpday + "'";
                        }
                    }

                    if (searchfields[5].value != '') {
                        if (searchfields[5].value.indexOf('>=') >= 0) {
                            var begin = searchfields[5].value.replace(/'/g, '').replace('>=', '').trim();
                            var beginday = moment().add(begin, 'days').format('YYYY-MM-DD');
                            if (data.columns[9].search.value == '') {
                                data.columns[9].search.value = ">='" + beginday +"'";
                            } else {
                                data.columns[9].search.value += " and CurrentStock.InvalidDate>='" + beginday + "'";
                            }
                        } else if (searchfields[5].value.indexOf('<=') >= 0) {
                            var end = searchfields[5].value.replace(/'/g, '').replace('<=', '').trim();
                            var endday = moment().add(end, 'days').format('YYYY-MM-DD');
                            if (data.columns[9].search.value == '') {
                                data.columns[9].search.value = "<='" + endday + "'";
                            } else {
                                data.columns[9].search.value += " and CurrentStock.InvalidDate<='" + endday + "'";
                            }
                        } else {
                            var day = searchfields[5].value.split('and');
                            var begin = day[0].replace(/'/g, '').replace('between', '').trim();
                            var end = day[1].replace(/'/g, '').replace('and', '').trim();
                            var beginday = moment().add(begin, 'days').format('YYYY-MM-DD');
                            var endday = moment().add(end, 'days').format('YYYY-MM-DD');
                            if (data.columns[9].search.value == '') {
                                data.columns[9].search.value = "between '" + beginday + "' and '" + endday + "'";
                            } else {
                                data.columns[9].search.value += " and CurrentStock.InvalidDate between '" + beginday + "' and '" + endday + "'";
                            }
                        }
                    }

                    data.columns[0].search.value = searchfields[1].value;
                    data.columns[5].search.value = searchfields[2].value;
                    break;
                case 'secustock':
                    var querytype = searchfields[0].value;
                    var querytype = querytype.replace(/'/g, '').replace('=', '').trim();
                    if (querytype == '1') {
                        data.columns[6].search.value = ">InvStock.SecurityStock";
                    } else if (querytype == '2') {
                        data.columns[6].search.value = "<=InvStock.SecurityStock";
                    }
                    break;
                case 'abovestock':
                    var querytype = searchfields[0].value;
                    var querytype = querytype.replace(/'/g, '').replace('=', '').trim();
                    if (querytype == '1') {
                        data.columns[6].search.value = ">InvStock.HighStock";
                    }
                    break;
                case 'lowstock':
                    var querytype = searchfields[0].value;
                    var querytype = querytype.replace(/'/g, '').replace('=', '').trim();
                    if (querytype == '1') {
                        data.columns[5].search.value = ">CurrentStock.Num";
                    }
                    break;
                case 'stockdaybook':
                    if (data.columns[3].search.value == '') {
                        data.columns[3].search.value = ' is not null';
                    } else {
                        data.columns[3].search.value += ' and Vouch.BusType is not null';
                    }
                    data.order = [{ column: 16, dir: 'asc' }];
                    break;
                case 'integlog':
                    if (data.columns[1].search.value == '') {
                        data.columns[1].search.value = '=0';
                    }
                    data.order = [{ column: 6, dir: 'asc' }];
                    break;
            }
        }
        return data;
    }

    fnCreateTable(g_table.tableid, g_table.panelid);

    var strajax = '';
    if (g_table.reporttype == 'forcebind') {
        strajax = {
            url: g_table.ajaxurl,
            type: "POST"
        }
    } else {
        strajax = {
            url: g_table.ajaxurl,
            type: "POST",
            data: function (d) {
                return tabledrawdata(d, reporttype);
            },
            dataSrc: tabledatasrc
        }
    }

    table = $('#' + g_table.tableid)
        .on('preXhr.dt', function (e, settings, json) {
            if (json.search.value != '') {
                json.search.value = "like '%" + json.search.value + "%'";
            }
        })
        .on('init.dt', function (e, settings, json) {
            if (g_table.hassearchmodel === true) {
                $.each(searchfields, function (key, val) {
                    if (val.type == 'select' || val.type == 'select2') {
                        var selecttmp = json.options[val.name];
                        if (selecttmp == undefined && val.options.length>0) {
                            selecttmp = val.options;
                        }
                        $('#' + val.id).empty();
                        $('#' + val.id).append('<option value="0">所有' + val.label + '</option>');
                        if (val.id.indexOf('InvId')<0) {
                            $.each(selecttmp, function (i, d) {
                                if (typeof d.label === ('object')) {
                                    $('#' + val.id).append('<option value="' + d.value + '">' + d.label.Name + '</option>');
                                } else {
                                        $('#' + val.id).append('<option value="' + d.value + '">' + d.label + '</option>');
                                }
                            })
                        } else {
                            $.each(selecttmp, function (i, d) {
                                if (typeof d.label === ('object')) {
                                    $('#' + val.id).append('<option value="' + d.value + '">' + d.label.Code+d.label.Name + '</option>');
                                } else {
                                    $('#' + val.id).append('<option value="' + d.value + '">' + d.label + '</option>');
                                }
                            })
                        }

                        if (val.type == 'select2') {
                            $('#' + val.id).select2({
                                dropdownParent: $('#searchModal')
                            });
                        }
                    }
                })
                if (g_table.reporttype == 'currentstock') {
                    if ($('#gparamauthtype').val() != '0') {
                        $("#search-CurrentStock_WhId").val($('#gparamwhid').val());
                        $("#search-CurrentStock_WhId").attr('disabled', true);
                    }
                }
            }
        })
        .DataTable({
            dom: g_table.tabledom,
            processing: true,
            serverSide: true,
            autoWidth: false,
            ajax: strajax,
            columns: tablefields,
            select: 'single',
            buttons: g_table.tablebuttons,
            language: tablelang,
            pageLength: g_table.pagelength,
            drawCallback: function () {
                if (g_table.reporttype == 'busiincome') {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    var lgroup = false;
                    var ogroup = false;
                    var xgroup = false;
                    api.rows({ page: 'current' }).indexes().each(function (k, v) {
                        var rowdata = api.row(rows[k]).data();
                        if (k == 0) {
                            var deptname = '所有门店';
                            if (rowdata.Depts.Name != null) {
                                deptname = rowdata.Depts.Name;
                            }
                            $(rows[k]).before('<tr class="group"><td colspan="8" class="bg-aqua-lighter">0-' + deptname + '</td></tr>');
                        }
                        var lasttype = rowdata.tbBusiIncomeReport.Type.substr(-2);
                        if (lgroup == false && lasttype == '-L') {
                            $(rows[k]).before('<tr class="group"><td colspan="8" class="bg-aqua-lighter">1-本店会员在本店</td></tr>');
                            lgroup = true;
                        }
                        if (ogroup == false && lasttype == '-O') {
                            $(rows[k]).before('<tr class="group"><td colspan="8" class="bg-aqua-lighter">2-他店会员在本店</td></tr>');
                            ogroup = true;
                        }
                        if (xgroup == false && lasttype == '-X') {
                            $(rows[k]).before('<tr class="group"><td colspan="8" class="bg-aqua-lighter">3-本店会员在他店</td></tr>');
                            xgroup = true;
                        }
                        if (rowdata.tbBusiIncomeReport.Type == 'Total') {
                            $(rows[k]).css('font-weight', 'bold');
                        }
                    });
                }
                table.responsive.rebuild();
                table.responsive.recalc();
            }
        });

    if (tablehidecols.length > 0) {
        table.columns(tablehidecols).visible(false);
    }

    if (g_table.hassearchmodel === true) {
        fnCreateSearchModal(g_table.tableid, searchfields);
    }
});