import { apiService } from '../services/apiServices.js';
import { getToken } from '../utils/authUtils.js';

let currentPageMensagens = 1;
let currentPageUsuarios = 1;
const limitUsuarios = 10;

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = '../pages/login.html';
        return;
    }

    try {
        await carregarMensagens();
        await carregarUsuarios();
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        alert(`Erro ao carregar dados do dashboard:\n${error.message || error}`);
    }

    const form = document.getElementById('createUserForm');
    form?.addEventListener('submit', handleCreateUser);
    configurarAbas();
});

async function carregarMensagens(page = 1) {
    currentPageMensagens = page;
    try {
        const token = getToken();
        const { results, currentPage, totalPages } = await apiService.getMessages(token, page);
        renderizarMensagens(results);
        renderizarPaginacaoMensagens(currentPage, totalPages);
    } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
    }
}

function renderizarMensagens(mensagens) {
    const lista = document.getElementById('messagesList');
    lista.innerHTML = '';

    if (!mensagens || mensagens.length === 0) {
        lista.innerHTML = '<p>Nenhuma mensagem encontrada.</p>';
        return;
    }

    mensagens.forEach(msg => {
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
        card.querySelector('.delete-btn').addEventListener('click', () => excluirMensagem(msg.id_solicitacao));
        lista.appendChild(card);
    });
}

function renderizarPaginacaoMensagens(paginaAtual, totalPaginas) {
    const container = document.getElementById('pagination');
    container.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === paginaAtual ? 'active' : '';
        btn.onclick = () => carregarMensagens(i);
        container.appendChild(btn);
    }
}

async function excluirMensagem(id) {
    const token = getToken();
    if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
    }

    try {
        await apiService.excluirMensagem(id, token);
        await carregarMensagens(currentPageMensagens);
    } catch (err) {
        console.error(err);
        alert('Erro ao excluir mensagem');
    }
}

async function carregarUsuarios() {
    const token = getToken();
    try {
        const { results, total } = await apiService.getUsers(token, currentPageUsuarios, limitUsuarios);
        renderizarUsuarios(results);
        renderizarPaginacaoUsuarios(total);
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
    }
}

function renderizarUsuarios(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = ''; // limpa tudo

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input value="${user.nome}" id="nome-${user.id_usuario}" /></td>
            <td><input value="${user.email}" id="email-${user.id_usuario}" /></td>
            <td>
                <select id="role-${user.id_usuario}">
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
                </select>
            </td>
            <td>
                <button class="btn-salvar" data-id="${user.id_usuario}">Salvar</button>
                <button class="btn-excluir" data-id="${user.id_usuario}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Atribui eventos novamente
    tbody.querySelectorAll('.btn-salvar').forEach(btn =>
        btn.addEventListener('click', () => editarUsuario(btn.dataset.id))
    );
    tbody.querySelectorAll('.btn-excluir').forEach(btn =>
        btn.addEventListener('click', () => excluirUsuario(btn.dataset.id))
    );
}

function renderizarPaginacaoUsuarios(total) {
    const totalPaginas = Math.ceil(total / limitUsuarios);
    const container = document.getElementById('paginacao-usuarios');
    container.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPageUsuarios) {
            btn.classList.add('ativo');
        }
        btn.addEventListener('click', () => {
            if (i !== currentPageUsuarios) {
                currentPageUsuarios = i;
                carregarUsuarios();
            }
        });
        container.appendChild(btn);
    }
}

async function editarUsuario(id) {
    const token = getToken();
    const nome = document.getElementById(`nome-${id}`).value;
    const email = document.getElementById(`email-${id}`).value;
    const role = document.getElementById(`role-${id}`).value;

    try {
        await apiService.updateUser(id, { nome, email, role }, token);
        await carregarUsuarios();
        alert('Usuário atualizado!');
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        alert('Erro ao atualizar usuário');
    }
}

async function excluirUsuario(id) {
    const token = getToken();
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        await apiService.deleteUser(id, token);
        alert('Usuário excluído!');
        await carregarUsuarios();
    } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        alert('Erro ao excluir usuário');
    }
}

async function handleCreateUser(event) {
    event.preventDefault();
    const token = getToken();
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
}

function configurarAbas() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
}