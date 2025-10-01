// Cat facts database (20+ facts)
const catFacts = [
    "Cats sleep for 70% of their lives 😴",
    "A group of cats is called a clowder 🐱",
    "Cats have 32 muscles in each ear 👂",
    "Cats can rotate their ears 180 degrees 🔄",
    "A cat's purr vibrates at 25-150 Hz, which can heal bones 🦴",
    "Cats spend 30-50% of their day grooming 🧼",
    "A cat has been the mayor of an Alaskan town for 20 years 🏛️",
    "Cats can make over 100 different sounds 🔊",
    "A cat's nose print is unique, like a human fingerprint 👃",
    "Cats can jump up to 6 times their length 🦘",
    "Cats have a third eyelid called a nictitating membrane 👁️",
    "A cat's heart beats nearly twice as fast as a human heart 💓",
    "Cats can run up to 30 miles per hour 🏃",
    "A cat's brain is 90% similar to a human's brain 🧠",
    "Cats have more bones than humans (230 vs 206) 🦴",
    "Cats can't taste sweetness 🍬",
    "A cat's whiskers are roughly as wide as its body 📏",
    "Cats spend 15-20 hours a day sleeping 💤",
    "The oldest cat ever lived to be 38 years old 👴",
    "Cats have a special organ for smelling called Jacobson's organ 👃",
    "A cat's meow is specifically designed to communicate with humans 🗣️",
    "Cats walk like camels and giraffes (both right feet, then both left) 🚶",
    "A housecat can reach speeds of up to 30 mph 🏎️",
    "Cats dream just like humans do 💭",
    "A cat's flexible backbone has 53 loosely fitting vertebrae 🦴"
];

// Cat emojis for random inclusion
const catEmojis = ['🐱', '😹', '🐈', '😺', '😸', '😻', '😽'];

// Global state
let messageCount = 0;
let lastFactIndex = -1;
let nextFactTrigger = getRandomFactTrigger();

// DOM elements
const messagesContainer = document.getElementById('messages');
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    clearButton.addEventListener('click', handleClearHistory);
}

// Handle sending a message
function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Display user message
    displayMessage(message, 'user');
    userInput.value = '';
    
    // Show loading indicator
    loadingIndicator.classList.add('active');
    
    // Generate and display CatGPT response after delay
    const delay = Math.random() * 500 + 500; // 500-1000ms
    setTimeout(() => {
        loadingIndicator.classList.remove('active');
        const meowResponse = generateMeowResponse();
        displayMessage(meowResponse, 'catgpt');
        
        // Increment message count and check for cat fact
        messageCount++;
        if (messageCount >= nextFactTrigger) {
            displayCatFact();
            messageCount = 0;
            nextFactTrigger = getRandomFactTrigger();
        }
        
        saveChatHistory();
        scrollToBottom();
    }, delay);
}

// Generate random meow response
function generateMeowResponse() {
    const meowCount = Math.floor(Math.random() * 20) + 1; // 1-20 meows
    let meows = [];
    
    for (let i = 0; i < meowCount; i++) {
        meows.push(randomCapitalizeMeow());
    }
    
    // Random spacing: single space, comma separation, or mixed
    const spacingType = Math.random();
    let response;
    if (spacingType < 0.33) {
        response = meows.join(' ');
    } else if (spacingType < 0.66) {
        response = meows.join(', ');
    } else {
        response = meows.map((meow, i) => {
            if (i === meows.length - 1) return meow;
            return Math.random() < 0.5 ? meow + ' ' : meow + ', ';
        }).join('');
    }
    
    // 40% chance to include cat emojis
    if (Math.random() < 0.4) {
        const emojiCount = Math.floor(Math.random() * 3) + 1; // 1-3 emojis
        for (let i = 0; i < emojiCount; i++) {
            const randomEmoji = catEmojis[Math.floor(Math.random() * catEmojis.length)];
            const words = response.split(' ');
            const randomPosition = Math.floor(Math.random() * words.length);
            words.splice(randomPosition, 0, randomEmoji);
            response = words.join(' ');
        }
    }
    
    // 30% chance to add purr at the end
    if (Math.random() < 0.3) {
        response += ' purr…';
    }
    
    return response;
}

// Randomly capitalize "meow"
function randomCapitalizeMeow() {
    const meow = 'meow';
    let result = '';
    for (let char of meow) {
        result += Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase();
    }
    return result;
}

// Display a message in the chat
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestamp';
    timestampDiv.textContent = getCurrentTimestamp();
    
    bubbleDiv.appendChild(textDiv);
    bubbleDiv.appendChild(timestampDiv);
    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);
    
    scrollToBottom();
}

// Display a cat fact
function displayCatFact() {
    // Get a random fact that wasn't the last one
    let factIndex;
    do {
        factIndex = Math.floor(Math.random() * catFacts.length);
    } while (factIndex === lastFactIndex && catFacts.length > 1);
    lastFactIndex = factIndex;
    
    const factDiv = document.createElement('div');
    factDiv.className = 'cat-fact';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'cat-fact-header';
    headerDiv.textContent = '🐾 Cat Fact 🐾';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'cat-fact-text';
    textDiv.textContent = catFacts[factIndex];
    
    factDiv.appendChild(headerDiv);
    factDiv.appendChild(textDiv);
    messagesContainer.appendChild(factDiv);
    
    scrollToBottom();
}

// Get random trigger for next cat fact (3-5 messages)
function getRandomFactTrigger() {
    return Math.floor(Math.random() * 3) + 3; // 3-5
}

// Get current timestamp
function getCurrentTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Scroll chat to bottom
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Save chat history to localStorage
function saveChatHistory() {
    const messages = [];
    const messageElements = messagesContainer.querySelectorAll('.message, .cat-fact');
    
    messageElements.forEach(element => {
        if (element.classList.contains('cat-fact')) {
            messages.push({
                type: 'fact',
                text: element.querySelector('.cat-fact-text').textContent
            });
        } else {
            const sender = element.classList.contains('user') ? 'user' : 'catgpt';
            const text = element.querySelector('.message-text').textContent;
            const timestamp = element.querySelector('.timestamp').textContent;
            messages.push({
                type: 'message',
                sender,
                text,
                timestamp
            });
        }
    });
    
    localStorage.setItem('catgpt_history', JSON.stringify(messages));
    localStorage.setItem('catgpt_message_count', messageCount.toString());
}

// Load chat history from localStorage
function loadChatHistory() {
    const savedHistory = localStorage.getItem('catgpt_history');
    const savedCount = localStorage.getItem('catgpt_message_count');
    
    if (savedCount) {
        messageCount = parseInt(savedCount);
    }
    
    if (!savedHistory) return;
    
    try {
        const messages = JSON.parse(savedHistory);
        messages.forEach(msg => {
            if (msg.type === 'fact') {
                const factDiv = document.createElement('div');
                factDiv.className = 'cat-fact';
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'cat-fact-header';
                headerDiv.textContent = '🐾 Cat Fact 🐾';
                
                const textDiv = document.createElement('div');
                textDiv.className = 'cat-fact-text';
                textDiv.textContent = msg.text;
                
                factDiv.appendChild(headerDiv);
                factDiv.appendChild(textDiv);
                messagesContainer.appendChild(factDiv);
            } else {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender}`;
                
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'message-bubble';
                
                const textDiv = document.createElement('div');
                textDiv.className = 'message-text';
                textDiv.textContent = msg.text;
                
                const timestampDiv = document.createElement('div');
                timestampDiv.className = 'timestamp';
                timestampDiv.textContent = msg.timestamp;
                
                bubbleDiv.appendChild(textDiv);
                bubbleDiv.appendChild(timestampDiv);
                messageDiv.appendChild(bubbleDiv);
                messagesContainer.appendChild(messageDiv);
            }
        });
        scrollToBottom();
    } catch (e) {
        console.error('Error loading chat history:', e);
    }
}

// Handle clear history
function handleClearHistory() {
    const confirmed = confirm('Are you sure you want to clear all chat history? This cannot be undone!');
    if (confirmed) {
        messagesContainer.innerHTML = '';
        localStorage.removeItem('catgpt_history');
        localStorage.removeItem('catgpt_message_count');
        messageCount = 0;
        nextFactTrigger = getRandomFactTrigger();
    }
}
