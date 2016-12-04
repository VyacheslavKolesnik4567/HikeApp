var kayakNumber = 1;
var kayaksCount = 0;
var hikesCount = 2;

function GetTodayDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '.' + mm + '.' + yyyy;
    return today;
}

function ExpandHikeDesc(hikeId) {
    var width = $($(".hikeContainer")[0]).width();
    if ($("#hikeDesc_" + hikeId).css("display") == "none") {
        $("#imgExpand_" + hikeId).css("transform", "rotate(180deg)");
        var parent = $("#imgExpand_" + hikeId).parents()[2];
        $("#hikeDesc_" + hikeId).css("top", parent.offsetTop + $(parent).height() - 3);
        $("#hikeDesc_" + hikeId).width(width - 22);
        $("#hikeDesc_" + hikeId).slideDown();
        
    }
    else {
        $("#imgExpand_" + hikeId).css("transform", "rotate(0deg)");
        $("#hikeDesc_" + hikeId).slideUp();
    }
}

function RegistrationToHikeOpen(hikeId) {  
    GetHikeInfoForRegForm(hikeId);
}

function GetHikeInfoForRegForm(hikeId) {
    GetKayaksPropertyForHike(hikeId, function (kayakProperty) {
        GetHikeTouristsInfo(hikeId, function (touristsInfo) {
            FillRegistrationToHikeForm(hikeId, kayakProperty, touristsInfo);
            $(".PopUpBack").css("display", "block");
            $("#popUpRegistrationToHike").slideDown();
        });
    });
}

function FillRegistrationToHikeForm(hikeId, kayakProperty, touristsInfo) {
    kayakNumber = 1;
    $("#rightArrow").css("opacity", "1");
    $("#leftArrow").css("opacity", "0.5");
    $("#btnRegToHike").attr("hikeId", hikeId);
    $("#regToHikeFormDate").datepicker();
    $("#regToHikeFormDate").datepicker("option", "dateFormat", "dd.mm.yy");
    $("#regToHikeFormDate").val("01.01.1995");    
    
    kayaksCount = kayakProperty.kayaksCount;
    if (kayaksCount == 1)
        $("#rightArrow").css("opacity", "0.5");

    $("#regToHikeFormKayaksPlacesContainer").html("");
    $("#kayakTitle").html(kayakProperty.kayakName + " номер " + kayakNumber);

    var divWidth = 100/kayakProperty.kayakCountPlaces - 0.55;
    for (var i = 0; i <kayakProperty.kayaksCount; i++) {
        $("#regToHikeFormKayaksPlacesContainer").append("<div id='kayak"+ i +"' class='regToHikeFormKayak'></div>");
        for(var j = 0; j < kayakProperty.kayakCountPlaces; j++)
            $("#kayak"+ i).append("<div id='k" + (i+1) + "p" + (j+1) + "' class='regToHikeFormKayakPlace' onclick='PlaceSelect(this)' style='width:"+ divWidth +"%;'></div>");
    }

    for (var i = 0; i < touristsInfo.length; i++) {
        var place = $("#k" + touristsInfo[i].KayakNumber + "p" + touristsInfo[i].PlaceNumber);
        if (touristsInfo[i].Gender == "male")
            $(place).append("<img class='regToHikeFormKayakPlaceImg' src='/Images/male.png'/><br />" + touristsInfo[i].TouristName + "<br />" + touristsInfo[i].TouristStrength + " год");
        else
            $(place).append("<img class='regToHikeFormKayakPlaceImg' src='/Images/female.png'/><br />" + touristsInfo[i].TouristName + "<br />" + touristsInfo[i].TouristStrength + " год");
    }
    
    $("#regToHikeFormKayaksPlacesContainer").scrollTop(0);
}

function KayakContainerNextKayak(btn) {
    if (kayakNumber != kayaksCount) {
        var div = $("#regToHikeFormKayaksPlacesContainer");
        $(div).scrollTop($(div).prop('scrollTop') + 100);
        $("#kayakTitle").html($("#kayakTitle").html().replace("номер " + kayakNumber, "номер " + (kayakNumber + 1)));
        kayakNumber++;
        $("#leftArrow").css("opacity", "1");
    }
    if (kayakNumber == kayaksCount)
        $("#rightArrow").css("opacity", "0.5");
}

function KayakContainerPrevKayak() {
    var div = $("#regToHikeFormKayaksPlacesContainer");
    if ($(div).scrollTop() != 0) {
        $(div).scrollTop($(div).prop('scrollTop') - 100);
        $("#kayakTitle").html($("#kayakTitle").html().replace("номер " + kayakNumber, "номер " + (kayakNumber - 1)));
        kayakNumber--;
        $("#rightArrow").css("opacity", "1");
    }
    if (kayakNumber == 1)
        $("#leftArrow").css("opacity", "0.5");
}

function RegistrationToHikeClose() {
    $("#popUpRegistrationToHike").slideUp(function () {
        $(".PopUpBack").css("display", "none");
    });
}

function GetKayaksPropertyForHike(hikeId, callback) {
    var kayakProperty = {};
    $.ajax({
        url: '/Home/GetKayaksInfoForHike?hikeId='+hikeId,
        cache: false,
        success: function (data) {
            kayakProperty = JSON.parse(data);
            callback(kayakProperty);
        },
    });
}

function GetHikeTouristsInfo(hikeId, callback) {
    var touristsInfo = {};
    $.ajax({
        url: '/Home/GetHikeTouristsInfo?hikeId=' + hikeId,
        cache: false,
        success: function (data) {
            touristsInfo = JSON.parse(data);
            callback(touristsInfo);
        },
    });   
}

function PlaceSelect(place) {
    if ($(place).html() == "") {
        $(place).html("<img src='/Images/galka.png'/ class='placeSelectedImg'>");

        var selPlace = $(".selPlace")[0];
        $(selPlace).html("");
        $(selPlace).removeClass("selPlace");
        $(selPlace).addClass("regToHikeFormKayakPlace");

        $(place).removeClass("regToHikeFormKayakPlace");
        $(place).addClass("selPlace");
    }
}

function RegToHike() {
    if (RegToHikeValidate() || $("#regToHikeFormFirstName").css("display") == undefined) {
        selPlace = $(".selPlace")[0];
        var place = $(selPlace).prop("id");
        var mas = place.split('k');
        mas = mas[1].split('p');
        var kayakNum = mas[0];
        var placeNum = mas[1];

        var firstName = "_";
        var lastName = "_";
        var date = "10.10.1900";
        var gender = "_";
        var phone = "_";
        var hikeId = $("#btnRegToHike").attr("hikeId");

        if ($("#regToHikeFormFirstName").html() != null) {
            firstName = $("#regToHikeFormFirstName").val();
            lastName = $("#regToHikeFormLastName").val();
            date = $("#regToHikeFormDate").val();
            gender = $("#regToHikeFormGender").val();
            phone = $("#regToHikeFormPhone").val();
        }
        RegTourist(firstName, lastName, date, kayakNum, placeNum, hikeId, gender, phone);       
    }
}

function RegTourist(firstName, lastName, date, kayakNum, placeNum, hikeId, gender, phone) {
    $.ajax({
        url: '/Home/RegTouristToHike?hikeId=' + hikeId + "&lastName=" + lastName + "&firstName=" + firstName + "&date=" + date + "&kayakNum=" + kayakNum + "&placeNum=" + placeNum + "&gender=" + gender + "&phone=" + phone,
        cache: false,
        success: function (data) {
            var info = JSON.parse(data);

            RegistrationToHikeClose();
            alert("Спасибо что вы с нами. Наш оператор свяжится с вами для подтверждения заявки.");
            if ("kayak" in info)
                ShowTicket(hikeId, firstName, lastName, info.kayak, info.place);
            else
                ShowTicket(hikeId, firstName, lastName, kayakNum, placeNum);
        }
    });
}

function RegToHikeValidate() {
    var regLetters = new RegExp("^[а-яА-ЯёЁa-zA-Z]{2,}$");
    var regDate = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    var regPhone = /^[0]{1}[0-9]{9}$/

    if (!regLetters.test($("#regToHikeFormFirstName").val())) {
        alert("Введите имя. Не меньше двух символов только буквы.");
        return false;
    }
    if (!regLetters.test($("#regToHikeFormLastName").val())) {
        alert("Введите фамилию. Не меньше двух символов только буквы.");
        return false;
    }
    if (!regDate.test($("#regToHikeFormDate").val())) {
        alert("Введите дату рождения в правильном формате.");
        return false;
    }
    if (!regPhone.test($("#regToHikeFormPhone").val())) {
        alert("Введите телефон в правильном формате. Только 10 цифр.");
        return false;
    }
    if ($(".selPlace")[0] == undefined) {
        alert("Выберите место в байдарке");
        return false;
    }

    if ($("#regToHikeFormFirstName").html() != null) {
        if ($("#regToHikeFormFirstName").val() != "" && $("#regToHikeFormLastName").val() != "" && $("#regToHikeFormDate").val() != "" && $(".selPlace")[0] != undefined)
            return true;
    }  
}

function ShowTicket(hikeId, firstName, lastName, kayakNum, placeNum) {
    var hikeInfo = {};
    $.ajax({
        url: '/Home/GetHikeInfo?hikeId=' + hikeId,
        cache: false,
        success: function (data) {
            hikeInfo = JSON.parse(data);
            hikeData = "";
            for (var i in hikeInfo)
                hikeData += i + "=" + hikeInfo[i] + "&";
            if (firstName == "_" || lastName == "_")
            {
                $("#TouristFullName").html($(".username").text());
                window.open('/Home/ShowTicket?' + hikeData + "touristName=" + $(".username").text() + "&kayak=" + kayakNum + "&place=" + placeNum);
            }
            else
            {
                $("#TouristFullName").html(firstName + " " + lastName);
                window.open('/Home/ShowTicket?hikeInfo=' + hikeData + "&touristName=" + firstName + " " + lastName + "&kayak=" + kayakNum + "&place=" + placeNum);
            }
        },
    });
    
}

function GetHikes() {
    var hikesInfo = {};
    $.ajax({
        url: '/Home/GetHikes?skip=' + hikesCount + "&take=" + 2,
        cache: false,
        success: function (data) {
            hikesInfo = JSON.parse(data);
            if (hikesInfo.hikes.length != 0) {
                appendHikes(hikesInfo.hikes);
                hikesCount += 2;
                if (hikesInfo.hikes.length < 2 || hikesInfo.hikesCount <= hikesCount)
                    $("#btnShowMore").css("display", "none");
            }
        },
    });
    
}

function appendHikes(hikeInfo) {
    for (var i = 0; i < hikeInfo.length; i++) {
        var hikeContainer = $($(".hikeContainerTemplate")[0]).clone();
        $(hikeContainer).addClass("hikeContainer");
        $(hikeContainer).removeClass("hikeContainerTemplate");
        fillHikeContainer(hikeContainer, hikeInfo[i]);

        $($(".hikesMainContainer")[0]).append(hikeContainer);
    }
}

function fillHikeContainer(hikeContainer, hikeInfo) {

    $($($($(hikeContainer).children(".hikeContainer_topBlock"))).children(".hikeName")[0]).html(hikeInfo.Name);
    if (hikeInfo.PlacesLeft != 0) {
        $($($($(hikeContainer).children(".hikeContainer_topBlock"))).children(".myBtn")[0]).click(function () { RegistrationToHikeOpen(hikeInfo.HikeId); });
    }
    else
        $($(hikeContainer).children(".myBtn")).remove();
    $($(hikeContainer).children(".hikePhoto")).attr("src", "\\Images\\HikesPhotos\\" + hikeInfo.Photo);
    var hikeInfoContainer = $(hikeContainer).children(".hikeInfoContainer");
    $($(hikeInfoContainer).children(".hikeInfo")[0]).html("<b>Руководитель: </b>" + hikeInfo.Head);
    $($(hikeInfoContainer).children(".hikeInfo")[1]).html("<b>Дата начала: </b>" + hikeInfo.DateBeginStr);
    $($(hikeInfoContainer).children(".hikeInfo")[2]).html("<b>Дата конца: </b>" + hikeInfo.DateEndStr);
    $($(hikeInfoContainer).children(".hikeInfo")[3]).html("<b>Сложность: </b>" + hikeInfo.Difficulty);
    $($(hikeInfoContainer).children(".hikeInfo")[4]).html("<b>Тип байдарок: </b>" + hikeInfo.Kayak);
    $($(hikeInfoContainer).children(".hikeInfo")[5]).html("<b>Осталось мест: </b>" + hikeInfo.PlacesLeft + " из " + hikeInfo.Places);
    $($(hikeInfoContainer).children(".hikeInfo")[6]).html("<abbr title=" + hikeInfo.Path + "><b>Маршрут: </b>" + hikeInfo.Path + "</abbr>");
    $($(hikeInfoContainer).children(".hikeInfo")[7]).html("<b>Цена: </b>" + hikeInfo.Price + " грн.");

    $($(hikeContainer).children(".hikeDescTitle")).click(function () { ExpandHikeDesc(hikeInfo.HikeId); });
    var hikeDescTitleImg = $($(hikeContainer).children(".hikeDescTitle")).children(".hikeDescTitleImg");
    $($(hikeDescTitleImg).children(".expandImg")).attr("id", "imgExpand_" + hikeInfo.HikeId);

    $($(hikeContainer).children(".hikeDesc")).html(hikeInfo.Description);
    $($(hikeContainer).children(".hikeDesc")).attr("id", "hikeDesc_" + hikeInfo.HikeId);

    $(hikeContainer).attr("priceFilterValid", "true");
    $(hikeContainer).attr("difficultyFilterValid", "true");
    $(hikeContainer).attr("dateEndFilterValid", "true");
    $(hikeContainer).attr("dateBeginFilterValid", "true");
    $(hikeContainer).attr("headFilterValid", "true");

    var isVvalid = FilterCheck(hikeInfo.Head, hikeInfo.DateBeginStr, hikeInfo.DateEndStr, hikeInfo.Difficulty, hikeInfo.Price);
    if (!isVvalid)
        $(hikeContainer).css("display", "none");
}