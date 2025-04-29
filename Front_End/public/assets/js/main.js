import { FormController } from './controllers/formController.js';
import { DomUtils } from './utils/domUtils.js';
import { handleRegister, handleLogin } from './controllers/authController.js';

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
});