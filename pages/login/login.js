function registerUser(username, password) {
    return new Promise((resolve, reject) => {
        apiRequest('/register', {
                method: 'POST',
                body: `username=${username}&password=${password}`
            })
            .then(apiAnswer => {
                if (apiAnswer.status === 'ok' && apiAnswer.user) {
                    if(setUser(apiAnswer.user)){
                        resolve(apiAnswer.user);
                    }
                    else{
                        reject('Cant setUser();')
                    }
                }
                else{
                    reject('parsedAnswerRegister.status != OK;');
                }
            })
            .catch(reason => reject(reason));
    });
}

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        apiRequest('/login', {
                method: 'POST',
                body: `username=${username}&password=${password}`
            })
            .then(apiAnswer => {
                if (apiAnswer.status === 'ok' && apiAnswer.user) {
                    if(setUser(apiAnswer.user)){
                        resolve(apiAnswer.user);
                    }
                    else{
                        reject('Cant setUser(); ');
                    }
                }
                else{
                    reject('LoginAnswer.status != ok; ');
                }       
            })
            .catch(reason => reject(reason));
    });
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-registr').addEventListener('click', () => {
        var username = document.querySelector('.inp-username').value;
        var password = document.querySelector('.inp-password').value;
        registerUser(username, password)
            .then(result => {
                loginUser(username, password)
                    .then(result => {window.location = '/ready/';})
                    .catch(reason => showMessage(reason));
                })
            .catch(reason => showMessage(reason));
    });

    document.querySelector('.btn-login').addEventListener('click', () => {
        var username = document.querySelector('.inp-username').value;
        var password = document.querySelector('.inp-password').value;
        loginUser(username, password)
            .then(result => {window.location = '/ready/';})
            .catch(reason => showMessage(reason));
    });
});


