let settings = {
    isEnabled: false,
    preservesPitch: false,
    speed: 10,
    amplitude: 0.5,
    offset: 1,
    updateRate: 10
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

function updatePlaybackRate() {
    if (!settings.isEnabled) return

    var currentTime = Date.now()
    
    var amplitude = clamp(settings.amplitude, 0, 7.95)
    var sineValue = (Math.sin((currentTime / 1000) * settings.speed) * amplitude) + amplitude + settings.offset + 0.1
    sineValue = clamp(sineValue, 0.1, 16)

    document.querySelectorAll('video').forEach(function (video) {
        if (video.paused) return
        video.playbackRate = sineValue
        video.preservesPitch = settings.preservesPitch
    });
}

let updateIntervalID = setInterval(updatePlaybackRate, settings.updateRate)

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.event === "onSettingsChanged")
            chrome.storage.local.get().then(loadSettings)
    });

let lastSettings = settings
function loadSettings(newSettings) {
    settings = newSettings

    if (settings.isEnabled == false && settings.isEnabled != lastSettings.isEnabled) {
        document.querySelectorAll('video').forEach(function (video) {
            video.playbackRate = 1
            video.preservesPitch = true
        });
    }

    if (settings.updateRate != lastSettings.updateRate) {
        clearInterval(updateIntervalID);
        updateIntervalID = setInterval(updatePlaybackRate, settings.updateRate)
    }
    
    lastSettings = settings
}

chrome.storage.local.get().then(loadSettings)