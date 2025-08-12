const rules = require("../../../json/rulesRoles.json");

const setRules = async function () {
    const selectApp = document.querySelector('[name="app"]');
    Object.keys(rules).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        selectApp.appendChild(option)
    });
    setRole(selectApp);

    document.querySelectorAll('[name="app"]').forEach(el => {
        el.onchange = function() {
            setRole(selectApp);
        }
    })
}

function setRole(selectApp) {
    document.querySelectorAll('[name="role"] option').forEach((el) => {
        if (el.value !== 'Любая') {
            el.remove();
        }
    });

    if (rules[selectApp.value]) {
        rules[selectApp.value].forEach(role => {
            document.querySelectorAll('[name="role"]').forEach(el => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                option.class = 'dependent';
                el.appendChild(option);
            });
        });
    }
}

module.exports = { setRules, setRole }