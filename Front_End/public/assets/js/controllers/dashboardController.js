import { apiService } from '../services/apiServices.js';
import { getToken } from '../utils/authUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const [messages, users] = await Promise.all([
            apiService.getMessages(token),
            apiService.getUsers(token)
        ]);
        renderMessages(messages.results || []);
        renderUsers(users.results || []);  // <-- ajustado aqui
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert(`Erro ao carregar dados do dashboard:\n${error.message || error}`);
    }




    document.getElementById('createUserForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('newNome').value;
        const email = document.getElementById('newEmail').value;
        const senha = document.getElementById('newSenha').value;
        const role = document.getElementById('newRole').value;

        try {
            await apiService.createUser({ nome, email, senha, role }, token);
            alert('Usuário criado com sucesso');
            window.location.reload();
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            alert('Erro ao criar usuário');
        }
    });
});

function renderMessages(messages) {
    const list = document.getElementById('messagesList');
    list.innerHTML = '';

    const data = Array.isArray(messages) ? messages : messages?.results || [];

    if (data.length === 0) {
        list.innerHTML = '<p>Nenhuma mensagem encontrada.</p>';
        return;
    }

    data.forEach(msg => {
        const card = document.createElement('div');
        card.className = 'message-card';
        card.innerHTML = `
            <div class="message-header">
                <span>${msg.nome}</span>
                <span class="message-email">${msg.email}</span>
            </div>
            <div class="message-body">${msg.mensagem}</div>
            <div class="message-actions">
            <button class="delete-btn" data-id="${msg.id_solicitacao}">Excluir</button>
            </div>
        `;
        list.appendChild(card);
        
        const deleteButton = card.querySelector('.delete-btn');
        deleteButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token não encontrado. Faça login novamente.');
                return;
            }

            try {
                await apiService.excluirMensagem(msg.id_solicitacao, token);
            } catch (err) {
                console.error(err);
                alert('Erro ao excluir mensagem');
            }
        });

    });
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td><input value="${user.nome}" id="nome-${user.id_usuario}"/></td>
      <td><input value="${user.email}" id="email-${user.id_usuario}"/></td>
      <td>
        <select id="role-${user.id_usuario}">
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
        </select>
      </td>
      <td>
        <button onclick="editarUsuario(${user.id_usuario})">Salvar</button>
        <button onclick="excluirUsuario(${user.id_usuario})">Excluir</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

window.editarUsuario = async function (id_usuario) {
    const token = getToken();
    const nome = document.getElementById(`nome-${id_usuario}`).value;
    const email = document.getElementById(`email-${id_usuario}`).value;
    const role = document.getElementById(`role-${id_usuario}`).value;

    try {
        await apiService.updateUser(id_usuario, { nome, email, role }, token);
        alert('Usuário atualizado!');
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        alert('Erro ao atualizar usuário');
    }
};

window.excluirUsuario = async function (id_usuario) {
    const token = getToken();
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        await apiService.deleteUser(id_usuario, token);
        alert('Usuário excluído!');
        window.location.reload();
    } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        alert('Erro ao excluir usuário');
    }
};

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});
