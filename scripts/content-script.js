let settings = undefined
let updateIntervalID = undefined

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

let lastSettings = settings
function loadSettings(newSettings) {
    settings = newSettings

    if (lastSettings != undefined && (settings.isEnabled == false && settings.isEnabled != lastSettings.isEnabled)) {
        document.querySelectorAll('video').forEach(function (video) {
            video.playbackRate = 1
            video.preservesPitch = true
        });
    }

    if (lastSettings == undefined || settings.updateRate != lastSettings.updateRate) {
        clearInterval(updateIntervalID);
        updateIntervalID = setInterval(updatePlaybackRate, settings.updateRate)
    }

    lastSettings = settings
}

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.event === "onSettingsChanged")
            chrome.storage.local.get().then(loadSettings)
    }
);

chrome.storage.local.get().then(loadSettings)