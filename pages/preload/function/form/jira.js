const JiraApi = require("jira-client");
const { Loader } = require("../../../src/loader");
const jiraSettings = require("../../../json/jiraSettings.json")

const getTicketJira = function () {
    const resMessage = document.querySelector('.result-message');

    if (!jiraSettings.host || !jiraSettings.username || !jiraSettings.password) {
        document.querySelector('.get-ticket').className += ' disabled';
        resMessage.innerHTML = "⚠️ Настройте JIRA подключение в настройках!";
        resMessage.classList.remove('hidden');
    }
    document.querySelector('.get-ticket').addEventListener('click', async function () {
        const uri = document.querySelector('#uri-jira').value;
        const loader = new Loader(this, 3);
        loader.on();

        let jira;
        try {
            jira = new JiraApi({
                protocol: 'http',
                host: jiraSettings.host,
                username: jiraSettings.username,
                password: jiraSettings.password,
                apiVersion: '2',
                strictSSL: true
            });
        } catch (e) {
            resMessage.innerHTML = "❌ Ошибка подключения. Проверьте настройку JIRA";
            resMessage.classList.remove('hidden');
            loader.off();
            return;
        }

        const match = uri.match(/\/([A-Z]+-\d+)$/);
        const result = match ? match[1] : null;

        if (result) {
            const infoTicket = document.querySelector('#ticketInfo');
            const bodyTicket = document.querySelector('#bodyTicket');
            const addComments = document.querySelector('#add_comments input').checked;

            let issue, isFail = false;
            try {
                issue = await jira.findIssue(result);
            } catch (e) {
                issue = e;
                isFail = true;
            }
            if (isFail) {
                resMessage.innerHTML = '❌ Ошибка при отправке запроса:<br>' + issue;
                resMessage.classList.remove('hidden');
                loader.off();
                return;
            }
            resMessage.classList.remove('warning');
            resMessage.classList.add('success');
            resMessage.innerHTML = '✅ Тикет найден, нажмите "Продолжить"';
            resMessage.classList.remove('hidden');
            loader.off();
            document.querySelector('.disable-next').disabled = false;
            infoTicket.value = `**Запрос JIRA:** [${result}](${uri})\n**Автор:** ${issue.fields.reporter.displayName}`;
            bodyTicket.value = `>${issue.fields.description.replace(/\n/g, '\n>')}
${(addComments) && (issue.fields.comment.comments.length > 0) ? `<details><summary>Комментарии запроса</summary>\n\n${issue.fields.comment.comments.reduce((str, cur, idx) => {
                str += `\n\n*Комментарий №${idx + 1}*\n`
                str += `*Автор:* ${cur['updateAuthor'].displayName}\n\n>`
                str += cur.body.replace(/\n/g, '\n>');
                return str
            }, '')}\n\n</details>`: ''}`;
            infoTicket.style.height = 100 + (infoTicket.value.match(/\n/g).length * 20) +"px";
            bodyTicket.style.height = 100 + (bodyTicket.value.match(/\n/g).length * 20) +"px";
        } else {
            resMessage.innerHTML = "❌ Не могу определить URI запроса";
            resMessage.classList.remove('hidden');
            loader.off();
        }
    });
}

module.exports = { getTicketJira }