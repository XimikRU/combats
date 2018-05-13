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