const ipc = window.require('electron').ipcRenderer;
const { setRules } = require("./function/form/rules");
const { setTextarea, addSecondTextarea} = require("./function/form/textarea");
const { applySettings } = require("./function/setting/applySettings");
const { createForm } = require("./function/form/createForm");
const { getTicketJira } = require("./function/form/jira");
const { selectForm } = require("./function/form/selectForm");
const { saveE2EForm } = require("./function/form/saveE2Eform");

window.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('#settings').addEventListener('click', function () {
        ipc.send('openSettingsWindow');
    });
    createForm();
    await setRules();
    setTextarea();
    addSecondTextarea();
    applySettings();
    saveE2EForm();
    const mutationStep = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (![...mutation.target['classList']].includes('active')) {
                document.querySelector('[name="save"]').classList.add('hidden');
            } else {
                document.querySelector('[name="save"]').classList.remove('hidden');
            }
        });
    });
    mutationStep.observe(document.querySelector('.step-0'), {
        attributes: true,
        attributeOldValue: true,
    });
    selectForm();
    getTicketJira();
})
