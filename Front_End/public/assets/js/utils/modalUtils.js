export function showModal(modalId, message = '', subMessage = '', confirmCallback = null, autoClose = false) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const title = modal.querySelector('h2');
    const subTitle = modal.querySelector('#modalRequestId');
    const confirmButton = modal.querySelector('#confirmButton');
    const cancelButton = modal.querySelector('#cancelButton');

    if (title) title.textContent = message;
    if (subTitle) subTitle.textContent = subMessage;

    // Limpa eventos anteriores para evitar duplicação
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    if (newConfirmButton) {
        newConfirmButton.onclick = () => {
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
            if (!autoClose) {
                modal.classList.remove('show');
            }
        };
    }

    if (cancelButton) {
        cancelButton.onclick = () => modal.classList.remove('show');
    }

    // Fechar automaticamente se autoClose for true
    if (autoClose) {
        setTimeout(() => {
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        }, 3000);
    }

    // Fechar ao clicar fora
    const handleOutsideClick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            window.removeEventListener('click', handleOutsideClick);
        }
    };
    window.addEventListener('click', handleOutsideClick);

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
