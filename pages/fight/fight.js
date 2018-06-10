function sendMoveRequest(params) {
    return apiRequest('/turn', {method: 'post', body: params})
        .then(apiAnswer => { return apiAnswer.combat; })
        .catch(reason => { console.error('sendMoveReq apiReq error::' + reason); })
}

function turnCreate(){
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

function consoleCombat(text){
    var console = document.querySelector('.console');
    var content = console.textContent;
    console.textContent = text + "\n" + content;
}

function healthUpdate(you, enemy){
    document.getElementById('health2').textContent = enemy;
    document.getElementById('health1').textContent = you;
}

function buttonDisable(status){
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

function makeMove() {
    var turn = turnCreate();
    var combatId = getCombatObject().id;
    var userToken = getUser().token;
    console.log(turn);
    sendMoveRequest(`token=${userToken}&combat_id=${combatId}&turn=${turn}`)
        .then(combat => { 
            console.log(combat);
            if(combat.turn_status === false){
                buttonDisable(true);
                consoleCombat('Ваш ход отправлен. Ждем хода противника...')
                healthUpdate(combat.you.health, combat.enemy.health);  
                return waitForTurn(combatId, userToken) 
            }

            if(combat.turn_status === true){
                setCombatObject(combat);
                consoleCombat('Противник предсказал ваше действие. Ход снова доступен.')
                buttonDisable(false);
                //console.log(combat.results[results.length - 1].blocked);
                healthUpdate(combat.you.health, combat.enemy.health);
                Promise.resolve(combat)
            }

            if(combat.status === 'finished'){
                setCombatObject(combat);
                consoleCombat('Битва окончена. У вас осталось ' + combat.you.health + ' HP.');
                buttonDisable(false);
                var bumpButton = document.querySelector('.bump_1');
                bumpButton.onclick = ()=>{window.location = "/ready"};
                bumpButton.textContent = 'К ПРОФИЛЮ';
                healthUpdate(combat.you.health, combat.enemy.health);
                Promise.resolve(combat)
            }
        })
        .catch(reason => {
            console.error(reason);
        })
}

function waitForTurn(combatId, userToken){
    return new Promise((resolve, reject) => {
        function timeout(){
            setTimeout(() => {
                return apiRequest(`/status?token=${userToken}&combat_id=${combatId}`)
                    .then(parsedResponse => {
                        healthUpdate(parsedResponse.combat.you.health, parsedResponse.combat.enemy.health);  
                        setCombatObject(parsedResponse.combat);
                        if(parsedResponse.combat.status === 'finished'){
                            consoleCombat('Битва окончена. У вас осталось ' + parsedResponse.combat.you.health + ' HP.');
                            //setCombatObject(parsedResponse.combat);
                            buttonDisable(false);
                            var bumpButton = document.querySelector('.bump_1');
                            bumpButton.onclick = ()=>{window.location = "/ready"};
                            bumpButton.textContent = 'К ПРОФИЛЮ';
                            resolve(parsedResponse.combat)
                        }
                        else if(parsedResponse.combat.turn_status === true)
                        {
                            //setCombatObject(parsedResponse.combat);
                            consoleCombat('Противник ответил. Ход снова доступен.')
                            //console.log(parsedResponse.combat.res);
                            buttonDisable(false);
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

window.addEventListener("DOMContentLoaded", () => {
    const photoCount = 8;
    var combat = getCombatObject();
    var user = getUser();
    var myUsername = combat.you.username;// "ME";
    var enemyUsername = combat.enemy.username; //"ENEMY";

    document.querySelector('.health1').textContent = combat.you.health;
    document.querySelector('.health2').textContent = combat.enemy.health;

    document.getElementById('player_name1').textContent = myUsername;
    document.getElementById('player_name2').textContent = enemyUsername;

    var ph1 = document.querySelector('.photo_player1');
    var ph2 = document.querySelector('.photo_player2');

    var random = Math.floor(Math.random()*photoCount+1);
    var random2 = Math.floor(Math.random()*photoCount+1);

    ph1.src = `/common/img/1 (${random}).png`;
    ph2.src = `/common/img/1 (${random2}).png`;

    ph1.width = 337;
    ph1.height = 475;

    ph2.width = 337;
    ph2.height = 475;
    
    //document.getElementById('health2').textContent = apiAnswer.combat.enemy.health;
    //document.getElementById('health1').textContent = apiAnswer.combat.you.health;

    if(combat.turn_status === false)
        waitForTurn(combat.id, user.token)
});

