function getOnline() {
    return apiRequest('/online')
        .then(responseText => {
            const response = JSON.parse(responseText);
            return response.users.map(item => {
                return `<li>${item.username}</li>`;
            });
        })
        .catch(reason => {
            console.error(reason);
            return [];
        });

}

function addList(list) {
    var listElement = document.querySelector('.list');
    listElement.innerHTML += list.join('');
}

window.addEventListener('load', () => {
    getOnline()
        .then(addList);
})

function goFight() {
    var user_id = getUser().token;
    console.log('ID: ' + user_id);

    return apiRequest('/fight', {
            method: 'POST',
            body: `user_id=${user_id}`
        })
        .then(responseText => {
            console.log(responseText);
            setCombatObject(responseText);
            return waitForBattle();
        })
        .catch(reason => {
            console.error(reason);
        });
}

function waitForBattle() {
    var user_id = getUser().token;
    console.log('ID: ' + user_id);

    var combat = getCombatObject();
    var combat_id = combat.combat_id;
    console.log('COMBAT: ' + combat);
    console.log('CID: ' + combat_id);
    
    setTimeout(() => {
            return apiRequest(`/status?user_id=${user_id}&combat_id=${combat_id}`)
                .then(responseText => console.log(responseText))
                .catch(reason => console.error(reason))
    }, 1000);
}