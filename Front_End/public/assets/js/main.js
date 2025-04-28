import { FormController } from './controllers/formController.js';
import { DomUtils } from './utils/domUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    new FormController('formContato');
    DomUtils.setupInputMasks(); // também pode colocar aqui

    const finalizarBtn = document.getElementById('finalizar-btn');
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', () => {
            window.location.href = '../public/index.html';
        });
    }
});
