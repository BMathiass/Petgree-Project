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

    // Função para redirecionar para a página de confirmação
    redirectToConfirmation(requestId) {
        window.location.href = `../pages/confirmacao.html?requestId=${requestId}`;
    },

    // Função para exibir uma mensagem de erro
    showError(message) {
        alert(message || "Ocorreu um erro! Tente novamente.");
    },

    // Função para pegar o parâmetro da URL
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Função para exibir o requestId na página de confirmação
    displayRequestId() {
        const requestId = this.getUrlParameter('requestId');
        const requestIdElement = document.getElementById('requestId');

        if (requestIdElement) {
            if (requestId) {
                requestIdElement.textContent = requestId;
            } else {
                requestIdElement.textContent = 'Erro: ID não encontrado!';
            }
        } else {
            console.error("Elemento com ID 'requestId' não encontrado!");
        }
    }
};
