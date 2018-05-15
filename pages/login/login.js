 window.addEventListener("load", () => {
     var old = getUser();
     if (old) {
         apiRequest(`/whoami?user_id=${old.token}`)
             .then(text => {
                 res = JSON.parse(text);
                 if (res.status === 'ok') {
                     window.location = "/ready/";
                 }
             });
     }

     document.querySelector('.btn-login').onclick = function () {
         var username = document.querySelector('.inp-username').value;
         apiRequest('/register', {
                 method: 'POST',
                 body: `username=${username}`
             })
             .then(text => {
                 var res = JSON.parse(text);
                 if (res.status === 'ok') {
                     setUserId({
                         username: res.user.username,
                         token: res.user.id
                     });
                     window.location = "/ready/";
                 }
             });
     }
 })