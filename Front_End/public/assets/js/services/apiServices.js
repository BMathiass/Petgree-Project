class ApiService {
    constructor() {
        this.baseURL = this.getBaseUrl();
    }

    getBaseUrl() {
        return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://localhost:3000'
            : 'https://petgree-project.onrender.com';
    }

    async enviarDados(endpoint, dados) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            return await response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            throw error;
        }
    }

    async loginUser(email, senha) {
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        return response.json();
    }

    async registerUser(data) {
        const response = await fetch(`${this.baseURL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const text = await response.text(); // evita quebra se não for JSON
        let result;

        try {
            result = text ? JSON.parse(text) : {};
        } catch (err) {
            result = { message: 'Resposta inválida da API.' };
        }

        if (!response.ok) {
            throw new Error(result.message || 'Erro ao registrar usuário');
        }

        return result;
    }
}

export const apiService = new ApiService();