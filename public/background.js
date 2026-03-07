// Background script for AI Token Tracker
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Token Tracker installed.');
    // Initialize storage
    chrome.storage.local.get(['totalTokens', 'history'], (result) => {
        if (!result.totalTokens) chrome.storage.local.set({ totalTokens: 0 });
        if (!result.history) chrome.storage.local.set({ history: [] });
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'NEW_TOKENS') {
        const { platform, text, tokens, isUser } = request.data;
        console.log(`Received tokens from ${platform}:`, tokens);

        chrome.storage.local.get(['totalTokens', 'history'], (result) => {
            const newTotal = (result.totalTokens || 0) + tokens;
            const historyItems = result.history || [];

            const newEntry = {
                platform,
                textPreview: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                tokens,
                isUser,
                timestamp: Date.now()
            };

            historyItems.unshift(newEntry);
            // Keep last 100 items
            if (historyItems.length > 100) historyItems.pop();

            chrome.storage.local.set({
                totalTokens: newTotal,
                history: historyItems
            });

            sendResponse({ success: true, newTotal });
        });
        return true; // Keep message port open for async
    }
});
