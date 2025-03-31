const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

module.exports.notFriend = async (req, res) => {
    // socket 
    usersSocket(res);
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId,

    });
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);
    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } }, //$nin loai tru ra khoi mang 
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: friendListId } },
        ],
        status: "active",
        deleted: false,
    }).select("id avatar fullName");


    // console.log(users);
    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users,
    });
}

module.exports.request = async (req, res) => {
    // socket 
    usersSocket(res);
    //end
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId,

    });
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false,
    }).select("id avatar fullName");

    res.render("client/pages/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users,
    });
}

module.exports.accept = async (req, res) => {
    // socket 
    usersSocket(res);
    //end
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,

    });
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: { $in: acceptFriends },
        status: "active",
        deleted: false,
    }).select("id avatar fullName");

    res.render("client/pages/users/accept", {
        pageTitle: "Lời mời đã nhận",
        users: users,
    });
}

module.exports.friends = async (req, res) => {
    // socket 
    usersSocket(res);
    //end
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId,

    });
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);
    // console.log(friendListId);
    const users = await User.find({
        _id: { $in: friendList },
        status: "active",
        deleted: false,
    }).select("id avatar fullName statusOnline");


    for (const user of users) {
        const infoFriend = friendList.find(friend => friend.user_id == user.id);
        user.infoFriend = infoFriend;
    }
    // res.send("oke")
    res.render("client/pages/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users,
    });
}