const versionNumber = document.getElementById('version_number')

const enabledCheckbox = document.getElementById('checkbox_enabled')
const pitchCheckbox = document.getElementById('checkbox_pitch')

const speedNumber = document.getElementById('number_speed')
const amplitudeNumber = document.getElementById('number_amplitude')
const offsetNumber = document.getElementById('number_offset')

const updateRateNumber = document.getElementById('number_updateRate')

enabledCheckbox.addEventListener("click", sendSettingData);
pitchCheckbox.addEventListener("click", sendSettingData);

speedNumber.addEventListener("change", sendSettingData);
amplitudeNumber.addEventListener("change", sendSettingData);
offsetNumber.addEventListener("change", sendSettingData);

updateRateNumber.addEventListener("change", sendSettingData);

function sendSettingData() {
    chrome.runtime.sendMessage({ event: "settingData", settings: getSettings() })
}

function getSettings() {
    return {
        isEnabled: enabledCheckbox.checked,
        preservesPitch: pitchCheckbox.checked,
        speed: parseFloat(speedNumber.value),
        amplitude: parseFloat(amplitudeNumber.value),
        offset: parseFloat(offsetNumber.value),
        updateRate: parseFloat(updateRateNumber.value)
    }
}

chrome.storage.local.get().then((savedSettings) => {
    if (savedSettings.isEnabled !== undefined) enabledCheckbox.checked = savedSettings.isEnabled
    if (savedSettings.preservesPitch !== undefined) pitchCheckbox.checked = savedSettings.preservesPitch

    if (savedSettings.speed !== undefined) speedNumber.value = savedSettings.speed
    if (savedSettings.amplitude !== undefined) amplitudeNumber.value = savedSettings.amplitude
    if (savedSettings.offset !== undefined) offsetNumber.value = savedSettings.offset

    if (savedSettings.updateRate !== undefined) updateRateNumber.value = savedSettings.updateRate
})

// non setting stuff

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});

versionNumber.innerText = "v" + chrome.runtime.getManifest().version