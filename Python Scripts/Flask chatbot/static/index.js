const chatBox = document.querySelector(".chat-box");
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector("button");
const chatBoxBody = chatBox.querySelector(".chat-box-body");

button.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = inputField.value;
  inputField.value = "";
  chatBoxBody.innerHTML += `<div class="message"><span>${message}</span></div>`;
  chatBoxBody.innerHTML += `<div id="loading" class="response loading">...</div>`;
  scrollToBottom();

  window.dotsGoingUp = true;
  var dots = window.setInterval(function() {
    var wait = document.getElementById("loading");
    if (window.dotsGoingUp) {
      wait.innerHTML += ".";
    } else {
      wait.innerHTML = wait.innerHTML.substring(1, wait.innerHTML.length);
      if (wait.innerHTML.length < 2)
        window.dotsGoingUp = true;
    }
    if (wait.innerHTML.length > 3) window.dotsGoingUp = false;
  }, 250);

  // Update the fetch URL to the correct Flask endpoint
  fetch(`http://localhost:81/generate/${encodeURIComponent(message)}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("loading").remove();
    chatBoxBody.innerHTML += `<div class="response"><span>${data.data[0].text}</span></div>`;
    scrollToBottom();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById("loading").remove();
    chatBoxBody.innerHTML += `<div class="response error"><span>Sorry, something went wrong. Please try again later.</span></div>`;
    scrollToBottom();
  });
}

function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}
// https://manuel.pinto.dev

