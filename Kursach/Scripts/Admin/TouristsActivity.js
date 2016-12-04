$(document).ready(function () {
    GetTouristsActivity(TouristsActivityChartDrawing);
})

function TouristsActivityChartDrawing(dataActivity) { 
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'activityChart',
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25,
            }
        },
        legend: {enabled: false},
        width: 800,
        xAxis: {
            categories: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Число туристов'
            }
        },
        title: {
            text: 'Активность туристов по месяцам'
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
            name: "",
            data: dataActivity
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

function GetTouristsActivity(callback) {
    var months = {};
    $.ajax({
        url: '/Admin/TouristsActivityByMounths',
        cache: false,
        success: function (data) {
            months = JSON.parse(data);
            var mas = [];
            for (var i = 1; i < 13; i++)
                mas[i - 1] = months[i];
            dataActivity = mas;
            callback(dataActivity);
        },
    });
}