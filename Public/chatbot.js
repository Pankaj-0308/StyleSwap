// Gemini Chatbot Frontend
const chatbotFab = document.getElementById('chatbot-fab');

// Inject beautiful premium glassmorphism styling
const style = document.createElement('style');
style.textContent = `
  #gemini-chatbot {
    position: fixed;
    bottom: 100px;
    right: 32px;
    width: 380px;
    height: 520px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    background: rgba(255, 252, 247, 0.88);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 24px 60px rgba(44, 50, 45, 0.16);
    border-radius: 24px;
    font-family: 'Manrope', sans-serif;
    overflow: hidden;
    animation: chatbotSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes chatbotSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chatbot-header {
    padding: 18px 24px;
    background: linear-gradient(135deg, var(--accent-strong, #415846), var(--accent, #5f7a65));
    color: #fdfaf4;
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    font-size: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  #gemini-chatbot-close {
    background: none;
    border: none;
    color: #fdfaf4;
    font-size: 1.6rem;
    cursor: pointer;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.2s, transform 0.2s;
  }

  #gemini-chatbot-close:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .chatbot-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: rgba(255, 255, 255, 0.25);
  }

  .chatbot-messages::-webkit-scrollbar {
    width: 6px;
  }
  .chatbot-messages::-webkit-scrollbar-thumb {
    background: rgba(44, 59, 50, 0.15);
    border-radius: 3px;
  }

  .chatbot-messages div {
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 80%;
    font-size: 0.92rem;
    line-height: 1.45;
    word-wrap: break-word;
    box-shadow: 0 2px 4px rgba(44, 50, 45, 0.02);
  }

  .chatbot-messages .user {
    align-self: flex-end;
    background: var(--accent-soft, #dbe5d8);
    color: var(--accent-strong, #415846);
    border-bottom-right-radius: 4px;
  }

  .chatbot-messages .bot {
    align-self: flex-start;
    background: var(--surface-strong, #fffdf9);
    color: var(--text, #1f2a23);
    border: 1px solid rgba(44, 59, 50, 0.08);
    border-bottom-left-radius: 4px;
  }

  #gemini-chatbot-form {
    display: flex;
    padding: 16px 20px;
    background: var(--surface-strong, #fffdf9);
    border-top: 1px solid rgba(44, 59, 50, 0.08);
    gap: 12px;
    align-items: center;
  }

  #gemini-chatbot-input {
    flex: 1;
    padding: 12px 20px;
    border-radius: 999px;
    border: 1.5px solid rgba(44, 59, 50, 0.14);
    background: #fff;
    font-size: 0.92rem;
    outline: none;
    color: var(--text);
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  #gemini-chatbot-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(95, 122, 101, 0.15);
  }

  #gemini-chatbot-form button {
    background: linear-gradient(145deg, var(--accent-strong), var(--accent));
    color: #fdfaf4;
    border: none;
    height: 42px;
    padding: 0 22px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(65, 88, 70, 0.12);
    transition: all 0.2s ease;
  }

  #gemini-chatbot-form button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(65, 88, 70, 0.18);
  }
`;
document.head.appendChild(style);

// Chat UI Creation
function createChatUI() {
  const container = document.createElement('div');
  container.id = 'gemini-chatbot';
  container.innerHTML = `
    <div class="chatbot-header">
      <span>SwapStyle Assistant</span>
      <button id="gemini-chatbot-close">×</button>
    </div>
    <div class="chatbot-messages" id="gemini-chatbot-messages">
      <div class="bot">Hello! I am your SwapStyle assistant. Ask me anything about swapping clothes or managing points!</div>
    </div>
    <form id="gemini-chatbot-form">
      <input type="text" id="gemini-chatbot-input" placeholder="Type your message..." autocomplete="off" required />
      <button type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(container);
  
  document.getElementById('gemini-chatbot-close').onclick = () => {
    container.style.display = 'none';
  };

  document.getElementById('gemini-chatbot-form').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('gemini-chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage('You', msg);
    input.value = '';
    
    // Add loading indicator bubble
    appendMessage('Gemini', '...');
    
    try {
      const res = await fetch('/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      
      // Update loading bubble
      const lastBotBubble = document.querySelector('#gemini-chatbot-messages .bot:last-child');
      if (lastBotBubble) {
        lastBotBubble.textContent = data.reply || 'Sorry, I could not generate a response.';
      }
    } catch (error) {
      console.error('Error fetching chatbot reply:', error);
      const lastBotBubble = document.querySelector('#gemini-chatbot-messages .bot:last-child');
      if (lastBotBubble) {
        lastBotBubble.textContent = 'Error contacting the assistant. Please try again.';
      }
    }
  };
}

function appendMessage(sender, text) {
  const messages = document.getElementById('gemini-chatbot-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = sender === 'You' ? 'user' : 'bot';
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

if (chatbotFab) {
  chatbotFab.onclick = () => {
    let bot = document.getElementById('gemini-chatbot');
    if (!bot) {
      createChatUI();
    } else {
      bot.style.display = bot.style.display === 'none' ? 'flex' : 'none';
    }
  };
}
