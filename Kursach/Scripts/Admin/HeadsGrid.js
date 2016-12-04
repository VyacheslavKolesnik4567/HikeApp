function HeadsGridBuild(headsData, display)
{
$("#headsList").jqGrid({
    datatype: "local",
    data: headsData,
    colNames: ['Id', 'Имя', 'Фамилия', 'Дата рождения'],
    colModel: [
    {
        name: 'Id',
        index: 'Id',
        key: true,
        hidden: true,
        sortable: false,
    },
    {
        name: 'FirstName',
        index: 'FirstName',
        searchtype: 'string',
        search: true,
        sortable: true,
        editable: true,
        editrules: { required: true, custom: true, custom_func: checkOnlyLetters }
    },
    {
        name: 'LastName',
        index: 'LastName',
        search: true,
        sortable: true,
        editable: true,
        editrules: { required: true, custom: true, custom_func: checkOnlyLetters }
    },
    {
        name: 'Birthday',
        index: 'Birthday',
        search: false,
        editable: true,
        sortable: false,
        editrules: { required: true, custom: true, custom_func: checkDate }
    }
    ],
    rowNum: 10,
    rowList: [10, 20, 30],
    height: 300,
    width: 1100,
    pager: '#headsListJpager',
    loadonce: true,
    caption: "Руководители",
    scrollerbar: true,
    editurl: "/Admin/EditHead/",
    ondblClickRow: function (id) {
        $("#headsList").jqGrid('editRow', id, {
            keys: true,
            oneditfunc: function () { },
            //successfunc: function (response, postdata) {
            //    $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
            //    return [true, "", 0]
            //}
        });
    },
});

$("#headsList").jqGrid('navGrid', '#headsListJpager', {

    search: true,
    searchtext: "Поиск",
    refresh: false,
    add: true,
    del: true,
    edit: false,
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
            var list = $("#headsList");
            var selectedRow = list.getGridParam("selrow");
            rowData = list.getRowData(selectedRow);
            if (act === "add")
                params.url = 'Admin/AddHead';
            if (act === "edit")
                params.url = 'Admin/EditHead';
            else if (act === "del") {
                params.url = 'Admin/DeleteHead?headId=' + rowData.Id;
            }
        },
        afterSubmit: function (response, postdata) {
            DBheadsUpd(HeadsGridRefresh);
            //$(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
            return [true, "", 0]
        }
    };
};
$("#headsList").jqGrid('filterToolbar', {
    searchOnEnter: false
});

$("#headsList").bind("jqGridInlineSuccessSaveRow", function (e, rowid, orgClickEvent) {
    DBheadsUpd(HeadsGridRefresh);
});

if (!display)
    $("#gbox_headsList").css("display", "none");
}

function HeadsGridRefresh() {
    $("#headsList").GridUnload('#headsList');
    HeadsGridBuild(AllDB.heads, true);
}