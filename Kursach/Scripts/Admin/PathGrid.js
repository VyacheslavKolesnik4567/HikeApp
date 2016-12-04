function PathGridBuild(waysData, display) {
    $("#pathList").jqGrid({
        datatype: "local",
        data: waysData,
        colNames: ['Id', 'Название', 'Маршрут', 'Цена', 'Описание'],
        colModel: [
        {
            name: 'Id',
            index: 'Id',
            key: true,
            hidden: true,
            sortable: false,
        },
        {
            name: 'WayName',
            index: 'WayName',
            search: true,
            sortable: true,
            editable: true,
            editrules: { required: true, custom: true, custom_func: checkOnlyLetters }
        },
        {
            name: 'Way',
            index: 'Way',
            search: true,
            sortable: false,
            editable: true,
            edittype: 'custom',
            editrules: { required: true },
            editoptions: { custom_element: myelem }
        },
        {
            name: 'Price',
            index: 'Price',
            align: 'right',
            search: true,
            sorttype: 'number',
            searchoptions: {
                sopt: ["le", "ge", "eq"] // ge = greater or equal to, le = less or equal to, eq = equal to  							
            },
            sortable: true,
            editable: true,
            editrules: { required: true, custom: true, custom_func: checkDecimal }
        },
        {
            name: 'Description',
            index: 'Description',
            search: true,
            sortable: false,
            editable: true,
            edittype: 'textarea',
            editoptions: { cols: '40', rows: '5' }
        }],
        rowNum: 10,
        rowList: [10, 20, 30],
        height: 300,
        width: 1100,
        pager: '#pathListJpager',
        loadonce: true,
        caption: "Список маршрутов",
        scrollerbar: true,
    });

    $("#pathList").jqGrid('navGrid', '#pathListJpager', {

        search: true,
        searchtext: "Поиск",
        refresh: false,
        add: true,
        del: true,
        edit: true,
        view: false,
        viewtitle: "Выбранная запись",
        addtext: "Добавить",
        deltext: "Удалить",
        edittext: "Править"
    },
            update("edit"),
            update("add"),
            update("del")
    );
    function update(act) {
        return {
            closeAfterAdd: true,
            closeAfterEdit: true,
            width: 410,
            reloadAfterSubmit: true,
            drag: true,
            onclickSubmit: function (params) {
                var list = $("#pathList");
                var selectedRow = list.getGridParam("selrow");
                rowData = list.getRowData(selectedRow);
                if (act === "add")
                    params.url = 'Admin/AddPath?way=' + $("#inputWay").prop("value");
                if (act === "edit")
                    params.url = 'Admin/EditPath?way=' + $("#inputWay").prop("value");
                else if (act === "del") {
                    params.url = 'Admin/DeletePath?pathId=' + rowData.Id;
                }
            },
            afterSubmit: function (response, postdata) {
                DBwaysUpd(PathGridRefresh);
                //$(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                return [true, "", 0]
            }
        };
    };
    $("#pathList").jqGrid('filterToolbar', {
        searchOnEnter: false
    });

    if (!display)
        $("#gbox_pathList").css("display", "none");
}

function PathGridRefresh() {
    $("#pathList").GridUnload('#pathList');
    PathGridBuild(AllDB.ways, true);
}

function myelem(value, options) {
    var el = document.createElement("div");
    var options = GetCities();
    jQuery(el).html("<textarea disabled class='gridArea' cols='40' rows='5' id='inputWay'>" + value +
        "</textarea>   <gridSelect><select id='gridSelectId' class='gridSelect'>"+options+"</select></gridSelect> " +
        " <button class='button28' onclick='AddCity()'>Добавить</button>  <button class='button28' onclick='ClearArea()'>Очистить</button>");
    
    return el;
}

function GetCities() {
    var cities = {};
    $.ajax({
        url: '/Admin/GetCities',
        cache: false,
        async: false,
        success: function (data) {
            cities = JSON.parse(data);
        },
    });
    
    var options = "";
    for (var i = 0; i < cities.length; i++) {
        options += "<option>" + cities[i]["CityName"] + "</option>";
    }
   return options;
}

function AddCity() {
    var area = document.getElementsByClassName("gridArea")[0];
    var select = document.getElementsByClassName("gridSelect")[0];
    if ($(area).html() != "")
        $(area).html($(area).html() + "-" + select.options[select.selectedIndex].value);
    else
        $(area).html(select.options[select.selectedIndex].value);
}

function ClearArea() {
    var area = document.getElementsByClassName("gridArea")[0];
    $(area).html("");
}