function chartColors(depts) {
    var colors = [];
    colors[0] = "#d71345";
    colors[1] = "#f47920";
    colors[2] = "#ffd400";
    colors[3] = "#45b97c";
    colors[4] = "#009ad6";
    colors[5] = "#145b7d";
    colors[6] = "#8552a1";
    colors[7] = "#ef5b9c";
    colors[8] = "#c37e00";
    colors[9] = "#7fb80e";
    colors[10] = "#225a1f";
    colors[11] = "#fffffb";
    colors[12] = "#563624";
    colors[13] = "#afdfe4";
    colors[14] = "#6a3427";
    colors[15] = "#007d65";
    colors[16] = "#1d953f";
    colors[17] = "#7fb80e";
    colors[18] = "#fedcbd";
    colors[19] = "#f391a9";
    colors[20] = "#90d7ec";
    colors[21] = "#2a5caa";
    colors[22] = "#6f599c";
    colors[23] = "#ea66a6";
    colors[24] = "#d9d6c3";
    colors[25] = "#fcf16e";
    colors[26] = "#f8aba6";
    colors[27] = "#a3cf62";
    colors[28] = "#f0dc70";
    colors[29] = "#50b7c1";
    colors[30] = "#afb4db";

    var rescolors = [];
    for (var i = 0; i < depts.length; i++) {
        rescolors.push(colors[i]);
    }
    return rescolors;
}

function drawLineChart(eleid,chartdata, deptkey, deptlabel) {
    var i = "rgba(0,0,0,0.6)";
    var s = "rgba(255,255,255,0.4)";
    var colors = chartColors(deptkey);
    Morris.Line({
        element: eleid,
        data: chartdata,
        xkey: "x",
        ykeys: deptkey,
        xLabelFormat: function (e) {
            e = e.getDate();
            return e.toString();
        },
        labels: deptlabel,
        lineColors: colors,
        pointFillColors: colors,
        lineWidth: "2px",
        pointStrokeColors: [i, i],
        resize: true,
        gridTextFamily: "Open Sans",
        gridTextColor: s,
        gridTextWeight: "normal",
        gridTextSize: "11px",
        gridLineColor: "rgba(0,0,0,0.5)",
        hideHover: "auto"
    })
};

function drawDonutChart(eleid, sumdeptdata,deptkey) {
    var colors = chartColors(deptkey);
    Morris.Donut({
        element: eleid,
        data: sumdeptdata,
        colors: colors,
        labelFamily: "Open Sans",
        labelColor: "rgba(255,255,255,0.4)",
        labelTextSize: "12px",
        backgroundColor: "#242a30",
        formatter: function (e) {
            var deptvalue = 0;
            $.each(sumdeptdata, function (k, v) {
                if (e == v.value) {
                    deptvalue = v.extra;
                }
            })
            $('#sumdeptchart .widget-chart-sidebar .chart-number .deptvalue').html(deptvalue);
            return e + "%";
        }
    })
};

function LineChartEmotikon(totalsum, deptkey, deptlabel) {
    $('#deptschart ul.chart-emotikon').empty();
    var colors = chartColors(deptkey);
    $('#deptschart  .widget-chart-sidebar .chart-number').html(totalsum);
    for (var i = 0; i < deptkey.length; i++) {
        $('#deptschart ul.chart-emotikon').append('<li><i class="iconfont icon-icon00096 mr-5" style="color:' + colors[i] + '"></i><span>' + deptlabel[i] + '</span></li>');
    }
};

$(document).ready(function () {
    var monthlist = [];

    function createchart(reqdata) {
        panelLoading($('#searchok'));
        $.ajax({
            type: "POST",
            url: "/api/Editor/Data?model=ReportSalesChart",
            data: reqdata,
            dataType: 'json',
            success: function (json) {
                $('#dept-line-chart').empty();
                $('#sumdept-line-chart').empty();
                $('#sumdept-donut-chart').empty();
                $('#sumdeptchart').addClass('hide');
                if (json.data == undefined) {
                    panelLoaded($('#searchok'));
                    addUIAlter('nav.breadcrumb', '获取数据错误', 'error');
                    return false;
                }
                if ($('#dropdown-dept').children().length == 0 && json.options['tbConsItemOther.vcDeptId'] !== undefined) {
                    $('#dropdown-dept').append('<li><a href="javascript:;" class="dropdowndept" id="dept-all">所有门店</a></li>');
                    var deptoptions = json.options['tbConsItemOther.vcDeptId'];
                    $.each(deptoptions,function(k,v) {
                        $('#dropdown-dept').append('<li><a href="javascript:;" class="dropdowndept" id="dept-' + v.value + '">' + v.label + '</a></li>');
                    })

                    $('a.dropdowndept').click(function (e) {
                        var deptid = e.target.id.replace('dept-', '');
                        var name = $(e.target).html();
                        $('#curdept').val(deptid);
                        $('span.deptcurrent').html(name);
                    })
                }

                var deptid = $('#curdept').val();
                var monthid = $('#curmonth').val();
                if (json.data.length == 0) {
                    panelLoaded($('#searchok'));
                    if (deptid == '' || deptid == null || monthid == '' || monthid == null) {
                        $('#deptschart .chart-title').html('请选择查找门店和月份');
                    } else {
                        var deptname = $('#dept-' + deptid).html();
                        var title = monthlist[monthid] + deptname + '销售额日走势（元）'+'<small>所选查找范围内无销售额</small>';
                        $('#deptschart .chart-title').html(title);
                    }
                } else {
                    if (deptid == 'all') {
                        $('#sumdeptchart').removeClass('hide');
                        var title = monthlist[monthid] + '所有门店总体销售额日走势（元）';
                        $('#sumdeptchart .chart-title').html(title);
                        var deptname = $('#dept-' + deptid).html();
                        var title = monthlist[monthid] + deptname + '各自销售额日走势（元）';
                        $('#deptschart .chart-title').html(title);
                    } else {
                        var deptname = $('#dept-' + deptid).html();
                        var title = monthlist[monthid] + deptname + '销售额日走势（元）';
                        $('#deptschart .chart-title').html(title);
                    }
                    var chartdata = [];
                    var resdept = [];
                    var resdeptname = [];
                    var totalsum = 0;
                    var sumchartdata = [];
                    var sumdeptdata = [];
                    $.each(json.data, function (k, v) {
                        totalsum = totalsum + parseFloat(v.tbConsItemOther.SaleFee);
                        var strx=v.tbConsItemOther.year + '-' + v.tbConsItemOther.month + '-' + v.tbConsItemOther.day;
                        var xflag = false;
                        var deptflag = false;
                        $.each(chartdata, function (kk, vv) {
                            if (strx == vv.x) {
                                xflag = true;
                                return false;
                            }
                        })
                        if (!xflag) {
                            chartdata.push({ x: strx });
                            sumchartdata.push({ x: strx ,y:0});
                        }
                        $.each(resdept, function (kk, vv) {
                            if (v.tbConsItemOther.vcDeptId == vv) {
                                deptflag = true;
                                return false;
                            }
                        })
                        if (!deptflag) {
                            resdept.push(v.tbConsItemOther.vcDeptId);
                            resdeptname.push(v.Depts.Name);
                            sumdeptdata.push({ id: v.tbConsItemOther.vcDeptId, label: v.Depts.Name ,value:0});
                        }
                        $.each(chartdata, function (kk, vv) {
                            if (strx == vv.x) {
                                chartdata[kk][v.tbConsItemOther.vcDeptId] = v.tbConsItemOther.SaleFee;
                                return false;
                            }
                        })
                        $.each(sumchartdata, function (kk, vv) {
                            if (strx == vv.x) {
                                sumchartdata[kk].y = sumchartdata[kk].y + parseFloat(v.tbConsItemOther.SaleFee);
                                return false;
                            }
                        })
                        $.each(sumdeptdata, function (kk, vv) {
                            if (v.tbConsItemOther.vcDeptId == vv.id) {
                                sumdeptdata[kk].value = sumdeptdata[kk].value + parseFloat(v.tbConsItemOther.SaleFee);
                                return false;
                            }
                        })
                    })
                    panelLoaded($('#searchok'));
                    if (deptid == 'all') {
                        $.each(sumdeptdata, function (kk, vv) {
                            sumdeptdata[kk].extra = sumdeptdata[kk].value;
                            var percent=sumdeptdata[kk].value / totalsum;
                            sumdeptdata[kk].value = Math.round(percent * 10000) / 100;
                        })
                        drawLineChart('sumdept-line-chart', sumchartdata, ['y'], ['所有门店']);
                        $('#sumdeptchart  .widget-chart-sidebar .chart-number .sumvalue').html(totalsum);
                        drawDonutChart('sumdept-donut-chart', sumdeptdata, resdept);
                    }
                    drawLineChart('dept-line-chart',chartdata,resdept,resdeptname);
                    LineChartEmotikon(totalsum, resdept, resdeptname);
                }
            },
            error: function (e) {
                panelLoaded($('#searchok'));
                var errobj = eval("(" + e.responseText + ")");
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
            }
        })
    }

    for (var i = 0; i < 12; i++) {
        var month = moment().subtract(i, 'months').format('YYYYMM');
        monthlist.push(month);
        $('#dropdown-month').append('<li><a href="javascript:;" class="dropdownmonth" id="month-' + i + '">' + month + '</a></li>');
    }
    
    $('a.dropdownmonth').click(function (e) {
        var monthid = e.target.id.replace('month-', '');
        var name = $(e.target).html();
        $('#curmonth').val(monthid);
        $('span.monthcurrent').html(name);
    })

    var reqdata = {
        draw: 1,
        columns: [
            {
                data: 'tbConsItemOther.vcDeptId',
                name: '',
                searchable: true,
                orderable: true,
                search: { value: '', regex: false }
            }, {
                data: 'tbConsItemOther.year',
                name: '',
                searchable: true,
                orderable: true,
                search: { value: '1900', regex: false }
            }, {
                data: 'tbConsItemOther.month',
                name: '',
                searchable: true,
                orderable: true,
                search: { value: '01', regex: false }
            }

        ],
        order: [
            { column: 0, dir: 'asc' }
        ],
        start: 0,
        length: 1,
        search: { value: '', regex: false }
    };
    createchart(reqdata);

    $('#searchok').click(function () {
        var deptid = $('#curdept').val();
        var monthid = $('#curmonth').val();
        if (deptid == '' || deptid == null || monthid == '' || monthid == null) {
            addUIAlter('nav.breadcrumb', '请选择查找门店和月份', 'error');
            return false
        }
        if (deptid == 'all') {
            deptid = '';
        }
        var stryear = monthlist[monthid].substr(0, 4);
        var strmonth = monthlist[monthid].substr(4, 2);
        var reqdata = {
            draw: 1,
            columns: [
                {
                    data: 'tbConsItemOther.vcDeptId',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: deptid, regex: false }
                }, {
                    data: 'tbConsItemOther.year',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: stryear, regex: false }
                }, {
                    data: 'tbConsItemOther.month',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: strmonth, regex: false }
                }, {
                    data: 'tbConsItemOther.day',
                    name: '',
                    searchable: true,
                    orderable: true,
                    search: { value: '', regex: false }
                }
            ],
            order: [
                { column: 3, dir: 'asc' }
            ],
            start: 0,
            length: -1,
            search: { value: '', regex: false }
        };
        createchart(reqdata);
    })
})