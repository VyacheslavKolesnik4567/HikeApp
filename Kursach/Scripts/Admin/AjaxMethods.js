function GetHikes(callback) {
    var hikes = [];
    $.ajax({
        url: '/Admin/GetHikes',
        cache: false,
        success: function (data) {
            hikes = JSON.parse(data);
            SetHikes(hikes);
            if (callback != undefined)
                callback(GetKayaks);
        },
    });
}

function GetHeads(callback, callbackRebuild) {
    var heads = [];
    $.ajax({
        url: '/Admin/GetHeads',
        cache: false,
        success: function (data) {
            heads = JSON.parse(data);
            SetHeads(heads);
            callback(GetWays);
            if (callbackRebuild != undefined)
                callbackRebuild(false);
        },
    });
}

function GetKayaks(callback, callbackRebuild) {
    var kayaks = [];
    $.ajax({
        url: '/Admin/GetKayaks',
        cache: false,
        success: function (data) {
            kayaks = JSON.parse(data);
            SetKayaks(kayaks);
            callback(GridsBuild);
            if (callbackRebuild != undefined)
                callbackRebuild(false);
        },
    });
}

function GetWays(callback, callbackRebuild) {
    var ways = [];
    $.ajax({
        url: '/Admin/GetWays',
        cache: false,
        success: function (data) {
            ways = JSON.parse(data);
            SetWays(ways);
            callback();
            if (callbackRebuild != undefined)
                callbackRebuild(false);
        },
    });
}