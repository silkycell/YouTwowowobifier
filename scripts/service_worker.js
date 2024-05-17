const defaultSettings = {
    isEnabled: false,
    preservesPitch: false,
    speed: 10,
    amplitude: 0.5,
    offset: 1,
    updateRate: 10
}

let settings = defaultSettings

runForAllTabs((tab) => chrome.tabs.reload(tab.id))

chrome.storage.local.get().then((savedSettings) => {
    Object.keys(savedSettings).forEach(function(key) {
        settings[key] = savedSettings[key]
    });

    chrome.storage.local.set(settings)
})

chrome.runtime.onMessage.addListener(
    function (request, _sender, sendResponse) {
        switch (request.event) {
            case "updateSettingsData":
                settings = request.settings
                settingsUpdated()
                break;
            case "resetSettings":
                settings = defaultSettings
                settingsUpdated()
                sendResponse(settings)
                break;
        }
    }
)

function settingsUpdated() {
    chrome.storage.local.set(settings)
    runForAllTabs((tab) => chrome.tabs.sendMessage(tab.id, { event: "onSettingsChanged" }))
}

function runForAllTabs(func) {
    if (func === 0) return;
    
    chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
        for (var i = 0; i < tabs.length; i++)
            func(tabs[i])
    })
}