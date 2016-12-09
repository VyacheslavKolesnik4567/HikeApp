var dataHikesLen = {};

$(document).ready(function () {
    GetHikesLen(HikesLenChartDrawing);
})

function HikesLenChartDrawing(dataHikesLen) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'hikesLenChart',
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25,

            }
        },
        legend: { enabled: false },
        width: 800,
        xAxis: {
            categories: dataHikesLen.categories
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Количество походов'
            }
        },
        title: {
            text: 'График длительности походов'
        },
        //subtitle: {
        //    text: 'Test options by dragging the sliders below'
        //},
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: [{
            name: 'Дни',
            data: dataHikesLen.mas
        }],

    });

    function showValues() {
        //$('#alpha-value').html(chart.options.chart.options3d.alpha);
        //$('#beta-value').html(chart.options.chart.options3d.beta);
        //$('#depth-value').html(chart.options.chart.options3d.depth);
    }

    // Activate the sliders
    $('#sliders input').on('input change', function () {
        chart.options.chart.options3d[this.id] = this.value;
        showValues();
        chart.redraw(false);
    });

    showValues();
}

function GetHikesLen(callback) {
    var hikesLen = {};
    $.ajax({
        url: '/Admin/HikesLength',
        cache: false,
        success: function (data) {
            hikesLen = JSON.parse(data);

            var hikesLenData = {};
            hikesLenData["mas"] = [];
            hikesLenData["categories"] = [];
            var j = 0;
            for (var i in hikesLen) {
                hikesLenData["mas"][j] = hikesLen[i];
                hikesLenData["categories"][j] = i;
                j++;
            }
            dataHikesLen = hikesLenData;
            callback(dataHikesLen);
        },
    });
    
}

