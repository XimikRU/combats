function sendMoveRequest(val) {
    return apiRequest('/turn', {method: 'post', body: val})
        .then(text => {
            res = JSON.parse(text);
            return res;
        });
}



function makeMove() {

    //в какие комбинации бить
    var hit = parseInt(document.querySelector('.attack:checked').value);
    //массив строк -> массив чисел
    var block = document.querySelector('.block:checked').value.split(",");
    block.forEach(function(item, i, arr){
        item = parseInt(item);});

    console.log(block);
    var turn = JSON.stringify({"hit": hit, "blocks": block});
    console.log(turn);

    combatid = getCombatObject().combat.id;
    sendMoveRequest(`token=${getUser().token}&combat_id=${combatid}&turn=${turn}`)
        .then(res => {
            if (res.status === 'ok') {
                console.log(res);
                // health_change(1, res.combat.enemy.health);
                document.getElementById('health2').textContent = res.combat.enemy.health;
                document.getElementById('health1').textContent = res.combat.you.health;
            }
            else {
                console.error(res.message);
            }
        });

}

function health_change(player, newValue) {
    var health = document.getElementById("health" + player);
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






window.addEventListener("DOMContentLoaded", load);
function load()
{
    var login_me = getUser().username;
    document.getElementById('player_name1').textContent = login_me;
    var  combat = getCombatObject();
    if(combat.combat.players)
    {
        var login_enemy = getCombatObject().combat.players.find(user => user.username !== login_me).username;
        document.getElementById('player_name2').textContent = login_enemy;
    }
}

