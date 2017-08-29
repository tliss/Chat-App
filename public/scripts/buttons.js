document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    document.getElementById('Submit').addEventListener('click', postToDB);

    retrieveMessages();

    // self-invoking function - https://sarfraznawaz.wordpress.com/2012/01/26/javascript-self-invoking-functions/
    (function autoShowMessages(){
        retrieveMessages();
        setTimeout(autoShowMessages, 1000);
    })();
}

function postToDB(event){
    var req = new XMLHttpRequest();
    var payload = {};
    payload.text = document.getElementById('text').value;
    req.open("POST", "/insert", true);
    req.addEventListener('load', retrieveMessages(event));
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    var text = document.getElementById('text');
    text.value = "";
    event.preventDefault();
}

function retrieveMessages(event){
    var req = new XMLHttpRequest();
    req.open("GET", "/getMessages", true);
    req.addEventListener('load', function(){
        var response = JSON.parse(req.responseText);
        displayMessages(response);
    });
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(null);
    if (event) {
        event.preventDefault();
    }
}

function displayMessages(response) {
    var chatbox = document.getElementById('chatbox');
    var scrollToBottom = true;
    console.log(chatbox.scrollTop, chatbox.scrollHeight, chatbox.offsetHeight);
    if (chatbox.scrollTop !== (chatbox.scrollHeight - chatbox.offsetHeight + 2)){
        scrollToBottom = false;
    }

    chatbox.textContent = "";

    for (var row of response.rows) {
        var message = document.createElement("p");
        message.textContent = row.textValue;
        chatbox.appendChild(message);
    };

    if (scrollToBottom) {
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}
