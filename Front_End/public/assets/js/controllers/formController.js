import { apiService } from '../services/apiServices.js';
import { DomUtils } from '../utils/domUtils.js';

export class FormController {
    constructor(formId) {
        this.formId = formId;
        this.init();
    }

    init() {
        DomUtils.setupFormSubmit(this.formId, this.handleSubmit.bind(this));
    }

    async handleSubmit(formData) {
        try {
            const response = await apiService.enviarDados('/api/form/submit-contato', formData);
            console.log('Resposta recebida:', response);

            if (response.success) {
                DomUtils.showModal(response.requestId);
            } else {
                DomUtils.showError(response.message);
            }
        } catch (error) {
            console.error('Erro no controller:', error);
            DomUtils.showError('Falha na conexão com o servidor');
        }
    }
}