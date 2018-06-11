function currentProfile(localUser){
    return new Promise((resolve, reject) => {

        userListData.getUserInfo(localUser.id, localUser.token)
            .then(apiAnswer => {
                    // Подсчет побед/пораж/ничей
                    if(apiAnswer.combats.length > 0)
                        var vdd = combatsData.vddCalculate(apiAnswer.combats);
                    else
                        var vdd = {victories: 0, defeats: 0, draws: 0};
                    var out = `
                    <li> Username: ${localUser.username} </li>
                    <li> Id: ${localUser.id} </li>
                    <li> Combats: ${apiAnswer.combats.length} </li>
                    <li> Victories: ${vdd.victories} </li>
                    <li> Defeats: ${vdd.defeats} </li>
                    <li> Draws: ${vdd.draws} </li>
                    `;
                if(apiAnswer.combats.length > 0)
                    out += `<li>Status: ${apiAnswer.combats[apiAnswer.combats.length-1].status}</li>`;
                out += `<li onclick="userData.logOut()" style="float:right">Logout </li>`;
                document.querySelector('.current-profile').innerHTML += out;
            })
            .catch(reason => {
                reject('/Info req error; ' + reason);
            });
    });
}

window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn-fight').addEventListener('click', () => {
        combatsData.goFight();
    });


    userListData.getOnline()
        .then(addList);
    
    setInterval(function(){
        userListData.getOnline()
            .then(addList);
    }, 5000)
    

    userData.whoAmI()
        .then(result => {
            window.localUser = result.user;
            currentProfile(localUser);
            if(combatsData.getCombatObject())
                combatsData.waitForCombat(localUser.token, combatsData.getCombatObject().id); 
            else
                combatsData.checkCurrentCombat(localUser.id, localUser.token)
        })
        .catch(reason => {
            alert('No local user' + reason);
            userData.logOut();
        })
});