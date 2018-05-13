(function(){
    function apiRequest(request, {
        method,
        body
    }) {
        return fetch(`http://localhost:3333${request}`, {
            method,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body
        }).then(response => response.text());
    }

    function setUserId(val) {
        localStorage.setItem('username', val.name);
        localStorage.setItem('usertoken', val.token);
        // localStorage.setItem('user', {name:"newurnew", token:"KUpXGc"})
    }

    function getUser() {
        return {name: localStorage.getItem("username"), token: localStorage.getItem("usertoken")};
    }

    function removeUserId() {
        localStorage.removeItem('user');
    }

    window.apiRequest = apiRequest;
    window.setUserId = setUserId;
    window.getUser = getUser;
})();


// setUserId({name: 'user', token:'tolen'});