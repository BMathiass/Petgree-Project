export const DomUtils = {
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