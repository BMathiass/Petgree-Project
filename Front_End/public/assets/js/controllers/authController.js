import { apiService } from '../services/apiServices.js';
import { showMessage, clearForm, showErrorModal } from '../utils/domUtils.js';
import { getLoginFormData, getRegisterFormData } from '../utils/authUtils.js';

export async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const messageContainer = document.querySelector('#registerMessage');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');

    const data = getRegisterFormData(form);

    // Validação de campos obrigatórios
    if (!data.nome || !data.cpf || !data.email || !data.senha || !data.confirmaSenha || !data.telefone || !data.politicas) {
        showMessage(messageContainer, 'Todos os campos obrigatórios devem ser preenchidos.', true);
        return;
    }

    // Validação de e-mail
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(data.email)) {
        showMessage(messageContainer, 'O e-mail fornecido é inválido.', true);
        return;
    }

    // Validação de CPF
    const isValidCPF = (cpf) => /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/.test(cpf);
    if (!isValidCPF(data.cpf)) {
        showMessage(messageContainer, 'O CPF fornecido é inválido.', true);
        return;
    }

    // Validação de senha
    if (data.senha.length < 6) {
        showMessage(messageContainer, 'A senha deve ter pelo menos 6 caracteres.', true);
        return;
    }

    if (data.senha !== data.confirmaSenha) {
        showMessage(messageContainer, 'As senhas não conferem.', true);
        return;
    }

    const userData = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        senha: data.senha,
        confirmaSenha: data.confirmaSenha,
        telefone: data.telefone,
        ofertas: data.ofertas,
        politicas: data.politicas
    };
    console.log('Dados enviados para registro:', userData);

    try {
        const response = await apiService.registerUser(userData);

        if (response && response.message) {
            if (response.message.includes('sucesso')) {
                clearForm(form);
                // Exibir modal de sucesso
                const modal = document.getElementById('confirmationModal');
                const message = modal.querySelector('h2');
                const requestId = document.getElementById('modalRequestId');
                const confirmButton = document.getElementById('confirmButton');

                message.textContent = 'Seu cadastro foi realizado com sucesso!';
                requestId.textContent = `Bem vindo ${response.nome || 'usuário'}`;
                confirmButton.onclick = () => {
                    window.location.href = './login.html'; // ajuste conforme o caminho do seu projeto
                };

                modal.classList.add('show'); // ativa o modal de sucesso
            } else {
                // Exibir modal de erro
                errorMessage.textContent = response.message || 'Ocorreu um erro!';
                errorModal.classList.add('show'); // ativa o modal de erro
            }
        } else {
            // Exibir modal de erro genérico
            errorMessage.textContent = 'Erro ao registrar usuário.';
            errorModal.classList.add('show'); // ativa o modal de erro
        }
    } catch (error) {
        console.error(error);

        // Verificando a mensagem de erro
        if (error.message.includes('Email ou CPF já cadastrado')) {
            errorMessage.textContent = 'O e-mail ou CPF já está cadastrado.';
        } else {
            errorMessage.textContent = 'Erro ao cadastrar usuário.';
        }

        // Exibir o modal de erro novamente
        errorModal.classList.add('show'); // ativa o modal de erro
    }

    // Fechar o modal de erro apenas ao clicar no X
    const closeModalXBtn = document.querySelector('#closeErrorModal');

    if (closeModalXBtn) {
        closeModalXBtn.onclick = () => {
            errorModal.classList.remove('show'); // esconde o modal de erro
        };
    }

    // Sempre garantir que o modal de erro seja visível se houver um erro
    setTimeout(() => {
        if (errorModal.classList.contains('show')) {
            errorModal.classList.remove('show');
        }
    }, 10000); // Esconde o modal de erro após 3 segundos (ajuste conforme necessidade)
}

export function validatePasswords() {
    const passwordInput = document.getElementById('senha');
    const confirmPasswordInput = document.getElementById('confirmaSenha');
    const lengthAlert = document.getElementById('passwordLengthAlert');
    const matchAlert = document.getElementById('passwordMatchAlert');

    const checkPasswordLength = () => {
        if (passwordInput.value.length < 6) {
            lengthAlert.classList.remove('hidden');
            passwordInput.classList.add('input-error');
        } else {
            lengthAlert.classList.add('hidden');
            passwordInput.classList.remove('input-error');
        }
    };

    const checkPasswordMatch = () => {
        const senha = passwordInput.value;
        const confirmaSenha = confirmPasswordInput.value;

        if (confirmaSenha && senha !== confirmaSenha) {
            matchAlert.classList.remove('hidden');
            passwordInput.classList.add('input-error');
            confirmPasswordInput.classList.add('input-error');
        } else {
            matchAlert.classList.add('hidden');
            passwordInput.classList.remove('input-error');
            confirmPasswordInput.classList.remove('input-error');
        }
    };

    if (!passwordInput || !confirmPasswordInput) return;

    passwordInput.addEventListener('input', () => {
        checkPasswordLength();
        checkPasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', () => {
        checkPasswordMatch();
    });
}

export async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    if (!form) return;

    const messageContainer = document.querySelector('#loginMessage');
    const errorModal = document.getElementById('errorModal'); // Selecionando o modal de erro
    const errorMessage = document.getElementById('errorMessage'); // Selecionando a mensagem de erro

    // Verifique se o messageContainer está presente no DOM
    if (!messageContainer) {
        console.error('Erro: messageContainer não encontrado no DOM');
        return;
    }

    if (!errorModal || !errorMessage) {
        console.error('Erro: O modal ou a mensagem de erro não foram encontrados no DOM');
        return;
    }

    const { email, senha } = getLoginFormData(form);

    if (!email || !senha) {
        showMessage(messageContainer, 'Email e senha são obrigatórios.', true);
        return;
    }

    try {
        const response = await apiService.loginUser(email, senha);
        if (response && response.message) {
            if (response.message.includes('sucesso')) {
                // Salva token e dados do usuário localmente
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Redireciona para dashboard
                window.location.href = '../index.html';
            } else {
                showMessage(messageContainer, response.message, true);
                // Exibe o modal de erro
                errorMessage.textContent = response.message || 'Ocorreu um erro ao realizar login.';
                errorModal.classList.add('show'); // Ativa o modal de erro
            }
        } else {
            showMessage(messageContainer, 'Erro ao realizar login.', true);
            // Exibe o modal de erro
            errorMessage.textContent = 'Erro ao realizar login.';
            errorModal.classList.add('show'); // Ativa o modal de erro
        }
    } catch (error) {
        console.error(error);
        showMessage(messageContainer, 'Erro ao realizar login.', true);

        // Verificando a mensagem de erro
        if (error.message.includes('Credenciais inválidas')) {
            errorMessage.textContent = 'Email ou senha incorretos.';
        } else {
            errorMessage.textContent = 'Erro ao realizar login.';
        }

        // Exibe o modal de erro
        errorModal.classList.add('show'); // Ativa o modal de erro
    }

    // Fechar o modal de erro apenas ao clicar no X
    const closeModalXBtn = document.querySelector('#closeErrorModal');
    if (closeModalXBtn) {
        closeModalXBtn.onclick = () => {
            errorModal.classList.remove('show');
        };
    }

    // Fechar o modal ao clicar fora dele
    window.onclick = (event) => {
        if (event.target === errorModal) {
            errorModal.classList.remove('show');
        }
    };

    // Sempre garantir que o modal de erro seja visível se houver um erro
    setTimeout(() => {
        if (errorModal.classList.contains('show')) {
            errorModal.classList.remove('show');
        }
    }, 10000); // Esconde o modal de erro após 6 segundos
}
