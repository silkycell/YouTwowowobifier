const settingsMap = new Map([
    ["isEnabled", document.getElementById('checkbox_enabled')],
    ["preservesPitch", document.getElementById('checkbox_pitch')],
    ["speed", document.getElementById('number_speed')],
    ["amplitude", document.getElementById('number_amplitude')],
    ["offset", document.getElementById('number_offset')],
    ["updateRate", document.getElementById('number_updateRate')]
]);

settingsMap.forEach((object) => {
    object.addEventListener("change", sendSettingsData);
})

document.getElementById('button_reset').addEventListener("click", resetSettings)

function getSettings() {
    var settings = {}

    settingsMap.forEach((object, key) => {
        switch (object.type) {
            case "checkbox":
                settings[key] = object.checked
                break
            case "number":
                settings[key] = parseFloat(object.value)
                break
        }
    })

    return settings
}

function loadSettings(settings) {
    Object.keys(settings).forEach(function (key) {
        if (settingsMap.has(key)) {
            var object = settingsMap.get(key)
            switch (object.type) {
                case "checkbox":
                    object.checked = settings[key]
                    break
                case "number":
                    object.value = settings[key]
                    break
            }
        }
    });
}

function resetSettings() {
    chrome.runtime.sendMessage({ event: "resetSettings" }, loadSettings);
}

function sendSettingsData() {
    chrome.runtime.sendMessage({ event: "updateSettingsData", settings: getSettings() })
}

chrome.storage.local.get().then(loadSettings)