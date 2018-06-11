class CombatsData{

    setCombatObject(combatObj) {
        localStorage.setItem('combat', JSON.stringify(combatObj));
        return true;
    }

    getCombatObject() {
        var combatObj = localStorage.getItem('combat');
        if (combatObj)
            return JSON.parse(combatObj);
        else
            return null;
    }

    goFight() {
        return utils.apiRequest('/fight', { method: 'POST', body: `token=${localUser.token}` })
            .then(apiAnswer => {
                if(apiAnswer.status === 'ok' && apiAnswer.combat){
                    this.setCombatObject(apiAnswer.combat);
                    return this.waitForCombat(localUser.token, apiAnswer.combat.id)
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

    waitForCombat(userToken, combatId) {
        var i = 0;
        function update(){
            setTimeout(() => { 
                combatsData.checkCombatStatus(userToken, combatId)
                .then(apiAnswer => {
                    if(apiAnswer.combat.status === 'progress'){
                        combatsData.setCombatObject(apiAnswer.combat);
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

    vddCalculate(combats){
        var victories = 0, defeats = 0, draws = 0;
        combats.forEach(combat => {
            if ((combat.you) && (combat.enemy)){
                var you = combat.you.health;
                var enemy = combat.enemy.health;

                you > enemy ? victories++ : 
                    you < enemy ? defeats++ : draws++;
            }
        });
        var vdd = {victories: victories, defeats: defeats, draws: draws};
        return vdd;
    }

    vddPersonal(combats){
        var victories = 0, defeats = 0, draws = 0;
        combats.forEach(combat => {
            var you, enemy;
            if ((combat.you) && (combat.enemy)){
            you = combat.you.health;
            enemy = combat.enemy.health;
            you > enemy ? victories++ : 
                you < enemy ? defeats++ : draws++;
            }
        });
        var vdd = {victories: victories, defeats: defeats, draws: draws};
        return vdd;
    }

    checkCombatStatus(userToken, combatId){
        return utils.apiRequest(`/status?token=${userToken}&combat_id=${combatId}`)
            .then(apiAnswer => { return apiAnswer; })
            .catch(reason => { console.error('WaitForBattle.timeout.ApiRequest() error:: ' + reason); }) 
    }

    sendMoveRequest(params) {
        return utils.apiRequest('/turn', {method: 'post', body: params})
            .then(apiAnswer => { return apiAnswer.combat; })
            .catch(reason => { console.error('sendMoveReq apiReq error::' + reason); })
    }

    turnCreate(){
        var hit = parseInt(document.querySelector('.attack:checked').value);
        var block = document.querySelector('.block:checked').value.split(",");
        block.forEach(function(item, i, arr){
           item = parseInt(item);
           console.log(typeof item);
        });
    
        var turnObj = {"hit": hit, "blocks": block};
        console.log("obJ: " + typeof turnObj); // obj
    
        var turn = JSON.stringify({"hit": hit, "blocks": block});
        console.log(typeof turn); // str
    
        return turn;
    } 

    checkCurrentCombat(userId, userToken){
        return new Promise((resolve, reject) => {
        userListData.getUserInfo(userId, userToken)
            .then(apiAnswer => {
                if(apiAnswer.combats.length > 0){
                var lastCombatStatus = apiAnswer.combats[apiAnswer.combats.length-1].status;
                var lastCombat = apiAnswer.combats[apiAnswer.combats.length-1];
                    if(lastCombatStatus !== 'finished')
                    {
                        combatsData.setCombatObject(lastCombat);
                        this.waitForCombat(userToken, lastCombat.id);
                        // resolve()?
                    }
                }
            })
        });
    }
    
}

window.combatsData = new CombatsData();