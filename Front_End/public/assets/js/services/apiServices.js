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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        return response.json();
    }
}

export const apiService = new ApiService();