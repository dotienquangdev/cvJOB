//Delete Item
const buttonsDeleteRoles = document.querySelectorAll("[button-account-delete]");
if (buttonsDeleteRoles.length > 0) {
    const formDeleteItem = document.querySelector("#form-deleteAccount-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDeleteRoles.forEach(button => {
        button.addEventListener("click", () => {
            // console.log(button);
            const isConfirm = confirm("Bạn có chắc muốn xóa nhóm quyền và tài khoản này!");

            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    })
}


//Permission
const tablePermissions = document.querySelector("[table-permissions]");

if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click", () => {
        let permissions = [];

        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                })
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    // console.log(name);
                    // console.log(index);
                    // console.log(checked);
                    // console.log("-------------")
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })
        // console.log(permission);
        if (permissions.length > 0) {
            const formChangePermission = document.querySelector("#form-change-permissions");
            const inputPermission = formChangePermission.querySelector("input[name='permissions']");
            inputPermission.value = JSON.stringify(permissions);
            formChangePermission.submit();
        }
    });
}

// Permission Datat default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    // console.log(records);
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
            // console.log(permission);
            // console.log(index);
        })
        // console.log(permissions);
    });
}
