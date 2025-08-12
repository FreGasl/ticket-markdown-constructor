const setTextarea = function () {
    let ctrlDown = false;

    document.addEventListener('keydown', function (e) {
        ctrlDown = e.ctrlKey || e.metaKey;
    });
    document.addEventListener('keyup', function (e) {
        ctrlDown = false;
    });

    // Настройка textarea
    document.querySelectorAll('textarea').forEach(el => {
        el.addEventListener("input", () => {
            el.style.height = "5px";
            el.style.height = (el.scrollHeight)+"px";
        });
    });

    document.querySelectorAll('.hint').forEach(el => {
        const key = (process.platform === "MacOS") ? 'CMD' : 'CTRL';
        el.innerHTML = `<kbd>${key}</kbd> + <kbd>N</kbd>  - код; ` +
            `<kbd>${key}</kbd> + <kbd>B</kbd> - жирный текст; ` +
            `<kbd>${key}</kbd> + <kbd>I</kbd> - курсив; ` +
            `<kbd>${key}</kbd> + <kbd>TAB</kbd> - список`;
    });

    document.querySelectorAll('textarea').forEach(el =>
        el.addEventListener('keydown', async function (e) {
            if (!ctrlDown) return;

            const start = this.selectionStart;
            const end = this.selectionEnd;
            let wrapper, cursorOffset;

            switch(e.code) {
                case 'KeyB': // Bold: **
                    e.preventDefault();
                    wrapper = ['**', '**'];
                    cursorOffset = 2;
                    break;

                case 'KeyI': // Italic: *
                    e.preventDefault();
                    wrapper = ['*', '*'];
                    cursorOffset = 1;
                    break;

                case 'KeyN': // Code: ```
                    e.preventDefault();
                    wrapper = ['```', '```'];
                    cursorOffset = 3;
                    break;

                case 'Tab': // List item
                    e.preventDefault();
                    this.value += '\n   - ';
                    this.style.height = "5px";
                    this.style.height = (this.scrollHeight) + "px";
                    return;

                default:
                    return;
            }

            // Получаем выделенный текст
            const selectedText = this.value.substring(start, end);

            // Формируем новую строку
            const newText = wrapper[0] + selectedText + wrapper[1];

            // Вставляем новое значение
            this.value = this.value.slice(0, start) + newText + this.value.slice(end);

            // Позиционируем курсор
            const newCursorPos = start + newText.length;
            this.setSelectionRange(
                selectedText ? start : newCursorPos - cursorOffset,
                selectedText ? newCursorPos : newCursorPos - cursorOffset
            );

            // Обновляем высоту textarea
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        })
    );

    document.querySelectorAll('[placeholder="Шаги воспроизведения"], [placeholder="Шаги воспроизведения №2"]').forEach(el => {
        el.addEventListener("keydown", function (e) {
            if (e.keyCode === 8) {
                if (this.value.match(/\n$/)) this.value = this.value.replace(/\n$/, ' ');
            } else if (e.keyCode === 13) {
                if (ctrlDown)
                    this.value += `\n`;
                else {
                    const steps = this.value.match(/^\d+\..*$/gm)?.length;
                    e.preventDefault();
                    this.value = this.value + `\n${(steps) ? steps + 1 : 1}. `;
                }
                this.style.height = "5px";
                this.style.height = (this.scrollHeight) + "px";
                return false;
            } else {
                return true;
            }
        })
    })
}

const addSecondTextarea = function () {
    document.querySelector('.add_stepstiket').addEventListener("click", function () {
        document.querySelector('label[hidden]').removeAttribute("hidden");
        document.querySelector('.hint[hidden]').removeAttribute("hidden");
        document.querySelector('textarea[hidden]').removeAttribute("hidden");
        this.remove();
    });
}
module.exports = { setTextarea, addSecondTextarea }