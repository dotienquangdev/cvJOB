module.exports = (objectPagination, query, countProducts) => {
    // //Phân trang

    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    // đến số lượng sản phẩm và chia trang
    // đếm phải dùng await
    const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    // console.log(totalPage);
    // console.log(countProducts);

    return objectPagination;
}