let settings = {
    isEnabled: false,
    preservesPitch: false,
    speed: 10,
    amplitude: 0.5,
    offset: 1,
    updateRate: 10
}

runForAllTabs((tab) => chrome.tabs.reload(tab.id))

chrome.storage.local.get().then((savedSettings) => {
    if (savedSettings.isEnabled !== undefined) settings.isEnabled = savedSettings.isEnabled
    if (savedSettings.preservesPitch !== undefined) settings.preservesPitch = savedSettings.preservesPitch

    if (savedSettings.speed !== undefined) settings.speed = savedSettings.speed
    if (savedSettings.amplitude !== undefined) settings.amplitude = savedSettings.amplitude
    if (savedSettings.offset !== undefined) settings.offset = savedSettings.offset

    if (savedSettings.updateRate !== undefined) settings.updateRate = savedSettings.updateRate

    chrome.storage.local.set(settings)
})

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.event === "settingData") {
            settings = request.settings

            settingsUpdated()
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