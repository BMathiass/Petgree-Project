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

        const text = await response.text();
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

    // Métodos do Dashboard (com token)
    async getMessages(token, page, limit) {
        const response = await fetch(`${this.baseURL}/api/admin/messages?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erro ao buscar mensagens');
        return await response.json();
    }

    async getUsers(token, page = 1, limit = 10) {
        const res = await fetch(`${this.baseURL}/api/admin/users?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('token');
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = '/login.html';
                return;
            }

            const errorText = await res.text();
            console.error('Erro ao buscar usuários:', errorText);
            throw new Error('Erro ao buscar usuários');
        }

        const data = await res.json();
        return data;
    }

    async createUser(data, token) {
        const res = await fetch(`${this.baseURL}/api/admin/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erro ao criar usuário');
        return await res.json();
    }

    async updateUser(id, data, token) {
        const res = await fetch(`${this.baseURL}/api/admin/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erro ao atualizar usuário');
        return await res.json();
    }

    async deleteUser(id, token) {
        const res = await fetch(`${this.baseURL}/api/admin/user/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Erro ao excluir usuário');
        return await res.json();
    }

    async excluirMensagem(id, token) {
        try {
            const response = await fetch(`${this.baseURL}/api/admin/message/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao excluir a mensagem");
            }

            return await response.json(); // Retorna os dados se necessário
        } catch (error) {
            console.error("Erro ao excluir mensagem:", error);
            throw error; // Propaga o erro para ser tratado no controller
        }
    }

}

export const apiService = new ApiService();