// chuc nang gui yeu cau
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}

// chuc nang huy gui yeu cau
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
//end chuc nang huy gui yeu cau

// chuc nang tu choi ket ban
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");

        const userId = button.getAttribute("btn-refuse-friend");
        // console.log(userId);

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
};

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    });
}

// chuc nang chap nhan ket ban
const acceptFriends = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");
        const userId = button.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriends(button);
    });
}
// end chuc nang chap nhan ket ban

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (userId === data.userId) {
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
        }
    });
}
//end SERVER_RETURN_LENGTH_ACCEPT_FRIEND

socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    // trang loi moi da nhan 
    const dataUsersAccept = document.querySelector("data-users-accept")
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId === data.userId) {
            // ve user ra giao dien
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);

            div.innerHTML = ` 
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="/image/avatar.png" alt="${data.infoUserA.fullName}">
                </div>
                <div class="inner-info">
                    <div class="inner-name">
                        ${data.infoUserA.fullName}
                    </div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm btn-primary mr-1" 
                            btn-accept-friend="${data.infoUserA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            class="btn btn-sm btn-primary mr-1" 
                            btn-refuse-friend="${data.infoUserA._id}"
                        >
                            Xóa
                        </button>

                        <button 
                            class="btn btn-sm btn-secondary mr-1" 
                            btn-cancel-friend="67e3b3597c0b9b9f4e77512a"
                        >
                            Đã xóa
                        </button>

                        <button 
                            class="btn btn-sm btn-secondary mr-1" 
                            btn-cancel-friend="67e3b3597c0b9b9f4e77512a"
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div> 
        `;
            dataUsersAccept.appendChild(div);
            //end ve user ra gia dien

            // hủy lời mời kết bạn
            const buttonResfuse = div.querySelector("[btn-refuse-friend]");
            refuseFriend(buttonResfuse);
            // end hủy lời mời kết bạn

            // chấp nhận lời mời kết bạn
            const buttonAccept = div.querySelector("[btn-accept-friend]");
            acceptFriends(button);
            // end chấp nhận lời mời kết bạn
        }
    }
    //Trang danh sach nguoi dung
    const dataUsersNotFriend = document.querySelector("data-users-not-friend")
    if (dataUsersNotFriend) {
        const userId = document.getAttribute("data-users-not-friend");
        if (userId == data.userId) {
            const boxUserRemove = document.querySelector(`[user-id='${data.infoUserA._id}']`);
            if (boxUserRemove) {
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }
});
// SERVER_RETURN_INFO_ACCEPT_FRIEND

//end  SERVER_RETURN_INFO_ACCEPT_FRIEND


// SERVER_RETURN_USER_ID_CANCEL_FRIEND 
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
    if (boxUserRemove) {
        const dataUsersAccept = document.querySelector("data-users-accept");
        const userIdB = badgeUsersAccept.getAttribute("badge-users-accept");
        if (userIdB === data.userIdA) {
            dataUsersAccept.removeChild(boxUserRemove);
        }
    }
});
// end SERVER_RETURN_USER_ID_CANCEL_FRIEND

socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
    //Trang danh sach nguoi dung
    const dataUsersFriend = document.querySelector("data-users-friend")
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id='${data.userId}']`);
        const boxStatus = boxUser.querySelector("[status]");
        boxStatus.setAttribute("status", data.status);
    }
})
