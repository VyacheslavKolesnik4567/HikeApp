function GetHeadsHikes() {
    $.ajax({
        url: '/Admin/GetHeadsHikes',
        cache: false,
        success: function (data) {
            AllDB.headHikes = JSON.parse(data);
            var colNames = ["Руководитель", "Номер похода", "Тип байдарок", "Маршрут", "Сложность", "Дата начала", "Дата конца", "Цена"];
            ShowHeadHikes();
        },
    });
    if ($("#headsNames").attr("disabled")) {
        $("#headsNames").removeAttr("disabled");
    }
}

function UpdHeadHikes() {  
    GetHeadsHikes();
    ShowMessage("Данные обновлены");     
}

function ShowHeadHikes() {
    var headId = $("#headsNames").val();

    var colNames = ["Руководитель", "Номер похода", "Тип байдарок", "Маршрут", "Сложность", "Дата начала", "Дата конца", "Цена"];
    for (var i = 0; i < AllDB.headHikes.length; i++)
        if (AllDB.headHikes[i].headId == headId) {
            $("#headHikes").html("");
            HeadHikesReportBuild(AllDB.headHikes[i], colNames);           
        }
}

function HeadHikesReportBuild(data, colNames)
{
    if (data.hikes.length === 0) {       
        $("#headHikes").html("У данного руководителя пока нет прошедших походов.");
    }
    else {
        var table = document.createElement("table");
        $(table).addClass("headHikesReport");
        var col = document.createElement("td");
        var row = document.createElement("tr");

        //Header==========================
        $(row).addClass("hikeHeader");
        for (var i = 0; i < colNames.length; i++) {
            col = document.createElement("td");
            $(col).html(colNames[i]);
            row.appendChild(col);
        }
        table.appendChild(row);
        //====================================
        var sumDifficulty = 0;
        var hikesLen = 0;
        var sumPrice = 0;
        for (var i = 0; i < data.hikes.length; i++) {
            //hikeData=============================
            sumDifficulty += data.hikes[i]["difficulty"];
            sumPrice += parseFloat(data.hikes[i]["price"]);
            hikesLen += getDayDelta(data.hikes[i]["dateEnd"], data.hikes[i]["dateBegin"]);
            row = document.createElement("tr");
            $(row).addClass("hike");
            for (var j in data.hikes[i]) {
                if (j != "tourists") {
                    col = document.createElement("td");
                    $(col).html(data.hikes[i][j]);
                    if (typeof data.hikes[i][j] === "number" || j == "price")
                        $(col).css("text-align", "right");
                    row.appendChild(col);
                }
            }
            table.appendChild(row);
            //=====================================

            //touristsList==========================
            var tourists = document.createElement("tr");
            col = document.createElement("td");
            col.colSpan = 8;
            $(col).html("Туристы +");
            tourists.appendChild(col);
            $(tourists).addClass("tourists");
            table.appendChild(tourists);

            //Header tourists======================
            row = document.createElement("tr");
            $(row).addClass("headerTourists");

            col = document.createElement("td");
            $(col).html("Имя туриста");
            row.appendChild(col);

            col = document.createElement("td");
            $(col).html("Дата рождения");
            row.appendChild(col);

            col = document.createElement("td");
            $(col).html("Телефон");
            row.appendChild(col);

            $($(row).children().last()).css("border-right", "1px solid gray");
            table.appendChild(row);
            //====================================     

            //touristsData=========================
            for (var l = 0; l < data.hikes[i].tourists.length; l++) {
                row = document.createElement("tr");
                $(row).addClass("tourist");
                for (var k in data.hikes[i].tourists[l]) {
                    col = document.createElement("td");
                    $(col).html(data.hikes[i].tourists[l][k]);
                    row.appendChild(col);
                }
                table.appendChild(row);
            }
            $(tourists).nextUntil('tr.tourists').css("display", "none");
            //===================================            
        }
        //Result=============================
        var countHikes = data.hikes.length;
        var avgDifficulty = sumDifficulty / countHikes;
        var allHikesLen = hikesLen;
        var avgHikesLen = hikesLen / countHikes;
        var allPrice = sumPrice;
        var avgPrice = sumPrice / countHikes;
        //resultHeader================================
        row = document.createElement("tr");
        $(row).addClass("hikeResultHeader");
        var resultHeaderNames = ["Итог", "Количество походов", "Средняя сложность",
            "Общая продолжительность", "Средняя продолжительность",
            "Общая прибыль с одного туриста", "Средняя прибыль с одного туриста"];
        for (var i = 0; i < resultHeaderNames.length; i++) {
            col = document.createElement("td");
            $(col).html(resultHeaderNames[i]);
            row.appendChild(col);
            if (i == 0) {
                col = document.createElement("td");
                row.appendChild(col);
            }
        }
        table.appendChild(row);
        //==========================================
        //Result data===============================
        var resultData = [countHikes, avgDifficulty, allHikesLen, avgHikesLen, allPrice.toFixed(2), avgPrice.toFixed(2)];
        row = document.createElement("tr");
        $(row).addClass("hike"); 
        for (var i = 0; i < resultData.length + 2; i++) {
            col = document.createElement("td");
            $(col).css("text-align", "right");
            if (i > 1)
                $(col).html(resultData[i - 2]);
            row.appendChild(col);
        }
        table.appendChild(row);
        //==========================================
        $("#headHikes").html("");
        $("#headHikes").append(table);

        $('.tourists').click(function () {
            $(this).nextUntil('tr.hike').slideToggle(0);
            if ($(this).text() == "Туристы +")
                $($(this).children()[0]).text("Туристы -");
            else
                $($(this).children()[0]).text("Туристы +");
            $($(".hikeResultHeader")[0]).css("display", "table-row");
        });
    }
}

function FillHeadsNamesSelect(data) {
    $("#headsNames").html("");
    for (var j in data) {
        $("#headsNames").append("<option value='" + j + "'>" + data[j] + "</option>");
    }
}

function getDayDelta(dateStr1, dateStr2) {
    var mas1 = dateStr1.split('.');
    var mas2 = dateStr2.split('.');
    var date1 = new Date(mas1[2],mas1[1],mas1[0]);
    var date2 = new Date(mas2[2], mas2[1], mas2[0]);

    return Math.round((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

function Print() {
    window.open('/Admin/HeadHikesPrint?headId=' + $("#headsNames").val());
}