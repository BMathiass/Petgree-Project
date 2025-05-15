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
    async getMessages(token) {
        const res = await fetch(`${this.baseURL}/api/admin/messages`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('getMessages response status:', res.status);
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Erro ao buscar mensagens:', errorText);
            throw new Error('Erro ao buscar mensagens');
        }
        const data = await res.json();
        console.log('getMessages data:', data);
        return data;
    }

    async getUsers(token) {
        const res = await fetch(`${this.baseURL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        const data = await res.json();
        console.log('getUsers data:', data); // <-- DEBUG
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
        const confirmacao = confirm("Tem certeza que deseja excluir esta mensagem?");
        if (!confirmacao) return;

        try {
            const response = await fetch(`${this.baseURL}/api/admin/message/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir a mensagem");
            }

            alert("Mensagem excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir mensagem:", error);
            alert("Erro ao excluir mensagem. Verifique o console para detalhes.");
        }
    }

}

export const apiService = new ApiService();