window.addEventListener("DOMContentLoaded", () => {
    const photoCount = 8;
    var combat = combatsData.getCombatObject();
    var user = userData.get();
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
        combatsInterface.waitForTurn(combat.id, user.token)
});

