const { Form } = require('../../../src/form');

const createForm = function () {
    const alert = document.querySelector('.alert');
    document.querySelectorAll('[name="refresh"]').forEach(el => {
        el.addEventListener('click', function () {
            window.location.reload();
        });
    });
    document.querySelector('[aria-label="Close alert"]').addEventListener('click', function () {
        alert.classList.add('hidden');
    });

    const validateJSON = function (text) {
        try {
            return JSON.stringify(JSON.parse(text), undefined, 2)
        } catch (e) {
            return text
        }
    }

    const contactInfoFormCallback = (form, val) => {
        return new Promise( async (resolve) => {
            const withEmoji = val['emoji'];
            const res = `|||
|:-------|:-------|
|**${(withEmoji) ? '📱 ' : ''}Приложение**|${val['app']}|
|**${(withEmoji) ? '🚀 ' : ''}Стенд**|[${val['stand']}]${(val['url'] === '') ? '' : '('+val['url']+')'}|
|**${(withEmoji) ? '👤 ' : ''}Роль пользователя**|${val['role']}|
|**${(withEmoji) ? '🌐 ' : ''}Браузер**|${val['browser']}|
|**${(withEmoji) ? '🖥️ ' : ''}Устройство**|${val['device']}|

**${(withEmoji) ? '📝 ' : ''}Описание:** ${val['description']}\n
**${(withEmoji) ? '🔍 ' : ''}Шаги воспроизведения:**\n${val['stepstiket']}
${(val['stepstiket-2'].trim() !== '') ? `\n**${(withEmoji) ? '🔍 ' : ''}Шаги воспроизведения №2:**\n${val['stepstiket-2']}\n` : ''}
**${(withEmoji) ? '❌ ' : ''}Актуальный результат:** ${val['actualres']}
**${(withEmoji) ? '✅ ' : ''}Ожидаемый результат:**  ${val['expectres']}
${val['note'] === '' ? '' : '\n' +
                '---\n' +
                '\n' +
                `**${(withEmoji) ? '📃 ' : ''}Примечание:** ${val['note']}`}`;
            await navigator.clipboard.writeText(res);
            const rndText = ['Я в тебя верю!', 'Тикет выглядит прекрасно!', 'Всегда рад помочь!', 'Важная задача будет красиво оформлена!', 'Теперь бегом вставляй в YouTrack!'];
            const rand = Math.floor(Math.random() * rndText.length);
            alert.querySelector('p').innerText = rndText[rand];
            alert.querySelector('.alert-heading').innerText = 'Скопировано';
            alert.classList.remove('hidden');
            setTimeout(() => alert.classList.add('hidden'), 2000);
            resolve(true);
        });
    }

    const apiInfoFormCallback = (form, val) => {
        return new Promise( async (resolve) => {
            let res = '';
            res += `**URL запроса:** ${'`'}${val['method']} ${val['urlRequest']}${'`'}\n**Статус:** ${val['request-status']}\n`;
            res += (val['request-time'].trim() !== '') ? `**Время запроса:** ${val['request-time']}\n` : '';
            res += (val['bodyRequest'].trim() !== '') ? '**Тело запроса:**\n```\n' + validateJSON(val['bodyRequest']) + '\n```\n' : '';
            res += (val['bodyResponse'].trim() !== '') ? '**Тело ответа:**\n```\n' + validateJSON(val['bodyResponse']) + '\n```\n' : '';
            res += (val['timelog'].trim() !== '') ? `**Время в логах:** ${val['request-status']}\n` : '';
            res += (val['note'] === '') ? '' : '\n---\n\n' + `**Примечание:** ${val['note']}`;
            await navigator.clipboard.writeText(res);
            const rndText = ['Я в тебя верю!', 'Тикет выглядит прерасно!', 'Всегда рад помочь!', 'Важная задача будет красиво оформлена!', 'Теперь бегом вставляй в YouTrack!'];
            const rand = Math.floor(Math.random() * rndText.length);
            alert.querySelector('p').innerText = rndText[rand];
            alert.querySelector('.alert-heading').innerText = 'Скопировано';
            alert.classList.remove('hidden');
            setTimeout(() => alert.classList.add('hidden'), 2000);
            resolve(true);
        });
    }

    const jiraInfoFormCallback = (form, val) => {
        return new Promise( async (resolve) => {
            let res = `${val['ticketInfo']}\n**Описание запроса:**\n${val['bodyTicket']}`;
            if (val['id_crm'] && val['login_crm']) {
                res += `\n**Учетную запись создал через панель администрирования:**\n\n|ID|Логин|\n|:-------|:-------|\n|${val['id_crm']}|${val['login_crm']}|`
            }
            if (val['my_comment']) res += `\n---\n\n${val['my_comment']}`;
            await navigator.clipboard.writeText(res);
            const rndText = ['Я в тебя верю!', 'Тикет выглядит прерасно!', 'Всегда рад помочь!', 'Важная задача будет красиво оформлена!', 'Теперь бегом вставляй в YouTrack!'];
            const rand = Math.floor(Math.random() * rndText.length);
            alert.querySelector('p').innerText = rndText[rand];
            alert.querySelector('.alert-heading').innerText = 'Скопировано';
            alert.classList.remove('hidden');
            setTimeout(() => alert.classList.add('hidden'), 2000);
            resolve(true);
        });
    }

    const contactInfoChangeTabCallback = () => {
        return new Promise(async (resolve) => {
            resolve(true);
        });
    }

    const contactInfoForm = document.querySelector('#contact-info');
    new Form(contactInfoForm, contactInfoFormCallback, contactInfoChangeTabCallback);
    const apiInfoForm = document.querySelector('#api-info');
    new Form(apiInfoForm, apiInfoFormCallback, contactInfoChangeTabCallback);
    const jiraInfoForm = document.querySelector('#jira-info');
    new Form(jiraInfoForm, jiraInfoFormCallback, contactInfoChangeTabCallback);
}

module.exports = { createForm }