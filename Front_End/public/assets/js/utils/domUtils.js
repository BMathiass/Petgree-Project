import { FormatUtils } from './formatUtils.js';

export const DomUtils = {
    setupInputMasks() {
        const telefoneInput = document.getElementById('telefone');
        const cpfInput = document.getElementById('cpf');

        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                const { value, selectionStart } = e.target;
                const formatted = FormatUtils.formatTelefone(value);
                
                e.target.value = formatted;
                
                // Ajusta a posição do cursor para após o último dígito inserido
                if (selectionStart < value.length) {
                    const diff = formatted.length - value.length;
                    e.target.setSelectionRange(selectionStart + diff, selectionStart + diff);
                }
            });
        }

        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                const { value, selectionStart } = e.target;
                const formatted = FormatUtils.formatCPF(value);
                
                e.target.value = formatted;
                
                // Ajusta a posição do cursor
                if (selectionStart < value.length) {
                    const diff = formatted.length - value.length;
                    e.target.setSelectionRange(selectionStart + diff, selectionStart + diff);
                }
            });
        }
    },

    // Função para pegar os valores do formulário
    getFormValues(formId) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Formulário com ID ${formId} não encontrado!`);
            return null;
        }

        return {
            nome: form.nome.value,
            email: form.email.value,
            telefone: form.telefone.value,
            mensagem: form.mensagem.value
        };
    },

    // Função para configurar o envio do formulário
    setupFormSubmit(formId, callback) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Formulário ${formId} não existe no DOM!`);
            return;
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = this.getFormValues(formId);
            if (formData) {
                callback(formData);
            }
        });
    },

    showModal(requestId) {
        const modal = document.getElementById('confirmationModal');
        const requestIdElement = document.getElementById('modalRequestId');
        const closeBtn = document.querySelector('.close-modal');
        const confirmBtn = document.getElementById('confirmButton');

        requestIdElement.textContent = requestId;
        modal.style.display = 'block';

        // Fechar modal ao clicar no X
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            this.resetForm('formContato');
        };

        // Fechar modal ao clicar no botão OK
        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            this.resetForm('formContato');
        };

        // Fechar ao clicar fora do modal
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                this.resetForm('formContato');
            }
        };
    },

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    showError(message) {
        alert(message || "Ocorreu um erro! Tente novamente.");
    }
};

// Função para exibir mensagens no DOM
export function showMessage(container, message, isError = false) {
    container.textContent = message;
    container.style.color = isError ? 'red' : 'green';
}

// Função para limpar o formulário
export function clearForm(form) {
    form.reset();
};

// Função para mostrar o modal de sucesso
export function showSuccessModal(userId = '') {
    const modal = document.getElementById('confirmationModal');
    if (!modal) return;

    const requestIdElement = document.getElementById('modalRequestId');
    requestIdElement.textContent = userId ? `ID do usuário: ${userId}` : '';

    modal.style.display = 'block';

    // Botão "LOGIN" no modal redireciona para página de login
    const confirmBtn = document.getElementById('confirmButton');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            window.location.href = '../login.html'; // ajuste conforme seu projeto
        };
    }

    // Fecha modal ao clicar no "X"
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Fecha modal ao clicar fora
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}