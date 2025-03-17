module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    }

    if (query.keyword) {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i"); // RegExp dùng để lấy lấy thông tin nhặp vào để tìm kiếm nhập nguyễn tìm đc nguyễn văn A
        objectSearch.title = regex;
    }

    return objectSearch;
}