function KayaksGridBuild(kayaksData, display) {
    $("#kayaksList").jqGrid({
        datatype: "local",
        data: kayaksData,
        colNames: ['Id', 'Название', 'Количество мест', 'Грузоподъемность', 'Цена покупки'],
        colModel: [
        {
            name: 'Id',
            index: 'Id',
            key: true,
            hidden: true,
            sortable: false,
        },
        {
            name: 'Name',
            index: 'Name',
            search: true,
            sortable: true,
            editable: true,
            editrules: { required: true, custom: true, custom_func: checkKayakName}
        },
        {
            name: 'CountPlaces',
            index: 'CountPlaces',
            search: true,
            sortable: true,
            editable: true,
            sorttype: 'integer',
            align: 'right',
            editrules: { required: true },
            edittype: 'select',
            editoptions: { value: { 1: '1', 2: '2', 3: '3', 4: '4' } }
        },
        {
            name: 'Capacity',
            index: 'Capacity',
            search: true,
            align: 'right',
            sorttype: 'integer',
            sortable: true,
            editable: true,
            editrules: { required: true, integer: true, minValue: 100, maxValue: 600 }
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
            editrules: { required: true, custom: true, custom_func: checkDecimal}
        }
        ],
        rowNum: 10,
        rowList: [10, 20, 30],
        height: 300,
        width: 1100,
        pager: '#kayaksListJpager',
        loadonce: true,
        caption: "Список доступных байдарок",
        scrollerbar: true,
        editurl: "/Admin/EditKayak/",
        ondblClickRow: function (id) {
            $("#kayaksList").jqGrid('editRow', id, {
                keys: true,
                oneditfunc: function () { },
                //successfunc: function (response, postdata) {
                //    $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                //    return [true, "", 0]
                //}
            });
        },
    });

    $("#kayaksList").jqGrid('navGrid', '#kayaksListJpager', {

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
            width: 450,
            reloadAfterSubmit: true,
            drag: true,
            onclickSubmit: function (params) {
                var list = $("#kayaksList");
                var selectedRow = list.getGridParam("selrow");
                rowData = list.getRowData(selectedRow);
                if (act === "add")
                    params.url = 'Admin/AddKayak';
                if (act === "edit")
                    params.url = 'Admin/EditKayak';
                else if (act === "del") {
                    params.url = 'Admin/DeleteKayak?kayakId=' + rowData.Id;
                }
            },
            afterSubmit: function (response, postdata) {
                DBkayaksUpd(KayaksGridRefresh);
                //$(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                return [true, "", 0]
            }
        };
    };
    $("#kayaksList").jqGrid('filterToolbar', {
        searchOnEnter: false
    });

    if (!display)
        $("#gbox_kayaksList").css("display", "none");

    $("#kayaksList").bind("jqGridInlineSuccessSaveRow", function (e, rowid, orgClickEvent) {
        DBkayaksUpd(KayaksGridRefresh);
    });
}

function KayaksGridRefresh() {
    $("#kayaksList").GridUnload('#kayaksList');
    KayaksGridBuild(AllDB.kayaks, true);
}