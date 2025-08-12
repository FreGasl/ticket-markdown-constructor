const successMsg = function (selector, successText, startText) {
    selector.textContent = successText;
    selector.style.color = "#37d67a";
    selector.style.border = "2px solid rgb(55, 214, 122)";
    setTimeout(() => {
        selector.textContent = startText;
        selector.style.color = "#ffffff";
        selector.style.border = "2px solid rgba(255,255,255,0.1)";
    }, 1000);
}

const errorMsg = function (selector, errorText) {
    const startText = selector.innerHTML;
    const startStyle = selector.style;
    selector.textContent = errorText;
    selector.style.color = "#f47373";
    selector.style.border = "2px solid #f47373";
    setTimeout(() => {
        selector.innerHTML = startText;
        selector.style = startStyle;
    }, 1000);
}

module.exports = { successMsg, errorMsg }
