import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
// import Viewer from 'viewerjs';
// import { FileUploadWithPreview } from 'https://cdn.jsdelivr.net/npm/file-upload-with-preview@latest/dist/file-upload-with-preview.min.js';
// import { FileUploadWithPreview } from '/file-upload-with-preview';

const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true, //Cho phép chọn nhiều ảnh cùng lúc.
    maxFileCount: 15, //Giới hạn số lượng ảnh có thể tải lên là 15.
});

//client_send_message
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {

        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;

        // console.log(content);
        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images,
            }
            );
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
//end CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector("chat .inner-list-typing");

    const div = document.createElement("div");

    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }
    if (data.content) {
        htmlContent = `
           <div class="inner-content">${data.content}</div>
        `;
    }
    if (data.images.length > 0) {
        htmlImages += `<div class="inner-images">`;
        for (const image of data.images) {
            htmlImages += `<img src="${image}"`;
        }
        htmlImages += `</div>`;
    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;
    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight;
    // priview image
    const gallery = new Viewer(div);
});

//scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//end scroll chat to bottom

//show icont chat
// show Popup 
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.onclick = () => {
        tooltip.classList.toggle("shown");
    };
};

//show typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}
// insert icont to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (event) => {
        // console.log(event.detail.unicode);
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping();
    });
    //input keyup
    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
};

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        // console.log(data);
        if (data.type == "show") {
            const bodyChat = document.querySelector(".chat .inner-body");
            const exitsTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

            if (!exitsTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");

                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name>${data.fullName}</div>
                    <div class="inner-dost">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}
// end SERVER_RETURN_TYPING

//priview full image
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if (bodyChatPreviewImage) {
    const gallery = new Viewer(bodyChatPreviewImage);
}
//end priview full image


