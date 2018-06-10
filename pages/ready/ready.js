function goFight() {
    return apiRequest('/fight', { method: 'POST', body: `token=${localUser.token}` })
        .then(apiAnswer => {
            if(apiAnswer.status === 'ok' && apiAnswer.combat){
                setCombatObject(apiAnswer.combat);
                return waitForCombat(localUser.token, apiAnswer.combat.id)
            }
            else{
                console.error('apianswer != ok')
                return;
            }
        })
        .catch(reason => {
            console.error('FightAPI req error: ' + reason);
        });
}

function waitForCombat(userToken, combatId) {
    var i = 0;
    function update(){
        setTimeout(() => {
            checkCombatStatus(userToken, combatId)
                .then(apiAnswer => {
                    if(apiAnswer.combat.status === 'progress'){
                        setCombatObject(apiAnswer.combat);
                        // TODO:
                        // BOF InterfaceUpdate()
                        var buttonFight = document.querySelector('.btn-fight');
                        buttonFight.value = "ПРОТИВНИК!";
                        buttonFight.onclick = function(){
                            window.location="/fight";
                        };
                        // EOF InterfaceUpdate()
                        return apiAnswer.combat.status;
                    }
                    if(apiAnswer.combat.status === 'pending'){
                        var buttonFight = document.querySelector('.btn-fight');
                        buttonFight.value = "ПОИСК... " + ++i;
                        update();
                    }
                })
        }, 1000);
    }
    update();
}

// TODO:
function currentProfile(localUser){
    return new Promise((resolve, reject) => {
        userListData.getUserInfo(localUser.id, localUser.token)
            .then(apiAnswer => {
                // Подсчет побед/пораж/ничей
                if(apiAnswer.combats.length > 0)
                    var vdd = vddCalculate(apiAnswer.combats);
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

function checkCurrentCombat(userId, userToken){
    return new Promise((resolve, reject) => {
        userListData.getUserInfo(userId, userToken)
        .then(apiAnswer => {
            if(apiAnswer.combats.length > 0){
            var lastCombatStatus = apiAnswer.combats[apiAnswer.combats.length-1].status;
            var lastCombat = apiAnswer.combats[apiAnswer.combats.length-1];
                if(lastCombatStatus !== 'finished')
                {
                    setCombatObject(lastCombat);
                    waitForCombat(userToken, lastCombat.id);
                    // resolve()?
                }
            }})
    });
}

window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn-fight').addEventListener('click', () => {
        goFight();
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
            if(getCombatObject())
                waitForCombat(localUser.token, getCombatObject().id);
            else
                checkCurrentCombat(localUser.id, localUser.token)
        })
        .catch(reason => {
            alert('No local user' + reason);
            userData.logOut();
        })
});