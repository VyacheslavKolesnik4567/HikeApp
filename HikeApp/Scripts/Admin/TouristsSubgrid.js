var id = "";
function hikeTouristSubgrid(subgrid_id, row_id) {
    id = row_id;
    var subgrid_table_id;
    var id_hike = $("#hikesList").jqGrid('getCell', row_id, 'Id');
    
    //Subgrid Tourists=============================================================
    subgrid_table_id = subgrid_id + "_t";  
    jQuery("#" + subgrid_id).html("<div class='float-left'><div class='subgrids'><table class='subgrid' id='" + subgrid_table_id + "'></table><div id='jpagerTourist'></div></div></div>"
        + "<div class='hikePhotosDiv'><button class='button28' onclick='EditHikePhotos(" + id_hike + ")'>Редактировать фотографии</button><div>");
    jQuery("#" + subgrid_table_id).jqGrid({
        url: '/Admin/GetTouristsByHikeId?hikeId='+id_hike,
        datatype: "json",
        colNames: ['Id', 'Полное имя', 'Дата рождения', 'Телефон', 'Байдарка', 'Место', 'Подтвержден'],
        colModel: [
          { name: "Id", index: "Id", width: 50, key: true, hidden: true },
          { name: 'TouristId', index: 'TouristId', editable: true, edittype: 'select', editoptions: { value: GetTouristList } },
          { name: 'Birthday', index: 'Birthday', editable: false, sortable: false, edittype: 'text' },
          { name: 'Phone', index: 'Phone', sortable: false, editable: false, width: 80, edittype: 'text' },
          { name: 'KayakNumber', sortable: false, index: 'KayakNumber', width: 70, align: 'right', editable: true, edittype: 'select', editoptions: { value: GetKayakCount } },
          { name: 'PlaceNumber', index: 'PlaceNumber', sortable: false, width: 50, align: 'right', editable: true, edittype: 'select', editoptions: { value: GetKayakPlaces } },
          { name: 'Confirmed', sortable: false, index: 'Confirmed', sortable: false, editable: true, edittype: 'checkbox', editoptions: { value: 'true:false' }, formatter: myFormatter }
        ],
        height: '100',
        scrollerbar: true,
        loadonce: true,
        caption: "Туристы похода",
        rowNum: 5,
        rowList: [5, 10, 20],
        pager: '#jpagerTourist',
        editurl: "/Admin/EditHikeTourist/",
        ondblClickRow: function (id) {
            $("#" + subgrid_table_id).jqGrid('editRow', id, {
                keys: true,
                oneditfunc: function () { },
                successfunc: function (response, postdata) {
                    $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                    return [true, "", 0]
                }
            });
        },
    });

    function myFormatter(cellvalue) {
        if (cellvalue == false)
            return 'Нет';
        else
            return 'Да';
    }

    //subgridPager 
    $(".subgrid").jqGrid('navGrid', '#jpagerTourist', {
        refresh: false,
        add: true,
        del: true,
        search:false,
        edit: false,
        addtext: "",
        deltext: ""
    },
updateSubgrid("edit"),
updateSubgrid("add"),
updateSubgrid("del")
);

    function updateSubgrid(act) {
        return {
            closeAfterAdd: true,
            height: 220,
            width: 300,
            top: Math.max(0, ($(window).height() / 3)),
            left: Math.max(0, ($(window).width() / 3)),
            reloadAfterSubmit: true,
            drag: true,
            onclickSubmit: function (params) {
                var list = $(this);
                var selectedRow = list.getGridParam("selrow");
                rowData = list.getRowData(selectedRow);
                if (act === "add") {
                    params.url = 'Admin/AddHikeTourist?hikeId=' + id_hike + '&touristId=' + $('#TouristId').val() + '&kayakNumber=' + $('#KayakNumber').val() + '&placeNumber=' + $('#PlaceNumber').val() + '&confirmed=' + $('#Confirmed').prop("checked");
                    DBHikeTouristCountUpd(id_hike, 'plus');
                }
                else if (act === "del") {
                    params.url = 'Admin/DeleteTouristHike?hikeTouristId=' + rowData.Id;
                    DBHikeTouristCountUpd(id_hike, 'minus');
                }
            },
            afterSubmit: function (response, postdata) {
                $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                return [true, "", 0]
            }
        };
    };


}

function GetTouristList() {
    var tempObj = {};
    $.ajax({
        url: '/Admin/GetTouristList',
        cache: false,
        async: false,
        success: function (data) {
            tempObj = JSON.parse(data);
        },
    });

    return tempObj;
}

function GetKayakCount() {
    var list = $("#hikesList");
    rowData = list.getRowData(id);
    var countKayaks = 0;
    $.ajax({
        url: '/Admin/GetHikeKayakCount?hikeId='+rowData.Id,
        cache: false,
        async: false,
        success: function (data) {
            countKayaks = data;
        },
    });

    var obj = {};
    for (var i = 1; i <= countKayaks; i++)
        obj[""+i] = i;

    return obj;
}

function GetKayakPlaces() {
    var list = $("#hikesList");
    rowData = list.getRowData(id);
    var countPlaces = 0;
    $.ajax({
        url: '/Admin/GetKayakCountPlacesForHike?hikeId=' + rowData.Id,
        cache: false,
        async: false,
        success: function (data) {
            countPlaces = data;
        },
    });

    var obj = {};
    for (var i = 1; i <= countPlaces; i++)
        obj["" + i] = i;

    return obj;
}