const selectForm = function () {
    document.querySelectorAll('.select-form').forEach((el, idx) => {
        const forms = document.querySelectorAll('.step-form');
        const lsId = localStorage.getItem('keyForm') || undefined;
        el.addEventListener('click', () => {
            const elementClass = el.getAttribute('class');
            if (elementClass.includes('non-select')) {
                document.querySelectorAll('.select-form').forEach(el => el.classList.add('non-select'));
                forms.forEach(el => el.classList.add('hidden'));
                el.classList.remove('non-select');
                forms[idx].classList.remove('hidden');
                localStorage.setItem('keyForm', `${idx}`);
            }
        });
        if (lsId && Number(lsId) === idx) {
            document.querySelectorAll('.select-form').forEach(el => el.classList.add('non-select'));
            forms.forEach(el => el.classList.add('hidden'));
            forms[idx].classList.remove('hidden');
            el.classList.remove('non-select');
        }
    });
}
module.exports = { selectForm }