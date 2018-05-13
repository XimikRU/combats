function sendMoveRequest(val) {
    apiRequest('turn', {method: 'post', body: val})
        .then(text => {
            console.log(text);
            res = JSON.parse(text);
            if (res.status === 'ok') {
                //healthChange(res.);
            }
            else {
                console.error(res.message);
            }
        });
}



function makeMove() {
    var head = document.querySelector('.head'),
        chest = document.querySelector('.chest'),
        torso = document.querySelector('.torso'),
        leg = document.querySelector('.leg'),
        headChest = document.querySelector('.headChest'),
        cheastTorso = document.querySelector('.cheastTorso'),
        torsoLeg = document.querySelector('.torsoLeg'),
        legHead = document.querySelector('.legHead');

    var hit;
    if (head.checked) hit = 1;
    else if (chest.checked) hit = 2;
    else if (chest.checked) hit = 3;
    else hit = 4;

    var block = [];
    if (headChest.checked) block = [1,2];
    else if (cheastTorso.checked) block = [2,3];
    else if (torsoLeg.checked) block = [3,4];
    else block=[4,1];

    var turn = JSON.stringify({"hit": hit, "blocks": block});
    console.log(turn);

    apiRequest('login', {method: 'post', body: 'user_id=KUpXGc'}).then(text=>console.log(text));
    apiRequest('fight', {method: 'post', body: 'user_id=KUpXGc'}).then(text=>console.log(text));
    apiRequest('login', {method: 'post', body: 'user_id=WOBqSz'}).then(text=>console.log(text));
    apiRequest('fight', {method: 'post', body: 'user_id=WOBqSz'}).then(text=>console.log(text));
    combatid = 'DplctY';
    //getCombatObject().combat_id
    sendMoveRequest(`user_id=${getUser().token}&combat_id=${combatid}&turn=${turn}`);
}


window.onload = function () {
    
}

function health_change(player, newValue) {
    var health = document.getElementsByClassName("progress_player" + player)[0];
    return health.value = newValue;
}

function end_game() {
    var health1 = document.getElementsByClassName("progress_player1")[0].value;
    var health2 = document.getElementsByClassName("progress_player2")[0].value;

    if (health1 <= 0 & health2 > 0) {
        return 2;
    }
    if (health1 > 0 & health2 <= 0) {
        return 1;
    }
    return 0;
}
