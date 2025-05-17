export function showModal(modalId, message = '', subMessage = '', confirmCallback = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const title = modal.querySelector('h2');
    const subTitle = modal.querySelector('#modalRequestId');
    const confirmButton = modal.querySelector('#confirmButton');

    if (title) title.textContent = message;
    if (subTitle) subTitle.textContent = subMessage;

    if (confirmButton && typeof confirmCallback === 'function') {
        confirmButton.onclick = confirmCallback;
    }

    modal.classList.add('show');
}

export function showError(modalId, errorMessageText) {
    const modal = document.getElementById(modalId);
    const message = document.getElementById('errorMessage');
    if (modal && message) {
        message.textContent = errorMessageText;
        modal.classList.add('show');
    }

    const closeModalXBtn = document.querySelector('#closeErrorModal');
    if (closeModalXBtn) {
        closeModalXBtn.onclick = () => {
            modal.classList.remove('show');
        };
    }

    // Fechar ao clicar fora
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };

    // Fecha automático após tempo
    setTimeout(() => {
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    }, 10000);
}
