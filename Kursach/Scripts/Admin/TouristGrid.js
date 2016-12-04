$(document).ready(function () {
    $("#touristsList").jqGrid({
        datatype: "json",
        url: "/Admin/GetTourists/",
        colNames: ['Id', 'Имя', 'Фамилия', 'Дата рождения', 'Пол', 'Телефон', 'Регистрация'],
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
            sortable: false,
            editable: true,
            editrules: { required: true, custom: true, custom_func: checkDate }
        },
        {
            name: 'Gender',
            index: 'Gender',
            search: true,
            sortable: false,
            editable: true,
            edittype: 'select',
            editoptions: { value: { 'male': 'Мужской', 'female': 'Женский' } },
            editrules: { required: true}
        },
        {
            name: 'Phone',
            index: 'Phone',
            search: true,
            sortable: false,
            editable: true,
            editrules: { required: true, custom: true, custom_func: checkPhone}
        },
        {
            name: 'Registered',
            index: 'Registered',
            search: false,
            sortable: false,
            editable: false,
            formatter: isRegFormatter
        }
        ],
        rowNum: 10,
        rowList: [10, 20, 30],
        height: 300,
        width: 1100,
        pager: '#touristsListJpager',
        loadonce: true,
        caption: "Список туристов",
        scrollerbar: true,
        editurl: "/Admin/EditTourist/",
        ondblClickRow: function (id) {
            $("#touristsList").jqGrid('editRow', id, {
                keys: true,
                oneditfunc: function () { },
                successfunc: function (response, postdata) {
                    $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                    return [true, "", 0]
                }
            });
        },
    });

    function isRegFormatter(cellvalue) {
        if (cellvalue == true)
            return "Зарегистрирован";
        else
            return "Не зарегистрирован";
    }

    $("#touristsList").jqGrid('navGrid', '#touristsListJpager', {

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
            drag: true,
            onclickSubmit: function (params) {
                var list = $("#touristsList");
                var selectedRow = list.getGridParam("selrow");
                rowData = list.getRowData(selectedRow);
                if (act === "add")
                    params.url = 'Admin/AddTourist';
                else if (act === "del") {
                    params.url = 'Admin/DeleteTourist?touristId=' + rowData.Id;
                }
            },
            afterSubmit: function (response, postdata) {
                $(this).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                return [true, "", 0]
            }
        };
    };
    $("#touristsList").jqGrid('filterToolbar', {
        searchOnEnter: false
    });

    $("#gbox_touristsList").css("display", "none");
});