var AllDB = {};

$(document).ready(function () {

    var elements = $(".tab");
    for (var i = 0; i < elements.length; i++)
        if ($(elements[i]).attr("type") == "dictionary" || $(elements[i]).attr("type") == "analysis")
            $(elements[i]).css("display", "none");
        else
            $(elements[i]).css("display", "block");

    GetAllInfo();
})

function DBHikesUpd(callback)
{
    GetHikes(callback);
}

function DBwaysUpd(callback) {
    GetWays(callback, GridRebuilt);
}

function DBkayaksUpd(callback) {
    GetKayaks(callback, GridRebuilt);
}

function DBheadsUpd(callback) {
    GetHeads(callback, GridRebuilt);
}

function DBHikeTouristCountUpd(hikeId, operate) {
    for (var i = 0; i < AllDB.hikes.length; i++)
        if (hikeId == AllDB.hikes[i].Id)
            if (operate == 'minus') {
                AllDB.hikes[i].CountTourists--;
                break;
            }
            else {
                AllDB.hikes[i].CountTourists++;
                break;
            }
}

function GetAllInfo() {
    GetHikes(GetHeads);
}

function SetHikes(hikes) {
    AllDB.hikes = hikes;
}

function SetHeads(heads) {
    AllDB.heads = heads;
    SetHeadFullNames();
}

function SetKayaks(kayaks) {
    AllDB.kayaks = kayaks;
    SetKayaksNamesList();
}

function SetWays(ways) {
    AllDB.ways = ways;
    SetPathList();
}

function GridsBuild() {
    HikeGridBuild(AllDB.hikes, true);
    PathGridBuild(AllDB.ways, false);
    KayaksGridBuild(AllDB.kayaks, false);
    HeadsGridBuild(AllDB.heads, false);
}

function SetHeadFullNames() {
    var headsNames = {};
    for (var i = 0; i < AllDB.heads.length; i++)
        headsNames[AllDB.heads[i].Id] = AllDB.heads[i].FirstName + " " + AllDB.heads[i].LastName;

    AllDB.headsNames = headsNames;
    FillHeadsNamesSelect(AllDB.headsNames);
}

function SetPathList() {
    var ways = {};
    for (var i = 0; i < AllDB.ways.length; i++)
        ways[AllDB.ways[i].Id] = AllDB.ways[i].Way;

    AllDB.waysNames = ways;
}

function SetKayaksNamesList() {
    var kayaks = {};
    for (var i = 0; i < AllDB.kayaks.length; i++)
        kayaks[AllDB.kayaks[i].Id] = AllDB.kayaks[i].Name;

    AllDB.kayaksNames = kayaks;
}

//==============================================================
function TabOpen(tab, name)
{
    if ($(tab).prop("title") == "cities" && $(tab).hasClass("activeTab") === false) {
        ReloadCitiesList();
    }
    //Hide active tab
    var activeTab = $(".activeTab")[0];
    $(activeTab).removeClass("activeTab");
    $(activeTab).addClass("tab");
    $(activeTab).css("display", "block");

    //Hide active grid
    var tabGridName = $(activeTab).prop("title");
    $("#gbox_" + tabGridName).css("display", "none");

    //Tab activating
    $(tab).removeClass("tab");
    $(tab).addClass("activeTab");

    //Show grid
    tabGridName = $(tab).prop("title");
    $("#gbox_" + tabGridName).css("display", "block");
}

function ChangeInfoType() {
    var currentType = $("#typeInfoSelect").val();
    //Hide active tab
    var activeTab = $(".activeTab")[0];
    $(activeTab).removeClass("activeTab");
    $(activeTab).addClass("tab");
    //Hide active grid
    var tabGridName = $(activeTab).prop("title");
    $("#gbox_" + tabGridName).css("display", "none");

    var elements = $(".tab");
    var tabActivated = false;
    for (var i = 0; i < elements.length; i++)
        if ($(elements[i]).attr("type") != currentType)
            $(elements[i]).css("display", "none");
        else {
            if ($(elements[i]).attr("type") == currentType) {
                if (!tabActivated) {
                    TabOpen(elements[i], $(elements[i]).prop("title"));
                    tabActivated = true;
                }
                $(elements[i]).css("display", "block");
            }
        }
}
//===========================================================
//Cities methods=============================================
function checkOnlyLettersCity(value) {
    var reg = /^[а-яА-Я]{2,}$/;
    if (!reg.test(value))
        return false;
    else
        return true;
}

function addCity() {
    var city = $("#cityNameInput").prop("value");
    if (checkOnlyLettersCity(city)) {
        SaveCityToDB($("#cityNameInput").val(), function () {
            $("#cityNameInput").css("background-color", "white");
            $("#cityNameInput").val("");
            ReloadCitiesList();
        });      
    }
    else
        $("#cityNameInput").css("background-color", "rgba(255, 0, 0, 0.60)");

    $("#citiesList").scrollTop(9999999);
    
}

function SaveCityToDB(name, callback) {
    $.ajax({
        url: '/Admin/SaveCity?name=' + name,
        cache: false,
        success: function () {
            callback();
        }
    });
}

function EditCity(button) {
    if ($("#citiesList option:selected").length != 0)
    if ($(button).text() == "Править") {
        $(button).text("Сохранить");
        $("#cityNameInput").val($("#citiesList option:selected").first().text());
        $(button).attr("cityId", $("#citiesList option:selected").first().val());
        $("#btnAddCity").css("display", "none");
        $("#btnDelCity").css("display", "none");
    }
    else {
        var city = $("#cityNameInput").prop("value");
        if (checkOnlyLettersCity(city)) {
            $(button).text("Править");
            $.ajax({
                url: '/Admin/EditCity?id=' + $(button).attr("cityId") + "&" + 'name=' + $("#cityNameInput").val(),
                cache: false,
                success: function () {
                    $("#btnAddCity").css("display", "inline-block");
                    $("#btnDelCity").css("display", "inline-block");
                    $("#cityNameInput").val("");
                    ReloadCitiesList();
                }
            });
        }
        else
            $("#cityNameInput").css("background-color", "rgba(255, 0, 0, 0.60)");
    }
}

function delCities() {
    $('#citiesList option').each(function () {
        if ($(this).prop("selected")) {
            var id = $(this).val();
            DelCity(id);
        }
    });
}

function DelCity(cityId) {
    $.ajax({
        url: '/Admin/DelCity?cityId=' + cityId,
        cache: false,
        success: function () {
            ReloadCitiesList();
        }
    });
}

function FillCitiesSelect(cities) {
    $("#citiesList").html("");
    var options = "";
    for (var i = 0; i < cities.length; i++)
    {
        options += "<option value='" + cities[i]["CityId"] + "'>" + cities[i]["CityName"] + "</option>";
    }

    $("#citiesList").html(options);
}

function ReloadCitiesList() {
    var cities = {};
    $.ajax({
        url: '/Admin/GetCities',
        cache: false,
        success: function (data) {
            cities = JSON.parse(data);

            FillCitiesSelect(cities);
        }
    });
}

//Hike photos methods==============================================

function EditHikePhotos(hikeId) {
    
    GetHikePhotosList(hikeId);
    FillFullPhotosList();
    $("#buttonClose").prop("alt", hikeId);

    $(".PopUpBack").css("display", "block");
    $("#popUpHikePhotos").slideDown();
}

function FillHikePhotosList(hikeInfo) {
    $("#hikePhotosList").html("<label>Список фото похода: " + hikeInfo.hikePath + "</label>");
    var hikePhotosLocation = JSON.parse(hikeInfo.hikePhotosLocation);
    for (var i in hikePhotosLocation) {
        $("#hikePhotosList").append("<img src='\\Images\\HikesPhotos\\" + hikePhotosLocation[i] + "' alt='" + i + "' class='hikePhotoImg' onclick='selectHikePhoto(this, this.alt)'>");
    }
}

function GetHikePhotosList(hikeId) {
    var hikeInfo = {};
    $.ajax({
        url: '/Admin/GetHikePhotos?hikeId=' + hikeId,
        cache: false,
        success: function (data) {
            hikeInfo = JSON.parse(data);
            FillHikePhotosList(hikeInfo);
        },
    });
}

function FillFullPhotosList() {
    GetDirectories(function (dirs) {
        ChangeDir($("#dir0"), dirs[0]);
    });
}

function GetAllPhotoFromDir(dirName, callback) {
    var allPhotosLocation = [];
    $.ajax({
        url: '/Admin/GetAllPhotos?directoryName=' + dirName,
        cache: false,
        success: function (data) {
            allPhotosLocation = JSON.parse(data);
            callback(allPhotosLocation);
        },
    });
}

function ChangeDir(dirImg, name) {
    GetAllPhotoFromDir(name, function (allPhotosLocation) {
        var selDir = $(".directoryContainerSel")[0];
        $(selDir).removeClass("directoryContainerSel");
        $(selDir).addClass("directoryContainer");

        $(dirImg).removeClass("directoryContainer");
        $(dirImg).addClass("directoryContainerSel");

        $("#allPhotos").html("");
        for (var i = 0; i < allPhotosLocation.length; i++) {
            $("#allPhotos").append("<img src='\\Images\\HikesPhotos\\" + name + "\\" + allPhotosLocation[i] + "' alt='" + allPhotosLocation[i] + "' class='hikePhotoImg' onclick='selectHikePhoto(this, this.alt)'>");
        }
    });
}

function FillDirsDiv(dirs) {
    $("#directoriesList").html("");
    for (var i = 0; i < dirs.length; i++)
        $("#directoriesList").append("<div id='dir" + i + "' nameImg='" + dirs[i] + "' class=\"directoryContainer\" onclick='ChangeDir(this, \"" + dirs[i] + "\")'>" +
            "<img  class=\"directoryImg\" src=\"/Images/HikesPhotos/dir.png\" /><br>" + dirs[i]);
}

function GetDirectories(callback) {
    var dirs = [];
    $.ajax({
        url: '/Admin/GetAllDirectories',
        cache: false,
        success: function (data) {
            dirs = JSON.parse(data);
            FillDirsDiv(dirs);
            callback(dirs);         
        },
    });
}

function EditHikePhotosClose() {
    SaveHikePhotos($("#buttonClose").prop("alt"));
    $("#popUpHikePhotos").slideUp(function () {
        $(".PopUpBack").css("display", "none");
    });
}

function selectHikePhoto(photo, alt) {
    if ($(photo).hasClass("hikePhotoImg")) {
        $(photo).removeClass("hikePhotoImg");
        $(photo).addClass("hikePhotoImgSelected");
    }
    else {
        $(photo).removeClass("hikePhotoImgSelected");
        $(photo).addClass("hikePhotoImg");
    }
}

function AddHikePhoto() {
    var selDir = $(".directoryContainerSel")[0];
    var dirName = $(selDir).attr("nameImg");
    var selectedPhotos = $(".hikePhotoImgSelected");
    for (var i = 0; i < selectedPhotos.length; i++) {
        $("#hikePhotosList").append("<img src='\\Images\\HikesPhotos\\" + dirName + "\\" + $(selectedPhotos[i]).prop("alt") + "' new='true' alt='" + dirName + "\\" + $(selectedPhotos[i]).prop("alt") + "' class='hikePhotoImg' onclick='selectHikePhoto(this, this.alt)'>");
    }
    ResetAllPhotos();
}

function DeleteHikePhoto(photoId) {
    var selectedPhotos = $(".hikePhotoImgSelected");
    for (var i = 0; i < selectedPhotos.length; i++) {
        if ($($(selectedPhotos[i]).parent()).prop("id") != "fullPhotosList" && $(selectedPhotos[i]).attr("new") != "true") {
            $.ajax({
                url: '/Admin/DeleteHikePhoto?photoId=' + $(selectedPhotos[i]).prop("alt"),
                cache: false,
            });
            $(selectedPhotos[i]).remove();
        }
        if ($(selectedPhotos[i]).attr("new") == "true")
            $(selectedPhotos[i]).remove();
    }
}

function ResetAllPhotos() {
    var selectedPhotos = $(".hikePhotoImgSelected");
    for (var i = 0; i < selectedPhotos.length; i++) {
        $(selectedPhotos[i]).removeClass("hikePhotoImgSelected");
        $(selectedPhotos[i]).addClass("hikePhotoImg");
    }
}

function SaveHikePhotos(hikeId) {
    var newPhotos = $("[new='true']");
    for (var i = 0; i < newPhotos.length; i++) {
            $.ajax({
                url: '/Admin/AddHikePhoto?hikeId=' + hikeId + '&photoLocation=' + $(newPhotos[i]).prop("alt"),
                cache: false,
            });
    }
}

function ShowMessage(text) {
    alert(text);
}