class CombatsInterface{
    makeMove() {
        var turn = combatsData.turnCreate();
        var combatId = combatsData.getCombatObject().id;
        var userToken = userData.get().token;
        console.log(turn);
        combatsData.sendMoveRequest(`token=${userToken}&combat_id=${combatId}&turn=${turn}`)
            .then(combat => { 
                console.log(combat);
                if(combat.turn_status === false){
                    this.buttonDisable(true);
                    this.consoleCombat('Ваш ход отправлен. Ждем хода противника...')
                    this.healthUpdate(combat.you.health, combat.enemy.health);  
                    return this.waitForTurn(combatId, userToken) 
                }
    
                if(combat.turn_status === true){
                    combatsData.setCombatObject(combat);
                    this.consoleCombat('Противник предсказал ваше действие. Ход снова доступен.')
                    this.buttonDisable(false);
                    //console.log(combat.results[results.length - 1].blocked);
                    this.healthUpdate(combat.you.health, combat.enemy.health);
                    Promise.resolve(combat)
                }
    
                if(combat.status === 'finished'){
                    combatsData.setCombatObject(combat);
                    this.consoleCombat('Битва окончена. У вас осталось ' + combat.you.health + ' HP.');
                    this.buttonDisable(false);
                    var bumpButton = document.querySelector('.bump_1');
                    bumpButton.onclick = ()=>{window.location = "/ready"};
                    bumpButton.textContent = 'К ПРОФИЛЮ';
                    this.healthUpdate(combat.you.health, combat.enemy.health);
                    Promise.resolve(combat)
                }
            })
            .catch(reason => {
                console.error(reason);
            })
    }

    consoleCombat(text){
        var console = document.querySelector('.console');
        var content = console.textContent;
        console.textContent = text + "\n" + content;
    }

    healthUpdate(you, enemy){
        document.getElementById('health2').textContent = enemy;
        document.getElementById('health1').textContent = you;
    }
    
    buttonDisable(status){
        var bumpButton = document.querySelector('.bump_1');
        if(status){
            bumpButton.disabled = true;
            bumpButton.style.backgroundColor = "grey";
        }
        if(!status){
            bumpButton.disabled = false;
            bumpButton.style.backgroundColor = "#4c64ea";
        }
    }

    waitForTurn(combatId, userToken){
        return new Promise((resolve, reject) => {
            function timeout(){
                setTimeout(() => {
                    return utils.apiRequest(`/status?token=${userToken}&combat_id=${combatId}`)
                        .then(parsedResponse => {
                            combatsInterface.healthUpdate(parsedResponse.combat.you.health, parsedResponse.combat.enemy.health);  
                            combatsData.setCombatObject(parsedResponse.combat);
                            if(parsedResponse.combat.status === 'finished'){
                                combatsInterface.consoleCombat('Битва окончена. У вас осталось ' + parsedResponse.combat.you.health + ' HP.');
                                //setCombatObject(parsedResponse.combat);
                                combatsInterface.buttonDisable(false);
                                var bumpButton = document.querySelector('.bump_1');
                                bumpButton.onclick = ()=>{window.location = "/ready"};
                                bumpButton.textContent = 'К ПРОФИЛЮ';
                                resolve(parsedResponse.combat)
                            }
                            else if(parsedResponse.combat.turn_status === true)
                            {
                                //setCombatObject(parsedResponse.combat);
                                combatsInterface.consoleCombat('Противник ответил. Ход снова доступен.')
                                //console.log(parsedResponse.combat.res);
                                combatsInterface.buttonDisable(false);
                                resolve(parsedResponse.combat);
                            }
                            else if(parsedResponse.combat.turn_status === false){
                                console.log("w8");
                                timeout();
                            }
                        })
                        .catch(reason => {
                            console.error('WaitForBattle.timeout.ApiRequest() error:: ' + reason);
                            //TODO: Добавить логику на сломанный apiRequest();
                    })
                }, 1000);
            }
            timeout();     
        });
    }

}

window.combatsInterface = new CombatsInterface();