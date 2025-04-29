// controllers/authController.js
import { apiService } from '../services/apiServices.js';
import { showMessage, clearForm } from '../utils/domUtils.js';
import { getLoginFormData, getRegisterFormData } from '../utils/authUtils.js';

export async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const messageContainer = document.querySelector('#registerMessage');

    const data = getRegisterFormData(form);

    if (!data.nome || !data.cpf || !data.email || !data.senha || !data.confirmaSenha || !data.telefone || !data.politicas) {
        showMessage(messageContainer, 'Todos os campos obrigatórios devem ser preenchidos.', true);
        return;
    }

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

    try {
        const response = await apiService.registerUser(userData);
        if (response && response.message) {
            if (response.message.includes('sucesso')) {
                showMessage(messageContainer, response.message, false);
                clearForm(form);
            } else {
                showMessage(messageContainer, response.message, true);
            }
        } else {
            showMessage(messageContainer, 'Erro ao registrar usuário.', true);
        }
    } catch (error) {
        console.error(error);
        showMessage(messageContainer, 'Erro ao cadastrar usuário.', true);
    }
}

export async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const messageContainer = document.querySelector('#loginMessage');

    const { email, senha } = getLoginFormData(form);

    if (!email || !senha) {
        showMessage(messageContainer, 'Email e senha são obrigatórios.', true);
        return;
    }

    try {
        const response = await apiService.loginUser(email, senha);
        if (response && response.message) {
            if (response.message.includes('sucesso')) {
                showMessage(messageContainer, response.message, false);
                clearForm(form);
                // Redirecionar ou realizar outras ações após login bem-sucedido
            } else {
                showMessage(messageContainer, response.message, true);
            }
        } else {
            showMessage(messageContainer, 'Erro ao realizar login.', true);
        }
    } catch (error) {
        console.error(error);
        showMessage(messageContainer, 'Erro ao realizar login.', true);
    }
}
