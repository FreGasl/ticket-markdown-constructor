const cmd = require("../../../../dev-functions/cmd");
const settings = require("../../../../settings.json");
const fs = require("fs");
const path = require("node:path");

const saveE2EForm = function () {
    document.querySelector('[name="save"]').addEventListener('click', function () {

        const notification = document.querySelector('.alert');

        cmd.run('git update-index --skip-worktree testtools/settings.json');
        settings.saveValues.browser = document.querySelector('[name="browser"]').value;
        settings.saveValues.device = document.querySelector('[name="device"]').value;
        settings.saveValues.app = document.querySelector('[name="app"] option:checked').value;
        settings.saveValues.role = document.querySelector('[name="role"] option:checked').value;
        settings.saveValues.url = document.querySelector('[name="url"]').value;
        fs.writeFile(path.join(__dirname, '../../settings.json'), JSON.stringify(settings), function (err) {
            if(err){
                alert("An error ocurred updating the file"+ err.message);
            }
        });
        notification.querySelector('p').innerText = 'При следующем заполнении формы значения автоматически подставятся ^^';
        notification.querySelector('.alert-heading').innerText = 'Сохранено';
        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.add('hidden'), 2000)
    });
}

module.exports = { saveE2EForm }