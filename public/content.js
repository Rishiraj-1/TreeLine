// Content script to detect AI chatting inputs/outputs

// Helper to estimate tokens (rough estimate: ~1.3 tokens per word)
function estimateTokens(text) {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return Math.ceil(words.length * 1.3);
}

// Function to calculate carbon footprint in grams of CO2
// Same logic as in PromptPrint main app
function calculateCO2(tokens, isInput, platform) {
    // Rough estimates depending on platform
    let whPer1k = 0;
    let priceIn = 0;

    if (platform === 'ChatGPT') whPer1k = 0.0045; // GPT-4 Turbo approx
    else if (platform === 'Claude') whPer1k = 0.0035; // Sonnet approx
    else if (platform === 'Gemini') whPer1k = 0.0030; // Gemini Pro approx
    else whPer1k = 0.004;

    const CO2_PER_WH = 0.386;
    const energy = (tokens / 1000) * whPer1k;
    return energy * CO2_PER_WH;
}

// Create a UI element to show the results directly
let resultBubble = null;
function showResultBubble(tokens, co2, platform) {
    if (!resultBubble) {
        resultBubble = document.createElement('div');
        resultBubble.style.position = 'fixed';
        resultBubble.style.bottom = '20px';
        resultBubble.style.right = '20px';
        resultBubble.style.backgroundColor = '#1e293b';
        resultBubble.style.color = '#fff';
        resultBubble.style.padding = '12px 16px';
        resultBubble.style.borderRadius = '8px';
        resultBubble.style.fontFamily = 'Inter, sans-serif';
        resultBubble.style.fontSize = '14px';
        resultBubble.style.zIndex = '999999';
        resultBubble.style.display = 'flex';
        resultBubble.style.alignItems = 'center';
        resultBubble.style.gap = '8px';
        resultBubble.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        resultBubble.style.transition = 'opacity 0.3s';
        document.body.appendChild(resultBubble);
    }

    resultBubble.innerHTML = `
        <span style="font-size: 18px">🌱</span>
        <div>
            <div style="font-weight: 600">${platform} Usage</div>
            <div style="color: #94a3b8; font-size: 12px">${tokens} tokens • ${co2.toFixed(4)}g CO₂</div>
        </div>
    `;

    resultBubble.style.opacity = '1';

    // Auto hide after 5 seconds
    setTimeout(() => {
        resultBubble.style.opacity = '0';
    }, 5000);
}

function sendTokensToBackground(text, isUser) {
    const tokens = estimateTokens(text);
    if (tokens === 0) return;

    let platform = "Unknown";
    const hostname = window.location.hostname;

    if (hostname.includes('chatgpt.com')) platform = "ChatGPT";
    else if (hostname.includes('claude.ai')) platform = "Claude";
    else if (hostname.includes('gemini.google.com')) platform = "Gemini";

    chrome.runtime.sendMessage({
        type: 'NEW_TOKENS',
        data: { text, tokens, isUser, platform }
    }, (response) => {
        if (response && response.success) {
            const co2 = calculateCO2(tokens, isUser, platform);
            showResultBubble(tokens, co2, platform);
        }
    });
}

// Detect chat interactions

// 1. ChatGPT
if (window.location.hostname.includes('chatgpt.com')) {
    // Intercept Enter key on prompts textarea
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const el = e.target;
            // check if it's the prompt input
            if (el.tagName === 'TEXTAREA' || el.contentEditable === 'true') {
                const text = el.value || el.innerText;
                if (text && text.trim().length > 0) {
                    sendTokensToBackground(text, true);
                }
            }
        }
    }, true);

    // Intercept submit button click
    document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-testid="send-button"]');
        if (button) {
            const input = document.querySelector('#prompt-textarea') || document.querySelector('p');
            if (input) {
                const text = input.innerText || input.value;
                if (text && text.trim().length > 0) {
                    sendTokensToBackground(text, true);
                }
            }
        }
    }, true);
}

// 2. Claude AI
if (window.location.hostname.includes('claude.ai')) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const el = e.target;
            if (el.contentEditable === 'true' || el.tagName === 'TEXTAREA') {
                const text = el.innerText || el.value;
                if (text && text.trim().length > 0) {
                    sendTokensToBackground(text, true);
                }
            }
        }
    }, true);
}

// 3. Gemini
if (window.location.hostname.includes('gemini.google.com')) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const el = e.target;
            if (el.role === 'combobox' || el.contentEditable === 'true') {
                const text = el.innerText || el.value || el.textContent;
                if (text && text.trim().length > 0) {
                    sendTokensToBackground(text, true);
                }
            }
        }
    }, true);
}

// Basic observe newly added AI messages (very generic)
let lastObservedNodes = new Set();
const observer = new MutationObserver((mutations) => {
    // Add logic here to capture AI response lengths if needed.
    // For now we rely on prompt inputs for simplicity, but we could find AI text blobs over time.
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for requests from the popup to get the current input
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_CURRENT_INPUT') {
        let text = '';
        const hostname = window.location.hostname;

        try {
            if (hostname.includes('chatgpt.com')) {
                // ChatGPT uses a ProseMirror editor embedded in a div
                const el = document.querySelector('#prompt-textarea') || document.querySelector('.ProseMirror') || document.querySelector('p[data-placeholder="Message ChatGPT"]');
                if (el) text = el.innerText || el.value || el.textContent || '';
            } else if (hostname.includes('claude.ai')) {
                const el = document.querySelector('div[contenteditable="true"]') || document.activeElement;
                if (el) text = el.innerText || el.value || el.textContent || '';
            } else if (hostname.includes('gemini.google.com')) {
                const el = document.querySelector('.ql-editor') || document.querySelector('div[contenteditable="true"], textarea') || document.activeElement;
                if (el) text = el.innerText || el.value || el.textContent || '';
            }
        } catch (e) {
            console.error("Error extracting text", e);
        }

        // Clean up text
        if (text === '\n') text = '';

        sendResponse({ text: text });
    }
    return true; // Keep port open
});

console.log('AI Token Tracker Content Script loaded');

