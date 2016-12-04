$(document).ready(function () {
    var queryStr = parseQueryString(decodeURI(window.location.search));

    var dateStart = queryStr["DateStart"];
    $("#DateStart").text(dateStart);
    var dateEnd = queryStr["DateEnd"];
    $("#DateEnd").text(dateEnd);
    var head = queryStr["HeadFullName"];
    $("#HeadFullName").text(head);
    var dif = queryStr["Difficulty"];
    $("#Difficulty").text(dif);
    var path = queryStr["Path"];
    $("#Path").text(path);
    var tourist = queryStr["touristName"].split(' ');
    $("#TouristFullName").html(tourist[0] + "<br>" + tourist[1]);
    var kayak = queryStr["Kayak"];
    $("#Kayak").text(kayak);
    var kayakNum = queryStr["kayak"];
    $("#KayakNum").text(kayakNum);
    var placeNum = queryStr["place"];
    $("#PlaceNum").text(placeNum);
});

var parseQueryString = function (strQuery) {
    var i,
        tmp = [],
        tmp2 = [],
        objRes = {};
    if (strQuery != '') {
        tmp = (strQuery.substr(1)).split('&');
        for (i = 0; i < tmp.length; i += 1) {
            tmp2 = tmp[i].split('=');
            if (tmp2[0]) {
                objRes[tmp2[0]] = tmp2[1];
            }
        }
    }
    return objRes;
};
