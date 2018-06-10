var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var days_names = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

'use strict';

class Chat {

    constructor(root) {
        this.time = Date.now();

        this.chat = document.createElement("section");
        this.chat.setAttribute("class", "msger");
        root.appendChild(this.chat);

        let header = document.createElement("header");
        header.setAttribute("class", "msger-header");
        let title = document.createElement("div");
        title.setAttribute("class", "msger-header-title");
        let icon = document.createElement("i");
        icon.setAttribute("class", "fa fa-comment");
        title.appendChild(icon);
        header.appendChild(title);

        this.main = document.createElement("main");
        this.main.setAttribute("class", "msger-chat");

        this.chat.appendChild(header);
        this.chat.appendChild(this.main);

        this.form = document.createElement("form");
        this.form.setAttribute("class", "msger-inputarea");
        let input = document.createElement("input");
        input.setAttribute("class", "msger-input");
        let button = document.createElement("button");
        button.setAttribute("class", "msger-send-btn");
        button.textContent = "Отправить";

        this.form.appendChild(input);
        this.form.appendChild(button);

        this.form.addEventListener("submit", event => {
            event.preventDefault();
            this.sendMessage(input.value, Date.now(), JSON.parse(localStorage.user).token);
            input.value = "";
        });

        this.chat.appendChild(this.form);

        root.appendChild(this.chat);

        this.checkMessages();



    }

    appendMessage(item, userType) {
        let date = new Date(item.timestamp);
        let formattedTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + month_names[date.getMonth()] + " " + days_names[date.getMonth()];

        let text = {};
        text.msg = item.message;
        console.log(item.user);

        text.infoName = item.user.username;
        text.infoTime = formattedTime;

        let msg = new Message(this.main, userType, text);
    }

    sendMessage(text, timestamp, token) {
        this.time = +timestamp;
        return apiRequest('/chat', { method: 'POST', body: `token=${token}&message=${text}&timestamp=${timestamp}`})
            .then(apiAnswer => {
                if(apiAnswer.status === 'ok' && apiAnswer.chat){
                    // apiAnswer.chat.forEach(item => {
                    //     this.appendMessage(item, 1);
                    // });
                    return apiAnswer.chat;
                }
                else{
                    console.error('apianswer != ok');
                    return;
                }
            })
            .catch(reason => {
                console.error('err: ' + reason);
            });
    }

    getMessages(timestamp, token) {
        return apiRequest(`/chat?token=${token}&timestamp=${timestamp}`, { method: 'GET'})
            .then(apiAnswer => {
                if(apiAnswer.status === 'ok' && apiAnswer.chat){
                    apiAnswer.chat.forEach(item => {
                        this.appendMessage(item, 1);
                    });
                    return apiAnswer.chat;
                }
                else{
                    console.error('apianswer != ok');
                    return;
                }
            })
            .catch(reason => {
                console.error('err: ' + reason);
            });
    }

    checkMessages() {
        console.log(Date.now());
        var timer = setInterval(() => {
            this.getMessages(this.time, JSON.parse(localStorage.user).token);
            this.time = Date.now();
        }, 5000);
    }
}

class Message {
    constructor(root, userType, text) {
        this.msg = document.createElement("div");
        this.msg.setAttribute("class", "msg");
        if (userType === 1) this.msg.setAttribute("class", "left-msg");
        else if (userType === 2) this.msg.setAttribute("class", "right-msg");

        let msgBubble = document.createElement("div");
        msgBubble.setAttribute("class", "msg-bubble");

        let msgInfo = document.createElement("div");
        msgInfo.setAttribute("class", "msg-info");

        let msgInfoName = document.createElement("div");
        msgInfoName.setAttribute("class", "msg-info-name");
        msgInfoName.textContent = text.infoName;

        let msgInfoTime = document.createElement("div");
        msgInfoTime.setAttribute("class", "msg-info-name");
        msgInfoTime.textContent = text.infoTime;

        let msgText = document.createElement("p");
        msgText.setAttribute("class", "msg-text");
        msgText.textContent = text.msg;

        msgInfo.appendChild(msgInfoName);
        msgInfo.appendChild(msgInfoTime);

        msgBubble.appendChild(msgInfo);
        msgBubble.appendChild(msgText);


        let msg = document.querySelector(".msg-bubble");
        if (!msg) root.appendChild(msgBubble);
        else {
            root.insertBefore(msgBubble, root.childNodes[0]);
        }

    }
}
