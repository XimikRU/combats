function apiRequest(request)
{
    return fetch(`localhost:3333/${request}`)
        .then(response => response.text())
}