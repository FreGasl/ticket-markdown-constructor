const settings = require("../../../../settings.json");
const { setRole } = require("../form/rules");

const applySettings = function () {
    const opsys = process.platform;

    document.querySelector('[name="device"]').value =
        (settings.saveValues.device) ? settings.saveValues.device
            : (opsys === "MacOS") ? "Декстоп MacOS"
                : (opsys === "win32" || opsys === "win64") ? "Декстоп Windows" : "";

    document.querySelector('[name="browser"]').value = settings.saveValues.browser || '';

    document.querySelector('[name="url"]').value = settings.saveValues.url || '';

    if (settings.saveValues.app) {
        document.querySelectorAll('[name="app"]').forEach(el => {
            el.value = settings.saveValues.app;
        });
        if (settings.saveValues.role) {
            setRole(document.querySelector('[name="app"]'));
            document.querySelectorAll('[name="role"]').forEach(el => {
                el.value = settings.saveValues.role;
            });
        }
    }

}

module.exports = { applySettings }