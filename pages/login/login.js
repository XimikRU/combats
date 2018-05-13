 window.addEventListener("load", () => {
     var old = getUser();
     if(old){
         apiRequest(`/whoami?user_id=${old.token}`)
            .then(text => {
                 res = JSON.parse(text);               
                    if(res.status==='ok')
                    {                                                        
                     window.location = "/ready/";                  
                    }
            });    
     }
        document.querySelector('.registration').onclick=function()
        {   
            var username=document.querySelector('.login').value; 
            var res;               
            apiRequest('/register', { method: 'POST', body: `username=${username}` })
                .then(text => {
                 res = JSON.parse(text);               
                    if(res.status==='ok')
                    {         
                        setUserId({ username:res.user.username, token:res.user.id });                          
                     window.location = "/ready/ready.html";                  
                    }
            });
        }
     })
 
