var HighchartsColors = {}

$(document).ready(function () {
    HighchartsColors = GetColorsForTouristsStrengthPieChartDraw();
    GetSeriesTouristsStrength(BuiltTouristStrengthPieChart);
})

function GetColorsForTouristsStrengthPieChartDraw() {
    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });
    return Highcharts;
}

function BuiltTouristStrengthPieChart(series, Highcharts) {
    // Build the chart
    $('#touristsStrengthPieChart').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Возраста туристов'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: 'Возроста',
            data: series
        }]
    });
}

function GetSeriesTouristsStrength(callback) {  
    var touristsStrength = [];
    $.ajax({
        url: '/Admin/GetTouristsStrength',
        cache: false,
        success: function (data) {
            touristsStrength = JSON.parse(data);
            var series = ConvertTouristStrengthToSeries(touristsStrength);
            callback(series, HighchartsColors);
        },
    });

    
}

function ConvertTouristStrengthToSeries(touristsStrength) {
    var touristsStrengthData = [];
    touristsStrengthData[0] = { name: "0-10", y: 0 };
    touristsStrengthData[1] = { name: "11-20", y: 0 };
    touristsStrengthData[2] = { name: "21-30", y: 0 };
    touristsStrengthData[3] = { name: "31-40", y: 0 };
    touristsStrengthData[4] = { name: "41-50", y: 0 };
    touristsStrengthData[5] = { name: "51-60", y: 0 };
    touristsStrengthData[6] = { name: "61+", y: 0 };
    for (var i = 0; i < touristsStrength.length; i++) {
        if (touristsStrength[i] < 11)
            touristsStrengthData[0].y++;
        else
            if (touristsStrength[i] > 10 && touristsStrength[i] < 21)
                touristsStrengthData[1].y++;
            else
                if (touristsStrength[i] > 20 && touristsStrength[i] < 31)
                    touristsStrengthData[2].y++;
                else
                    if (touristsStrength[i] > 30 && touristsStrength[i] < 41)
                        touristsStrengthData[3].y++;
                    else
                        if (touristsStrength[i] > 40 && touristsStrength[i] < 51)
                            touristsStrengthData[4].y++;
                        else
                            if (touristsStrength[i] > 50 && touristsStrength[i] < 61)
                                touristsStrengthData[5].y++;
                            else
                                if (touristsStrength[i] > 61)
                                    touristsStrengthData[6].y++;
    }

    for (var i = 0; i < touristsStrengthData.length; i++)
        touristsStrengthData[i].y = (touristsStrengthData[i].y / touristsStrength.length) * 100;
    return touristsStrengthData;
}