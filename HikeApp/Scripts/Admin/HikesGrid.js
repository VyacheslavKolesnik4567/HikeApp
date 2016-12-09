function HikeGridBuild(hikesData, display) {
    $("#hikesList").jqGrid({
        datatype: "local",
        data: hikesData,
        colNames: ['Id', 'Дата начала', 'Дата конца', 'Сложность', 'Руководитель', 'Вид байдарок', 'Количество байдарок', 'Маршрут'],
        colModel: [
        {
            name: 'Id',
            index: 'Id',
            key: true,
            hidden: true,
        },
        {
            name: 'DateStart',
            index: 'DateStart',
            search: false,            
            sortable: false,
            editable: true,
            sorttype: 'date',
            editoptions: { defaultValue: GetTodayDate },
            editrules: { required: true, custom: true, custom_func: checkDate }
        },
        {
            name: 'DateEnd',
            index: 'DateEnd',
            search: false,
            sortable: false,
            editable: true,
            editrules: { required: true, custom: true, custom_func: checkDate }
        },
        {
            name: 'Difficulty',
            index: 'Difficulty',
            search: true,
            sortable: true,
            sorttype: 'integer',
            align: 'right',
            editable: true,
            edittype: 'select',
            editoptions: { value: { 1: "1", 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 } }
        },
        {
            name: 'HeadId',
            index: 'HeadId',
            edittype: 'select',
            formatter: 'select',
            editoptions: { value: AllDB.headsNames },
            search: true,
            sortable: true,
            editable: true,
        },
        {
            name: "KayakId",
            index: "KayakId",
            formatter: 'select',
            edittype: 'select',
            editoptions: {value: AllDB.kayaksNames},
            search: true,
            sortable: true,
            editable: true,
        },
        {
            name: 'CountKayak',
            index: 'CountKayak',
            sorttype: 'integer',
            search: true,
            sortable: true,
            editable: true,
            align: 'right',
            edittype: 'select',
            editoptions: { value: { 1: "1", 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 } }
        },
        {
            name: 'PathId',
            index: 'PathId',
            search: true,
            formatter: 'select',
            sortable: false,
            edittype: 'select',
            editable: true,
            editoptions: { value: AllDB.waysNames },
        }],
        rowNum: 10,
        rowList: [10, 20, 30],
        height: 300,
        width: 1100,
        pager: '#hikesListJpager',
        loadonce: true,        
        caption: "Походы на байдарках",
        scrollerbar: true,
        subGrid: true,
        editurl: "/Admin/EditHike/",
        ondblClickRow: function (id) {
            $("#hikesList").jqGrid('editRow', id, {
                keys: true,
                oneditfunc: function () { },
                //successfunc: function (response, postdata) {                    
                //    $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    
                //    return [true, "", 0]
                //}
            });
        },
        subGridRowExpanded: hikeTouristSubgrid
    });

    $("#hikesList").jqGrid('filterToolbar', {
        searchOnEnter: false
    });

    $("#hikesList").jqGrid('navGrid', '#hikesListJpager', {

        search: true,
        searchtext: "Поиск",
        refresh: false,
        add: true,
        del: true,
        edit: false,
        view: false,
        viewtitle: "Выбранная запись",
        addtext: "Добавить",
        deltext: "Удалить"
    },
            update("edit"),
            update("add"),
            update("del")
    );
    function update(act) {
        return {
            closeAfterAdd: true,
            width: 410,
            reloadAfterSubmit: true,
            onInitializeForm: function (formId, act) {
                if (act == "add") {
                    var kayaks = AllDB.kayaks;
                    $("#KayakId").html("");

                    for (var j = 0; j < kayaks.length; j++) {
                        $("#KayakId").append("<option value='" + kayaks[j].Id + "'>" + kayaks[j].Name + "</option>");
                    }
                }
            },
            drag: true,
            onclickSubmit: function (params) {
                var list = $("#hikesList");
                var selectedRow = list.getGridParam("selrow");
                rowData = list.getRowData(selectedRow);
                if (act === "add")
                    params.url = 'Admin/AddHike';
                else if (act === "del") {
                    params.url = 'Admin/DeleteHike?hikeId=' + rowData.Id;
                }
            },
            afterSubmit: function (response, postdata) {
                DBHikesUpd(GridRebuilt);
                //$(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                return [true, "", 0]
            }
        };
    };

    $("#hikesList").bind("jqGridInlineSuccessSaveRow", function (e, rowid, orgClickEvent) {
        DBHikesUpd(GridRebuilt);
    });

    $("#hikesList").bind("jqGridInlineEditRow", function (e, rowId) {
        var rowData = $("#hikesList").getRowData(rowId);
        var hike = GetHikeById(rowData.Id);

        $("#" + hike.Id + "_HeadId" + " [value='" + hike.HeadId + "']").attr("selected", "selected");
        $("#" + hike.Id + "_PathId" + " [value='" + hike.PathId + "']").attr("selected", "selected");

        if (hike.CountTourists == 0)
            $("#" + hike.Id + "_KayakId" + " [value='" + hike.KayakId + "']").attr("selected", "selected");
        else {
            var kayakName = $("#" + hike.Id + "_KayakId" + " :selected").text();
            $("#" + hike.Id + "_KayakId").empty();
            $("#" + hike.Id + "_KayakId").prepend($('<option value="' + hike.KayakId + '">' + kayakName + '</option>'));
        }    
    });
    
    if (!display)
        $("#gbox_hikesList").css("display", "none");
}

function GetHikeById(hikeId) {
    var hikes = AllDB.hikes;
    for (var i = 0; i < hikes.length; i++)
        if (hikes[i].Id == hikeId)
            return hikes[i];
}

function GridRebuilt(display) {
    $("#hikesList").GridUnload('#hikesList');
    if (display == undefined)
        HikeGridBuild(AllDB.hikes, false);
    else
        HikeGridBuild(AllDB.hikes, display);
}

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