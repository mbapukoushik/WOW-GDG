// --- Active Link Highlight ---
function setActiveNavLinks() {
  const path = window.location.pathname.split('/').pop();
  const isGuide = /-guide\.html$/.test(path);
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
    // Highlight 'Secure My Accounts' if on any guide page
    if (isGuide && link.getAttribute('href') === 'secure-accounts.html') {
      link.classList.add('active');
    } else if (!isGuide && link.getAttribute('href') === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
setActiveNavLinks();

// --- Animated Mobile Menu ---
function toggleMobileMenu() {
  const nav = document.getElementById('mobileNavLinks');
  if (nav.style.display === 'block') {
    nav.classList.remove('slide-down');
    nav.style.display = 'none';
  } else {
    nav.style.display = 'block';
    nav.classList.add('slide-down');
  }
}
window.toggleMobileMenu = toggleMobileMenu;

// --- Platform Guide Navigation ---
function openGuide(platform) {
  // Navigate to platform-specific guide pages
  switch(platform) {
    case 'instagram':
      window.location.href = 'instagram-guide.html';
      break;
    case 'snapchat':
      window.location.href = 'snapchat-guide.html';
      break;
    case 'telegram':
      window.location.href = 'telegram-guide.html';
      break;
    case 'gmail':
      window.location.href = 'gmail-guide.html';
      break;
    case 'google':
      window.location.href = 'google-account-guide.html';
      break;
    case 'linkedin':
      window.location.href = 'linkedin-guide.html';
      break;
    default:
      showToast(`Opening ${platform} security guide...`, 'success');
  }
}
window.openGuide = openGuide;

// --- Platform Filtering ---
function initializePlatformFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const platformItems = document.querySelectorAll('.platform-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const category = button.getAttribute('data-category');
      
      platformItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// --- Toast Notification ---
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
window.showToast = showToast;

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

// --- Initialize platform filters when DOM is loaded ---
document.addEventListener('DOMContentLoaded', function() {
  initializePlatformFilters();
});

// --- Guide & Video Functions ---
function changeSpeed(speed) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = speed;
  }
  document.querySelectorAll('.video-speed').forEach(btn => {
    btn.classList.remove('active');
  });
  if (event && event.target) event.target.classList.add('active');
}
window.changeSpeed = changeSpeed;

function markAsComplete() {
  showToast('✅ Guide marked as complete! Your account is now more secure.', 'success');
}
window.markAsComplete = markAsComplete;

function downloadChecklist() {
  showToast('📋 Downloading security checklist...','success');
}
window.downloadChecklist = downloadChecklist;

function shareGuide() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      text: 'Learn how to secure your account step by step',
      url: window.location.href
    });
  } else {
    showToast('📤 Share this guide with friends and family!','success');
  }
}
window.shareGuide = shareGuide;

function showFullScreenshot(imageName) {
  showToast('🔍 Opening full screenshot...','success');
}
window.showFullScreenshot = showFullScreenshot;

// --- Security Tools Functions ---
function passwordStrengthMeter(password) {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 16) score++;
  if (score >= 5) return {text: 'Strong', color: '#10b981'};
  if (score >= 3) return {text: 'Medium', color: '#f59e42'};
  return {text: 'Weak', color: '#ef4444'};
}
window.passwordStrengthMeter = passwordStrengthMeter;

function updateStrengthMeter(password) {
  const meter = document.getElementById('passwordStrength');
  if (!meter) return;
  if (!password) { meter.style.display = 'none'; return; }
  const result = passwordStrengthMeter(password);
  meter.textContent = `Strength: ${result.text}`;
  meter.style.color = result.color;
  meter.style.display = 'inline-block';
}
window.updateStrengthMeter = updateStrengthMeter;

function generatePassword() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=~";
  let password = "";
  for (let i = 0; i < 16; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  const passEl = document.getElementById('generatedPassword');
  const copyBtn = document.getElementById('copyPasswordBtn');
  if (passEl) {
    passEl.textContent = password;
    passEl.style.display = 'inline-block';
  }
  if (copyBtn) copyBtn.style.display = 'inline-block';
  updateStrengthMeter(password);
}
window.generatePassword = generatePassword;

function copyPassword() {
  const pass = document.getElementById('generatedPassword')?.textContent;
  if (!pass) return;
  navigator.clipboard.writeText(pass).then(() => {
    const copyBtn = document.getElementById('copyPasswordBtn');
    if (copyBtn) {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1200);
    }
    showToast('Password copied!', 'success');
  });
}
window.copyPassword = copyPassword;

function checkPhishing() {
  const input = document.getElementById('phishingInput')?.value.trim();
  const resultDiv = document.getElementById('phishingResult');
  if (!resultDiv) return;
  if (!input) {
    resultDiv.textContent = 'Please paste a link or email.';
    resultDiv.style.color = '#ef4444';
    return;
  }
  if (/https?:\/\//.test(input)) {
    if (/\.ru|\.cn|bit\.ly|free|login|verify|account|security|update|reset|suspicious|phish|bank|paypal|apple|google|facebook|instagram|whatsapp|telegram|snapchat/i.test(input)) {
      resultDiv.textContent = '⚠️ This link looks suspicious. Do NOT click it!';
      resultDiv.style.color = '#ef4444';
    } else {
      resultDiv.textContent = 'No obvious signs of phishing, but always be cautious with links.';
      resultDiv.style.color = '#f59e42';
    }
  } else if (/@/.test(input)) {
    if (/support|help|security|account|verify|reset|update|admin|noreply|no-reply|service|alert|bank|paypal|apple|google|facebook|instagram|whatsapp|telegram|snapchat/i.test(input)) {
      resultDiv.textContent = '⚠️ This email address could be used for phishing. Double-check the sender!';
      resultDiv.style.color = '#ef4444';
    } else {
      resultDiv.textContent = 'No obvious signs of phishing, but always be cautious with emails.';
      resultDiv.style.color = '#f59e42';
    }
  } else {
    resultDiv.textContent = 'Please enter a valid link or email.';
    resultDiv.style.color = '#ef4444';
  }
}
window.checkPhishing = checkPhishing;

// --- Hacked Page & Emergency Functions ---
function startEmergencyChecklist() {
  document.querySelector('.emergency-checklist')?.scrollIntoView({ behavior: 'smooth' });
}
window.startEmergencyChecklist = startEmergencyChecklist;

function openAIAssistant() {
  window.location.href = 'ai-assistant.html';
}
window.openAIAssistant = openAIAssistant;

function showPasswordGuide() {
  showToast('Password Guide: Use a password manager, make passwords 12+ characters, include numbers and symbols', 'success');
}
window.showPasswordGuide = showPasswordGuide;

function show2FAGuide() {
  showToast('2FA Guide: Go to account settings > Security > Two-Factor Authentication > Enable', 'success');
}
window.show2FAGuide = show2FAGuide;

function showActivityGuide() {
  showToast('Activity Guide: Check recent logins, review account activity, look for unknown devices', 'success');
}
window.showActivityGuide = showActivityGuide;

function showBankingGuide() {
  showToast('Banking Guide: Call your bank immediately, freeze cards, monitor transactions', 'success');
}
window.showBankingGuide = showBankingGuide;

function showReportingGuide() {
  showToast('Reporting Guide: Use platform\'s "Report Hacked Account" feature or contact support', 'success');
}
window.showReportingGuide = showReportingGuide;

function openRecoveryGuide(platform) {
  showToast(`Opening ${platform} recovery guide...`, 'success');
}
window.openRecoveryGuide = openRecoveryGuide;

function showResources() {
  showToast('Additional Resources: FTC Identity Theft, local cybercrime units, credit monitoring services', 'success');
}
window.showResources = showResources;

function updateProgress() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
  const total = checkboxes.length;
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  if (!progressFill || !progressText) return;
  const percentage = (completed / total) * 100;
  progressFill.style.width = percentage + '%';
  progressText.textContent = `${completed}/${total}`;
  if (completed === total) {
    setTimeout(() => {
      showToast('🎉 Great job! You\'ve completed all immediate actions. Your accounts are much safer now.', 'success');
    }, 500);
  }
}
window.updateProgress = updateProgress;

// --- AI Assistant Chat Logic ---
const API_KEY = "AIzaSyAyzJNVti_0XNrHJhGHjCtqDHaFhEDX6yo"; // Replace with your Gemini API key

async function callGeminiAPI(userMessage) {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    throw new Error("Please ensure your Gemini API key is correctly set in the code.");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: createSecurityPrompt(userMessage) }]
      }]
    })
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "An unknown error occurred with the AI response.");
  }
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
    throw new Error("Could not parse AI response: Unexpected data structure.");
  }
  return data.candidates[0].content.parts[0].text;
}
window.callGeminiAPI = callGeminiAPI;

function createSecurityPrompt(userMessage) {
  return `You are a calm, step-by-step cybersecurity expert helping someone who might be hacked or needs to secure their account. \n\nGive only ONE clear, simple step at a time. After each step, ask the user what they see or if it worked, and wait for their reply before giving the next step. If the user is stuck, offer alternatives or ask for more details. Use simple language and emojis where helpful. \n\nUser message: ${userMessage}\n\nRespond with just the next step and a follow-up question.`;
}
window.createSecurityPrompt = createSecurityPrompt;

function addMessageToChat(message, sender) {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.innerHTML = message.replace(/\n/g, '<br>');
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
window.addMessageToChat = addMessageToChat;

let typingIndicator = null;
function showTypingIndicator() {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  typingIndicator = document.createElement('div');
  typingIndicator.classList.add('message', 'bot', 'typing-indicator');
  typingIndicator.textContent = "AI is typing... 🤖";
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}
window.showTypingIndicator = showTypingIndicator;

function removeTypingIndicator() {
  if (typingIndicator) {
    typingIndicator.remove();
    typingIndicator = null;
  }
}
window.removeTypingIndicator = removeTypingIndicator;

async function sendMessage() {
  const userInputField = document.getElementById('userInput');
  if (!userInputField) return;
  const userMessage = userInputField.value.trim();
  if (!userMessage) return;
  addMessageToChat(userMessage, 'user');
  userInputField.value = '';
  userInputField.disabled = true;
  const sendBtn = document.getElementById('sendButton');
  if (sendBtn) sendBtn.disabled = true;
  showTypingIndicator();
  try {
    const aiResponse = await callGeminiAPI(userMessage);
    removeTypingIndicator();
    addMessageToChat(aiResponse, 'bot');
  } catch (error) {
    removeTypingIndicator();
    addMessageToChat("I'm having trouble right now. Please try again later, or consider changing your password on affected accounts as a first step! 🚨", 'bot');
  } finally {
    userInputField.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    userInputField.focus();
  }
}
window.sendMessage = sendMessage;

function resetChat() {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  chatBox.innerHTML = '';
  addMessageToChat("Hello! 👋 I'm your AI cybersecurity assistant. How can I help you today?", 'bot');
  const userInput = document.getElementById('userInput');
  if (userInput) {
    userInput.value = '';
    userInput.focus();
  }
}
window.resetChat = resetChat;

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('chatBox')) {
    resetChat();
  }
});

function quickAsk(question) {
  const userInputField = document.getElementById('userInput');
  if (userInputField) {
    userInputField.value = question;
    sendMessage();
  }
}
window.quickAsk = quickAsk; 