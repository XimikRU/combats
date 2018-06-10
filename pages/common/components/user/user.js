class UserData {
    //function setUser(userObj) {
    set(userObj) {
        localStorage.setItem('user', JSON.stringify(userObj))
        return true;
    }

    get() {
        var userObj = localStorage.getItem('user');
        if (userObj)
            return JSON.parse(userObj);
        else
            return null;
    }

    clearLocalStorage() {
        localStorage.removeItem('user');
        localStorage.removeItem('combat');
        return true;
    }

    whoAmI() {
        return new Promise((resolve, reject) => {
            var localUser;
            if (localUser = this.get()) {
                apiRequest(`/whoami?token=${localUser.token}`)
                    .then(apiAnswer => {
                        if (apiAnswer.status === 'ok') {
                            resolve(apiAnswer);
                        } else {
                            reject('WhoAmi.status != OK; ');
                        }
                    })
                    .catch(reason => {
                        reject('whoAmiAPI error; ' + reason);
                    });
            }
            else{
                reject('Cant getUser(); ');
            }
        });
    }

    logOut(){
        if(this.clearLocalStorage())
            window.location = '/login/';
    }

    registerUser(username, password) {
        return new Promise((resolve, reject) => {
            apiRequest('/register', {
                method: 'POST',
                body: `username=${username}&password=${password}`
            })
                .then(apiAnswer => {
                    if (apiAnswer.status === 'ok' && apiAnswer.user) {
                        if(userData.set(apiAnswer.user)){
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

    loginUser(username, password) {
        return new Promise((resolve, reject) => {
            apiRequest('/login', {
                method: 'POST',
                body: `username=${username}&password=${password}`
            })
                .then(apiAnswer => {
                    if (apiAnswer.status === 'ok' && apiAnswer.user) {
                        if(userData.set(apiAnswer.user)){
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
}

window.userData = new UserData();