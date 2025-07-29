function toggleChat() {
  const widget = document.querySelector('.chatbot-widget');
  widget.style.display = (widget.style.display === 'none' || widget.style.display === '') ? 'flex' : 'none';
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  // Show loading indicator
  const loaderId = addLoader();

  fetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message: message }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    removeLoader(loaderId);
    addMessage("bot", data.message);
  })
  .catch(err => {
    console.error("Error:", err);
    removeLoader(loaderId);
    addMessage("bot", "Oops! Something went wrong.");
  });
}

function addMessage(sender, text) {
  const chatbox = document.getElementById("chatbox");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  if (sender === "bot") {
    const avatar = document.createElement("img");
    avatar.src = "https://img.icons8.com/cotton/64/robot-2.png";
    avatar.alt = "Bot";
    avatar.className = "avatar";
    messageDiv.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;
  messageDiv.appendChild(bubble);

  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addLoader() {
  const chatbox = document.getElementById("chatbox");
  const loaderId = `loader-${Date.now()}`;
  const loader = document.createElement("div");
  loader.className = "message bot";
  loader.id = loaderId;

  const avatar = document.createElement("img");
  avatar.src = "https://img.icons8.com/cotton/64/robot-2.png";
  avatar.className = "avatar";

  const bubble = document.createElement("div");
  bubble.className = "bubble loading";
  bubble.innerHTML = "<span>.</span><span>.</span><span>.</span>";

  loader.appendChild(avatar);
  loader.appendChild(bubble);
  chatbox.appendChild(loader);
  chatbox.scrollTop = chatbox.scrollHeight;

  return loaderId;
}

function removeLoader(id) {
  const loader = document.getElementById(id);
  if (loader) loader.remove();
}
