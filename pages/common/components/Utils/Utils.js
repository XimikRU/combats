class Utils {

    handleErrors(response) {
        if (response.status === 403) {
            utils.showMessage('forbidden');
        }
        if (response.status >= 400)
            return Promise.reject(response);
        else return response;
    }

    apiRequest(request, {method, body} = {}) {
        return fetch(`http://localhost:3333${request}`, {
            method,
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body
        })
            .then(utils.handleErrors)
            .then(response => response.json())
    }

    showMessage(message) {
        var newDiv = document.createElement("P");
        var newContent;
        if (message.status && message.statusText)
            newContent = document.createTextNode("status: " + message.status + " " + message.statusText);
        else
            newContent = document.createTextNode(message);
        newDiv.setAttribute("class", "messageDialog showMessage");
        newDiv.appendChild(newContent);
        document.body.appendChild(newDiv);
    }
}

window.utils = new Utils();