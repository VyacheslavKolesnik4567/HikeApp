$(document).ready(function () {
    $("#dateBeginFilterInput").datepicker();
    $("#dateBeginFilterInput").datepicker("option", "dateFormat", "dd.mm.yy");
    $("#dateBeginFilterInput").val(GetTodayDate);

    $("#dateEndFilterInput").datepicker();
    $("#dateEndFilterInput").datepicker("option", "dateFormat", "dd.mm.yy");


    var hikes = $(".hikeContainer");
    for (var i = 0; i < hikes.length; i++) {
        $(hikes[i]).attr("priceFilterValid", "true");
        $(hikes[i]).attr("difficultyFilterValid", "true");
        $(hikes[i]).attr("dateEndFilterValid", "true");
        $(hikes[i]).attr("dateBeginFilterValid", "true");
        $(hikes[i]).attr("headFilterValid", "true");
    }
    hikesCount = hikes.length;
});

function ClearFilter(name) {
    $("#" + name + "FilterInput").val("");
    var functionName = name + "FilterActivate";
    var func = window[functionName];
    func();
}

function headFilterActivate() {
    if ($("#headFilterInput").val() == "") {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++)
            CheckHikeOnFilters(hikes[i]);
    }
    var hikes = $(".hikeContainer");
    for (var i = 0; i < hikes.length; i++) {
        var hikeInfo = $(hikes[i]).children(".hikeInfoContainer");
        var hikeHead = $(hikeInfo).children(".hikeInfo")[0];
        var hikeHeadName = $(hikeHead).text().split(':')[1].toLowerCase();

        if (hikeHeadName.indexOf($("#headFilterInput").val().toLowerCase()) == -1) {
            $(hikes[i]).css("display", "none");
            $(hikes[i]).attr("headFilterValid", "false");
        }
        else {
            $(hikes[i]).attr("headFilterValid", "true");
            CheckHikeOnFilters(hikes[i]);
        }
    }
}

function dateBeginFilterActivate() {
    if ($("#dateBeginFilterInput").val() == "") {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++)
            CheckHikeOnFilters(hikes[i]);
    }
    var hikes = $(".hikeContainer");
    for (var i = 0; i < hikes.length; i++) {
        var hikeInfo = $(hikes[i]).children(".hikeInfoContainer");
        var hikeDateBegin = $($(hikeInfo).children(".hikeInfo")[1]).text().split(':')[1];
        var dateBegin = new Date(hikeDateBegin.split('.')[2], hikeDateBegin.split('.')[1], hikeDateBegin.split('.')[0]);
        var dmy = $("#dateBeginFilterInput").val().split('.');
        var filterDate = new Date(dmy[2], dmy[1], dmy[0]);

        if (dateBegin < filterDate) {
            $(hikes[i]).css("display", "none");
            $(hikes[i]).attr("dateBeginFilterValid", "false");
        }
        else {
            $(hikes[i]).attr("dateBeginFilterValid", "true");
            CheckHikeOnFilters(hikes[i]);
        }
    }
}

function dateEndFilterActivate() {
    if ($("#dateEndFilterInput").val() == "") {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++)
            CheckHikeOnFilters(hikes[i]);
    }
    var hikes = $(".hikeContainer");
    for (var i = 0; i < hikes.length; i++) {
        var hikeInfo = $(hikes[i]).children(".hikeInfoContainer");
        var hikeDateEnd = $($(hikeInfo).children(".hikeInfo")[2]).text().split(':')[1];
        var dateEnd = new Date(hikeDateEnd.split('.')[2], hikeDateEnd.split('.')[1], hikeDateEnd.split('.')[0]);
        var dmy = $("#dateEndFilterInput").val().split('.');
        var filterDate = new Date(dmy[2], dmy[1], dmy[0]);

        if (dateEnd > filterDate) {
            $(hikes[i]).css("display", "none");
            $(hikes[i]).attr("dateEndFilterValid", "false");
        }
        else {
            $(hikes[i]).attr("dateEndFilterValid", "true");
            CheckHikeOnFilters(hikes[i]);
        }
    }
}

function difficultyFilterActivate() {
    if ($("#difficultyFilterInput").val() == "") {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++)
            CheckHikeOnFilters(hikes[i]);
    }
    var reg = /^[0-9]{1,2}$/;
    var filterValue = $("#difficultyFilterInput").val();
    if (!reg.test(filterValue))
        $("#difficultyFilterInput").val(filterValue.substr(0, filterValue.length - 1));
    else {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++) {
            var hikeInfo = $(hikes[i]).children(".hikeInfoContainer");
            var hikeDifficulty = $(hikeInfo).children(".hikeInfo")[3];
            var hikeDifficultyVal = parseInt($(hikeDifficulty).text().split(':')[1]);

            if (hikeDifficultyVal >= $("#difficultyFilterInput").val()) {
                $(hikes[i]).css("display", "none");
                $(hikes[i]).attr("difficultyFilterValid", "false");
            }
            else {
                $(hikes[i]).attr("difficultyFilterValid", "true");
                CheckHikeOnFilters(hikes[i]);
            }
        }
    }
    if ($("#difficultyFilterInput").val() == "") {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++)
            $(hikes[i]).css("display", "block");
    }
}

function priceFilterActivate() {
    if ($("#priceFilterInput").val() == "") {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++) {
            $(hikes[i]).attr("priceFilterValid", "true");
            CheckHikeOnFilters(hikes[i]);
        }
    }
    var reg = /[0-9]{1,}\-[0-9]{1,}/;
    var regSymbol = /([0-9\-])/;
    var filterValue = $("#priceFilterInput").val();
    if (!regSymbol.test(filterValue[filterValue.length - 1]))
        $("#priceFilterInput").val(filterValue.substr(0, filterValue.length - 1));

    if (reg.test(filterValue) && parseFloat(filterValue.split('-')[0]) < parseFloat(filterValue.split('-')[1])) {
        var hikes = $(".hikeContainer");
        for (var i = 0; i < hikes.length; i++) {
            var hikeInfo = $(hikes[i]).children(".hikeInfoContainer");
            var hikePrice = $(hikeInfo).children(".hikeInfo")[7];
            var hikePriceVal = parseFloat($(hikePrice).text().split(':')[1].split(' ')[1]);

            var filterPrice = filterValue.split('-');

            if (hikePriceVal < parseFloat(filterPrice[1]) && hikePriceVal > parseFloat(filterPrice[0])) {
                $(hikes[i]).attr("priceFilterValid", "true");
                CheckHikeOnFilters(hikes[i]);
            }
            else {                
                $(hikes[i]).css("display", "none");
                $(hikes[i]).attr("priceFilterValid", "false");
            }
        }
    }
}

function CheckHikeOnFilters(hike) {
    if ($(hike).attr("priceFilterValid") == "true" && $(hike).attr("difficultyFilterValid") == "true" && $(hike).attr("dateEndFilterValid") == "true" && $(hike).attr("dateBeginFilterValid") == "true" && $(hike).attr("headFilterValid") == "true")
        $(hike).css("display", "block");
    else
        $(hike).css("display", "none");
}

function FilterCheck(head, dateBegin, dateEnd, difficulty, price) {
    var filterPrice = $("#priceFilterInput").val();
    var filterDifficulty = $("#difficultyFilterInput").val();
    var dmy = $("#dateEndFilterInput").val().split('.');
    var filterDateEnd = new Date(dmy[2], dmy[1], dmy[0]);
    var dmy = $("#dateBeginFilterInput").val().split('.');
    var filterDateBegin = new Date(dmy[2], dmy[1], dmy[0]);
    var filterHead = $("#headFilterInput").val();

    var hikeDateBegin = new Date(dateBegin.split('.')[2], dateBegin.split('.')[1], dateBegin.split('.')[0]);
    var hikeDateEnd = new Date(dateEnd.split('.')[2], dateEnd.split('.')[1], dateEnd.split('.')[0]);

    if (head.indexOf(filterHead) == -1)
        return false;
    if (hikeDateBegin < filterDateBegin && filterDateBegin != "")
        return false;
    if (hikeDateEnd > filterDateEnd && filterDateEnd != "")
        return false;
    if (difficulty > filterDifficulty && filterDifficulty != "")
        return false;

    if ((parseInt(price) > filterPrice.split('-')[1] || parseInt(price) < filterPrice.split('-')[0]) && filterPrice != "")
        return false;

    return true;
}