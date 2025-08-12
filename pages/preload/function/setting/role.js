const fs = require("fs");
const path = require("node:path");
const rules = require("../../../json/rulesRoles.json");
const { ipcRenderer } = require('electron');

const settingsRole = function () {
    // Текущее состояние данных
    let appData = { ...rules };

    // DOM элементы
    const systemsContainer = document.getElementById('systems-container');
    const addSystemBtn = document.getElementById('add-system-btn');
    const applyBtn = document.querySelector('.apply-setting');

    // Генератор уникальных ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Функция рендеринга систем и ролей
    function renderSystems() {
        systemsContainer.innerHTML = '';

        Object.entries(appData).forEach(([systemName, roles]) => {
            const systemId = generateId();
            const systemCard = document.createElement('div');
            systemCard.className = 'system-card';
            systemCard.innerHTML = `
                    <p style="margin: 0; color: #666886">Проект</p>
                    <div class="system-header">
                        <input type="text" class="system-name" value="${systemName}"
                            placeholder="Название системы" data-system="${systemName}">
                        <div class="system-actions">
                            <button class="btn btn-danger delete-system">
                                <span class="btn-icon">🗑️</span>
                            </button>
                        </div>
                    </div>
                    <p style="margin: 0; color: #666886">Роли</p>
                    <div class="roles-container" id="roles-${systemId}"></div>
                    <button class="btn btn-primary add-role-btn">
                        + Добавить роль
                    </button>
                `;

            systemsContainer.appendChild(systemCard);

            // Рендеринг ролей для системы
            const rolesContainer = document.getElementById(`roles-${systemId}`);
            roles.forEach(role => {
                const roleItem = document.createElement('div');
                roleItem.className = 'role-item';
                roleItem.innerHTML = `
                        <input type="text" class="role-name" value="${role}"
                            placeholder="Название роли" data-role="${role}">
                        <div class="role-actions">
                            <button class="role-action-btn delete-role" title="Удалить роль">
                                ✕
                            </button>
                        </div>
                    `;
                rolesContainer.appendChild(roleItem);
            });

            // Обработчики событий для системы
            const systemInput = systemCard.querySelector('.system-name');
            const deleteSystemBtn = systemCard.querySelector('.delete-system');
            const addRoleBtn = systemCard.querySelector('.add-role-btn');

            // Изменение названия системы
            systemInput.addEventListener('change', (e) => {
                const oldName = systemInput.dataset.system;
                const newName = e.target.value.trim();

                if (newName && newName !== oldName) {
                    // Сохраняем роли под новым именем
                    appData[newName] = [...appData[oldName]];
                    // Удаляем старую запись
                    delete appData[oldName];
                    // Обновляем dataset
                    systemInput.dataset.system = newName;
                }
            });

            // Удаление системы
            deleteSystemBtn.addEventListener('click', () => {
                const systemName = systemInput.dataset.system;
                delete appData[systemName];
                renderSystems();
            });

            // Добавление новой роли
            addRoleBtn.addEventListener('click', () => {
                const systemName = systemInput.dataset.system;
                appData[systemName].push('Новая роль');
                renderSystems();
            });

            // Обработчики для ролей
            systemCard.querySelectorAll('.role-item').forEach(roleItem => {
                const roleInput = roleItem.querySelector('.role-name');
                const deleteRoleBtn = roleItem.querySelector('.delete-role');
                const originalRole = roleInput.dataset.role;

                // Изменение названия роли
                roleInput.addEventListener('change', (e) => {
                    const systemName = systemInput.dataset.system;
                    const newRole = e.target.value.trim();
                    const roleIndex = appData[systemName].indexOf(originalRole);

                    if (roleIndex !== -1 && newRole) {
                        appData[systemName][roleIndex] = newRole;
                        roleInput.dataset.role = newRole;
                    }
                });

                // Удаление роли
                deleteRoleBtn.addEventListener('click', () => {
                    const systemName = systemInput.dataset.system;
                    const roleIndex = appData[systemName].indexOf(originalRole);

                    if (roleIndex !== -1) {
                        appData[systemName].splice(roleIndex, 1);
                        renderSystems();
                    }
                });
            });
        });
    }

    // Добавление новой системы
    addSystemBtn.addEventListener('click', () => {
        const newSystemName = `Новый проект ${Object.keys(appData).length + 1}`;
        appData[newSystemName] = ['Администратор'];
        renderSystems();
    });

    // Применение изменений
    applyBtn.addEventListener('click', function () {
        // В реальном приложении здесь будет отправка данных на сервер
        function sortObjectByKey(obj) {
            const entries = Object.entries(obj);
            entries.sort();
            return Object.fromEntries(entries);
        }
        fs.writeFile(path.join(__dirname, '../../../json/rulesRoles.json'), JSON.stringify(sortObjectByKey(appData)), function (err) {
            if(err){
                alert("An error ocurred updating the file"+ err.message);
            }
        });
        ipcRenderer.send('update-page');
        const ready = this.querySelector('a');
        ready.textContent = 'Применено';
        ready.style.color = "#37d67a";
        ready.style.border = "2px solid rgb(55, 214, 122)";
        setTimeout(() => {
            ready.textContent = 'Применить';
            ready.style.color = "#ffffff";
            ready.style.border = "2px solid rgba(255,255,255,0.1)";
        }, 1000);
    });

    renderSystems();
}

module.exports = { settingsRole }