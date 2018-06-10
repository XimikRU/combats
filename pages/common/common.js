(function () {
    //var userListData = new UserListData();

    function handleErrors(response) {
        if (response.status === 403) {
            showMessage('forbidden');
        }
        if (response.status >= 400)
            return Promise.reject(response);
        else return response;
    }

    function apiRequest(request, {method, body} = {}) {
        return fetch(`http://localhost:3333${request}`, {
            method,
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body
        })
            .then(handleErrors)
            .then(response => response.json())
    }



    function showProfile(event){
        var user_id = event.target.dataset.user;
        var token = userData.get().token;
        return userListData.getUserInfo(user_id, token)
            .then(apiAnswer => {
                fillProfile(apiAnswer.user, apiAnswer.combats);
            })
            .catch(reason => {console.error('getUserInfo err: ' + reason);})
    }

    function fillProfile(user, combats) {
        var vdd = combatsData.vddPersonal(combats);
        document.getElementsByClassName("user_name")[0].innerHTML = "";
        document.querySelector(".victories").innerHTML = "";
        document.getElementsByClassName("battleCount")[0].innerHTML = "";
        document.getElementsByClassName("lastStatus")[0].innerHTML = "";

        document.getElementsByClassName("user_name")[0].innerHTML = user.username;
        document.querySelector(".victories").innerHTML = vdd.victories;
        document.getElementsByClassName("parange")[0].style.display = 'block';
        document.getElementsByClassName("battleCount")[0].innerHTML = combats.length;
        if(combats.length > 0){
            document.getElementsByClassName("lastStatus")[0].innerHTML = combats[combats.length-1].status;
        }
    }

    function hideUserProfile() {
        document.getElementsByClassName("parange")[0].style.display = 'none';
    }

    function addList(userList) {
        var listElement = document.querySelector('.nav-ul');
        listElement.innerHTML = "";
        var liUserList = userList.map(item => {
            return `<li><a data-user='${item.id}'>${item.username}</a></li>`;
        });
        listElement.innerHTML += liUserList.join('');
    }

    function showMessage(message) {
        var newDiv = document.createElement("P");
        var newContent;
        if (message.status && message.statusText)
            newContent = document.createTextNode("status: " + message.status + " " + message.statusText);
        else
            newContent = document.createTextNode(message);
        newDiv.setAttribute("class", "messageDialog showMessage");
        newDiv.appendChild(newContent);
        document.body.appendChild(newDiv);
    }


    window.handleErrors = handleErrors;
    window.apiRequest = apiRequest;
    window.fillProfile = fillProfile;
    window.hideUserProfile = hideUserProfile;
    window.addList = addList;
    window.showMessage = showMessage;
    window.showProfile = showProfile;
    // window.vddCalculate = vddCalculate;
    // window.vddPersonal = vddPersonal;
})();