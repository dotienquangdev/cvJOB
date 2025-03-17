module.exports = (query) => {

    // Đoạn bộ lọc
    let filterStatus = [
        {
            name: "Tấi cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""

        }
    ];

    if (query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active"; // mục đích là có đc filterStatus
        // console.log(index);
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    return filterStatus;
}