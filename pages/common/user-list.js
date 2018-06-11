class UserListData {

    constructor(){
        this.eventHandler = {};
    }

    on(eventName, callback){
        if (!this.eventHandler[eventName])
            this.eventHandler[eventName] = [];
        
        this.eventHandler[eventName].push(callback);
        //console.log(this.eventHandler[eventName]);
    }

    execute(eventName){
        if(this.eventHandler[eventName]){
            this.eventHandler[eventName].forEach(element => {
                console.log(element);
            });
        }   
    }

    update() {
        function update(){
            setTimeout(() => { 
                getOnline().then(result => update()).catch(result => update())
            }, 5000)
        }
    }

    getOnline() {
        return utils.apiRequest('/online')
            .then(apiAnswer => { 
                this.execute('update');
                return apiAnswer.users; 
            })
            .catch(reason => { return []; });
    }


    getUserInfo(user_id, token) {
        return new Promise((resolve, reject) => {
            utils.apiRequest(`/info?token=${localUser.token}&user_id=${user_id}`)
                .then(apiAnswer => {
                    if (apiAnswer.status === 'ok' && apiAnswer.user) {
                        this.execute('getUserInfo');
                        resolve(apiAnswer);
                    } else {
                        reject('getUserInfo.status != OK; ');
                    }
                })
                .catch(reason => {
                    reject('/Info req error; ' + reason);
                });
        });
    }
}

window.userListData = new UserListData();