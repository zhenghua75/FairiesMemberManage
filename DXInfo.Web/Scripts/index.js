var getMonthName = function (e) {
    var t = [];
    t[0] = "January";
    t[1] = "February";
    t[2] = "March";
    t[3] = "April";
    t[4] = "May";
    t[5] = "Jun";
    t[6] = "July";
    t[7] = "August";
    t[8] = "September";
    t[9] = "October";
    t[10] = "November";
    t[11] = "December";
    return t[e]
};

var getDate = function (e) {
    var t = new Date(e);
    var n = t.getDate();
    var r = t.getMonth() + 1;
    var i = t.getFullYear();
    if (n < 10) {
        n = "0" + n
    }
    if (r < 10) {
        r = "0" + r
    }
    t = i + "-" + r + "-" + n;
    return t
};

var handleVisitorsLineChart = function () {
    var e = "#5eb95e";
    var t = "#5eb95e";
    var n = "#5a98de";
    var r = "#5a98de";
    var i = "rgba(0,0,0,0.6)";
    var s = "rgba(255,255,255,0.4)";
    Morris.Line({
        element: "visitors-line-chart",
        data: [{
            x: "2014-02-01",
            y: 60,
            z: 30
        }, {
            x: "2014-03-01",
            y: 70,
            z: 40
        }, {
            x: "2014-04-01",
            y: 40,
            z: 10
        }, {
            x: "2014-05-01",
            y: 100,
            z: 70
        }, {
            x: "2014-06-01",
            y: 40,
            z: 10
        }, {
            x: "2014-07-01",
            y: 80,
            z: 50
        }, {
            x: "2014-08-01",
            y: 70,
            z: 40
        }],
        xkey: "x",
        ykeys: ["y", "z"],
        xLabelFormat: function (e) {
            e = getMonthName(e.getMonth());
            return e.toString()
        },
        labels: ["Page Views", "Unique Visitors"],
        lineColors: [e, n],
        pointFillColors: [t, r],
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

var handleVisitorsDonutChart = function () {
    var e = "#5eb95e";
    var t = "#5a98de";
    Morris.Donut({
        element: "visitors-donut-chart",
        data: [{
            label: "New Visitors",
            value: 900
        }, {
            label: "Return Visitors",
            value: 1200
        }],
        colors: [e, t],
        labelFamily: "Open Sans",
        labelColor: "rgba(255,255,255,0.4)",
        labelTextSize: "12px",
        backgroundColor: "#242a30"
    })
};

var mainController = function () {
    "use strict";
    return {
        init: function () {
            handleVisitorsLineChart();
            handleVisitorsDonutChart();
        }
    }
}()

$(document).ready(function () {
    if ($('div.assfee').length > 0 || $('div.tailfee').length > 0 || $('div.fillfee').length > 0) {
        $.ajax({
            url: '/api/App/SaleFillSummary?vcDeptId=',
            dataType: 'json',
            success: function (json) {
                var assfee = {
                    yesterday: 0,
                    lastweek: 0,
                    month: 0,
                    lastmonth: 0
                }
                var tailfee = {
                    yesterday: 0,
                    lastweek: 0,
                    month: 0,
                    lastmonth: 0
                }
                var fillfee = {
                    yesterday: 0,
                    lastweek: 0,
                    month: 0,
                    lastmonth: 0
                }
                $.each(json.Yesterday, function (k, v) {
                    switch (v.vcConsType) {
                        case 'PT001':
                            assfee.yesterday = v.ConsFee;
                            break;
                        case 'PT002':
                            tailfee.yesterday += v.ConsFee;
                            break;
                        case 'PT008':
                            tailfee.yesterday += v.ConsFee;
                            break;
                        case 'Fill':
                            fillfee.yesterday += v.ConsFee;
                            break;
                        case 'FillBank':
                            fillfee.yesterday += v.ConsFee;
                            break;
                    }
                })
                $.each(json.LastWeek, function (k, v) {
                    switch (v.vcConsType) {
                        case 'PT001':
                            assfee.lastweek = v.ConsFee;
                            break;
                        case 'PT002':
                            tailfee.lastweek += v.ConsFee;
                            break;
                        case 'PT008':
                            tailfee.lastweek += v.ConsFee;
                            break;
                        case 'Fill':
                            fillfee.lastweek += v.ConsFee;
                            break;
                        case 'FillBank':
                            fillfee.lastweek += v.ConsFee;
                            break;
                    }
                })
                $.each(json.Month, function (k, v) {
                    switch (v.vcConsType) {
                        case 'PT001':
                            assfee.month = v.ConsFee;
                            break;
                        case 'PT002':
                            tailfee.month += v.ConsFee;
                            break;
                        case 'PT008':
                            tailfee.month += v.ConsFee;
                            break;
                        case 'Fill':
                            fillfee.month += v.ConsFee;
                            break;
                        case 'FillBank':
                            fillfee.month += v.ConsFee;
                            break;
                    }
                })
                $.each(json.LastMonth, function (k, v) {
                    switch (v.vcConsType) {
                        case 'PT001':
                            assfee.lastmonth = v.ConsFee;
                            break;
                        case 'PT002':
                            tailfee.lastmonth += v.ConsFee;
                            break;
                        case 'PT008':
                            tailfee.lastmonth += v.ConsFee;
                            break;
                        case 'Fill':
                            fillfee.lastmonth += v.ConsFee;
                            break;
                        case 'FillBank':
                            fillfee.lastmonth += v.ConsFee;
                            break;
                    }
                })
                var strfee = '<span>' + Math.round(assfee.yesterday * 100) / 100 + '</span>/<span>' + Math.round(assfee.month * 100) / 100 + '</span>';
                var perc1 = Math.round(((assfee.yesterday - assfee.lastweek) / assfee.lastweek) * 10000) / 100;
                var perc2 = Math.round(((assfee.month - assfee.lastmonth) / assfee.lastmonth) * 10000) / 100;
                if (assfee.lastweek==0) {
                    perc1 = 0;
                }
                if (assfee.lastmonth==0) {
                    perc2 = 0;
                }
                var strpercent = '环比上涨(' + perc1 + '%/' + perc2 + '%)';
                $('div.stats-number.assfee').html(strfee);
                $('div.stats-desc.asspercent').html(strpercent);

                strfee = '<span>' + Math.round(tailfee.yesterday * 100) / 100 + '</span>/<span>' + Math.round(tailfee.month * 100) / 100 + '</span>';
                perc1 = Math.round(((tailfee.yesterday - tailfee.lastweek) / tailfee.lastweek) * 10000) / 100;
                perc2 = Math.round(((tailfee.month - tailfee.lastmonth) / tailfee.lastmonth) * 10000) / 100;
                if (tailfee.lastweek==0) {
                    perc1 = 0;
                }
                if (tailfee.lastmonth == 0) {
                    perc2 = 0;
                }
                strpercent = '环比上涨(' + perc1 + '%/' + perc2 + '%)';
                $('div.stats-number.tailfee').html(strfee);
                $('div.stats-desc.tailpercent').html(strpercent);

                strfee = '<span>' + Math.round(fillfee.yesterday * 100) / 100 + '</span>/<span>' + Math.round(fillfee.month * 100) / 100 + '</span>';
                perc1 = Math.round(((fillfee.yesterday - fillfee.lastweek) / fillfee.lastweek) * 10000) / 100;
                perc2 = Math.round(((fillfee.month - fillfee.lastmonth) / fillfee.lastmonth) * 10000) / 100;
                if (fillfee.lastweek == 0) {
                    perc1 = 0;
                }
                if (fillfee.lastmonth == 0) {
                    perc2 = 0;
                }
                strpercent = '环比上涨(' + perc1 + '%/' + perc2 + '%)';
                $('div.stats-number.fillfee').html(strfee);
                $('div.stats-desc.fillpercent').html(strpercent);
            }
        })
    }

    var whid = $('#gparamuserwhid').val();
    if (whid != '') {
        var datetmp = new Date();
        var today = datetmp.getFullYear() + '-' + (datetmp.getMonth() + 1) + '-' + datetmp.getDate();
        datetmp = new Date(datetmp.getFullYear(), datetmp.getMonth(), datetmp.getDate() - 6);
        var firstday = datetmp.getFullYear() + '-' + (datetmp.getMonth() + 1) + '-' + datetmp.getDate();
        var makedate = "between '" + firstday + "' and '" + today + " 23:59:59'";
        $.ajax({
            type: "POST",
            url: "/api/Editor/Data?model=Vouch&VouchType=012",
            data: {
                draw: 1,
                columns: [
                    {
                        data: 'Vouch.MakeTime',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: makedate, regex: false }
                    }, {
                        data: 'Vouch.VouchType',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=012 and (Vouch.FromWhId=' + whid + ' or Vouch.ToWhId=' + whid + ')', regex: false }
                    }, {
                        data: 'Vouch.IsVerify',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=1', regex: false }
                    }
                ],
                order: [
                    { column: 0, dir: 'asc' }
                ],
                start: 0,
                length: -1,
                search: { value: '', regex: false }
            },
            dataType: 'json',
            success: function (json) {
                if (json.data != undefined) {
                    var mixmv = {
                        unfinal: 0,
                        total: 0
                    };
                    var makeupmv = {
                        unfinal: 0,
                        total: 0
                    };
                    $.each(json.data, function (k, v) {
                        if (v.Vouch.ToWhId == whid) {
                            mixmv.total += 1;
                            if (v.OtherInStock.IsVerify == false || v.OtherInStock.IsVerify == null) {
                                mixmv.unfinal += 1;
                            }
                        }
                        if (v.Vouch.FromWhId == whid) {
                            makeupmv.total += 1;
                            if (v.OtherInStock.IsVerify == false || v.OtherInStock.IsVerify == null) {
                                makeupmv.unfinal += 1;
                            }
                        }
                    })
                    $('div.stats-number.mixmv').html('<span>' + mixmv.unfinal + '</span>/<span>' + mixmv.total + '</span>');
                    $('div.stats-number.makeupmv').html('<span>' + makeupmv.unfinal + '</span>/<span>' + makeupmv.total + '</span>');
                }
            }
        })

        if ($('#gparamauthtype').val()=='0') {
            $.ajax({
                type: "POST",
                url: "/api/Editor/Data?model=Vouch&VouchType=004",
                data: {
                    draw: 1,
                    columns: [
                        {
                            data: 'Vouch.VouchType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=004', regex: false }
                        }, {
                            data: 'Vouch.BusType',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: "in('020','021','022')", regex: false }
                        }, {
                            data: 'Vouch.IsVerify',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=0', regex: false }
                        }, {
                            data: 'Vouch.ToWhId',
                            name: '',
                            searchable: true,
                            orderable: true,
                            search: { value: '=' + whid, regex: false }
                        }
                    ],
                    order: [
                        { column: 0, dir: 'asc' }
                    ],
                    start: 0,
                    length: -1,
                    search: { value: '', regex: false }
                },
                dataType: 'json',
                success: function (json) {
                    if (json.data != undefined && json.data.length>0) {
                        var total = json.data.length;
                        var strshoplose = '<div class="col-md-3 col-sm-6 mb-10">' +
                            '<a href="/StockMg/Vouch?type=004">' +
                            '<div class="widget widget-stats bg-red">' +
                            '<div class="warninginfo">您有 ' + total + ' 张门店报损类的单据未审核，请尽快处理</div>' +
                            '</div></a></div>';
                        $('.haoinfo').children('div:first').before(strshoplose);
                    }
                }
            })
        }

        $.ajax({
            type: "POST",
            url: "/api/Editor/Data?model=Vouch&VouchType=015",
            data: {
                draw: 1,
                columns: [
                    {
                        data: 'Vouch.VouchType',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=015', regex: false }
                    }, {
                        data: 'Vouch.BusType',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=018', regex: false }
                    }, {
                        data: 'Vouch.IsVerify',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=0', regex: false }
                    }, {
                        data: 'Vouch.ToWhId',
                        name: '',
                        searchable: true,
                        orderable: true,
                        search: { value: '=' + whid, regex: false }
                    }
                ],
                order: [
                    { column: 0, dir: 'asc' }
                ],
                start: 0,
                length: -1,
                search: { value: '', regex: false }
            },
            dataType: 'json',
            success: function (json) {
                if (json.data != undefined && json.data.length > 0) {
                    var total = json.data.length;
                    var strshoplose = '<div class="col-md-3 col-sm-6 mb-10">' +
                        '<a href="/StockMg/Vouch?type=015">' +
                        '<div class="widget widget-stats bg-red">' +
                        '<div class="warninginfo">您有 ' + total + ' 张零售出库单未审核，请尽快处理</div>' +
                        '</div></a></div>';
                    $('.haoinfo').children('div:first').before(strshoplose);
                }
            }
        })
    }
})