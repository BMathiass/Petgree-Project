import { FormController } from './controllers/formController.js';
import { DomUtils } from './utils/domUtils.js';
import { handleRegister, handleLogin, validatePasswords } from './controllers/authController.js';
import { setupRequiredAsterisk } from './utils/formUtils.js';

document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.querySelector('#formCadastro');
    const loginForm = document.querySelector('#formLogin');
    const finalizarBtn = document.getElementById('finalizar-btn');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    new FormController('formContato');
    DomUtils.setupInputMasks();

    // Configuração do modal de cadastro (confirmationModal)
    const confirmationModal = document.getElementById('confirmationModal');
    const closeRegisterModalBtn = confirmationModal?.querySelector('.close-modal');
    const confirmButton = document.getElementById('confirmButton');

    if (closeRegisterModalBtn) {
        closeRegisterModalBtn.addEventListener('click', () => {
            confirmationModal.classList.remove('show');
        });
    }

    if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            window.location.href = 'login.html'; // ajuste o caminho se necessário
        });
    }

    validatePasswords();

    setupRequiredAsterisk();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userWelcome').style.display = 'block';
        document.getElementById('bemVindoUsuario').textContent = `Olá, ${user.nome}!`;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.reload(); // recarrega a página para refletir logout
        });
    }

});
