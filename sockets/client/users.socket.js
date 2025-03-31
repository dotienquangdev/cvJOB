const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
module.exports = (res) => {
    _io.once('connection', (socket) => {
        //chuc nang gui yeu cau
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            // console.log(myUserId);
            // console.log(userId);
            // Them id cua A vao acceptFriends cua B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });
            if (!existIdAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: { acceptFriends: myUserId }
                });
            }
            // Them id cua B vao acceptFriends cua A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });
            if (!existIdBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: { requestFriends: userId }
                });
            }
            // lấy ra độ dài của acceptFriends của B và trả về cho A
            const infoUserB = await User.findOne({
                _id: userId,
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends,
            });
            // lay ra info cua A va tra ve cho B
            const infoUserA = await User.findOne({
                _id: myUserId,
            }).select("id avatar fullName");
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA,
            });
        });

        //chuc nang huy gui yeu cau
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {

            const myUserId = res.locals.user.id;
            // console.log(myUserId);
            // console.log(userId);
            // Them id cua A vao acceptFriends cua B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });
            if (existIdAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { acceptFriends: myUserId } //push để gửi lên , pull để xóa đi

                });
            }
            // Xoa id cua B vao acceptFriends cua A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });

            if (existIdBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { requestFriends: userId }
                });
            }

            //lay ra do dai acceptFriends cua B va tra ve cho B
            const infoUserB = await User.findOne({
                _id: userId,
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends,
            });
            // lấy id của A và trả về cho B

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userIdB: userId,
                userIdA: myUserId,
            });
        });

        //chuc nangtu choi ket ban
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            const existIdAinB = await User.findOne({ _id: myUserId, acceptFriends: userId, });
            if (existIdAinB) {
                await User.updateOne({ _id: myUserId, }, {
                    $pull: { acceptFriends: userId }
                });
            }
            // Xoa id cua B vao acceptFriends cua A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            if (existIdBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { requestFriends: myUserId }
                });
            }
        });

        //chuc nang chap nhan ket ban
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //check exit
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            // end check exit// tao phongchat chung
            let roomChat;
            if (existIdAinB && existIdBinA) {
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "supperAdmin",
                        },
                        {
                            user_id: myUserId,
                            role: "supperAdmin",
                        },
                    ]
                };
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }
            // console.log(myUserId); // id của a// console.log(userId);// id của b// Them id cua A vao acceptFriends cua B// thêm user_id , rom_chat_id của A vào friendList của B // Xóa id của A trong acceptFriends của B
            if (existIdAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id,
                        }
                    },
                    $pull: { acceptFriends: userId } //push để gửi lên , pull để xóa đi
                });
            }
            // thêm user_id , rom_chat_id của B vào friendList của A
            // Xóa id của B trong acceptFriends của A
            if (existIdBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id,
                        }
                    },
                    $pull: { requestFriends: myUserId }
                });
            }
        });

    });
}