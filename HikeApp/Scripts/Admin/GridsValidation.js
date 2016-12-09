function checkDate(value, colname) {
    var reg = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    if (!reg.test(value))
        return [false, colname + ". Введите дату в правильном формате."];
    else
        return [true, ""];
}

function checkDecimal(value, colname) {
    var reg = /^[1-9]{1}[0-9]{0,}(\,[0-9]{2})?$/;
    if (!reg.test(value))
        return [false, colname + ". Введите цену в правильном формате. 20.00"];
    else
        return [true, ""];
}

function checkOnlyLetters(value, colname) {
    var reg = new RegExp("^[а-яА-ЯёЁa-zA-Z\ ]{2,}$");
    if (!reg.test(value))
        return [false, colname + ". Пожалуйста введите только буквы. Не меньше двух."];
    else
        return [true, ""];
}

function checkKayakName(value, colname) {
    var reg = new RegExp("^[а-яА-ЯёЁa-zA-Z0-9\ \-\]{2,}$");
    if (!reg.test(value))
        return [false, colname + ". Пожалуйста введите название правильно. Допустимые символы А-Я, а-я, 0-9, -. Не меньше двух символов."];
    else
        return [true, ""];
}

function checkPhone(value, colname) {
    var regPhone = /^[0]{1}[0-9]{9}$/;
    if (!regPhone.test(value))
        return [false, colname + ". Пожалуйста введите телефон правильно, 10 цифр. Допустимы только цифры."];
    else
        return [true, ""];
}