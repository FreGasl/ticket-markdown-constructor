const settings = require("../../settings.json");
const jiraSettings = require("../json/jiraSettings.json");
const fs = require("node:fs");
const path = require("node:path");
const cmd = require("../../dev-functions/cmd");
const { settingsRole } = require("./function/setting/role");
const { ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {
    const currentFilePath = document.location.pathname;
    if (currentFilePath.includes('roles')) {
        settingsRole()
    } else if (currentFilePath.includes('jira')) {
        const saveButton = document.getElementById('save-jira');
        document.getElementById('host').value = jiraSettings.host || '';
        document.getElementById('username').value = jiraSettings.username || '';
        document.getElementById('password').value = jiraSettings.password || '';
        saveButton.addEventListener('click', function () {
            const jiraInfo = {
                "host": document.getElementById('host').value,
                "username": document.getElementById('username').value,
                "password": document.getElementById('password').value
            }
            fs.writeFile(path.join(__dirname, '../json/jiraSettings.json'), JSON.stringify(jiraInfo), function (err) {
                if (err) {
                    alert("An error ocurred updating the file"+ err.message);
                } else {
                    ipcRenderer.send('update-page');
                    saveButton.textContent = 'Сохранено';
                    saveButton.style.color = '#37d67a';
                    document.getElementById('save-count').textContent = `Сохранённые значения (0)`;
                    setTimeout(() => {
                        saveButton.textContent = 'Сохранить';
                        saveButton.style.color = '#EF8354';
                    }, 500);
                }
            });
        });
    } else {
        const sizeScreen = document.querySelector(".sizeScreen");
        const deleteSaveValue = document.querySelector('.deleteSavedValue');
        let countSavedValues = Object.values(settings.saveValues).filter(el => el?.length > 0).length;
        document.getElementById('save-count').textContent = `Сохранённые значения (${countSavedValues})`;

        sizeScreen.textContent = settings.screenSize || 'Маленький';
        sizeScreen.addEventListener('click', function (){
            if (sizeScreen.textContent === "Маленький") sizeScreen.textContent = "На весь экран";
            else sizeScreen.textContent = 'Маленький';
            cmd.run('git update-index --skip-worktree testtools/settings.json');
            settings.screenSize = sizeScreen.textContent;
            fs.writeFile(path.join(__dirname, '../../settings.json'), JSON.stringify(settings), function (err) {
                if(err){
                    alert("An error ocurred updating the file"+ err.message);
                }
            });
        });

        deleteSaveValue.addEventListener('click', function () {
            settings.saveValues = {"browser":"","device":""};
            fs.writeFile(path.join(__dirname, '../../settings.json'), JSON.stringify(settings), function (err) {
                if (err){
                    alert("An error ocurred updating the file"+ err.message);
                } else {
                    deleteSaveValue.textContent = 'Очищено';
                    deleteSaveValue.style.color = '#37d67a';
                    document.getElementById('save-count').textContent = `Сохранённые значения (0)`;
                    setTimeout(() => {
                        deleteSaveValue.textContent = 'Очистить';
                        deleteSaveValue.style.color = '#EF8354';
                    }, 500);
                }
            });
        });
    }
});
