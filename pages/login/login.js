window.addEventListener('DOMContentLoaded', () => {

    if (userData.get()) {
        location = '/ready';
    }

    document.querySelector('.btn-registr').addEventListener('click', () => {
        var username = document.querySelector('.inp-username').value;
        var password = document.querySelector('.inp-password').value;
        userData.registerUser(username, password)
            .then(result => {
                userData.loginUser(username, password)
                    .then(result => {window.location = '/ready/';})
                    .catch(reason => utils.showMessage(reason));
            })
            .catch(reason => utils.showMessage(reason));
    });

    document.querySelector('.btn-login').addEventListener('click', () => {
        var username = document.querySelector('.inp-username').value;
        var password = document.querySelector('.inp-password').value;
        userData.loginUser(username, password)
            .then(result => {window.location = '/ready/';})
            .catch(reason => utils.showMessage(reason));
    });
});


