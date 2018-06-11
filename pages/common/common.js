(function() {
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

    window.fillProfile = fillProfile;
    window.hideUserProfile = hideUserProfile;
    window.addList = addList;
    window.showProfile = showProfile;
})();