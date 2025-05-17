import { apiService } from '../services/apiServices.js';
import { getToken } from '../utils/authUtils.js';

let currentPageUsuarios = 1;
const limitUsuarios = 10;
let paginaAtualMensagens = 1;
const limitMensagens = 15;
let loadingMensagens = false;
let allMensagensCarregadas = false;

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = '../pages/login.html';
        return;
    }

    try {
        await carregarMensagensDinamicamente();
        await carregarUsuarios();
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        alert(`Erro ao carregar dados do dashboard:\n${error.message || error}`);
    }

    const form = document.getElementById('createUserForm');
    form?.addEventListener('submit', handleCreateUser);
    configurarAbas();
});

async function carregarMensagensDinamicamente() {

    if (loadingMensagens || allMensagensCarregadas) return;

    loadingMensagens = true;

    try {
        const token = getToken();
        const data = await apiService.getMessages(token, paginaAtualMensagens, limitMensagens);

        if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
            allMensagensCarregadas = true;
            return;
        }

        console.log('Mensagens recebidas:', data.results);
        console.log('pagina atual: ', paginaAtualMensagens)
        renderizarMensagens(data.results, true);
        paginaAtualMensagens++;
    } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
    } finally {
        loadingMensagens = false;
    }
}

function renderizarMensagens(mensagens, append = false) {
    const lista = document.getElementById('messagesList');
    if (!append) lista.innerHTML = '';

    if (!mensagens || mensagens.length === 0) {
        if (!append) lista.innerHTML = '<p>Nenhuma mensagem encontrada.</p>';
        return;
    }

    mensagens.forEach(msg => {
        const card = document.createElement('div');
        card.className = 'message-card';
        card.innerHTML = `
            <div class="message-header">
                <strong>${msg.nome}</strong> <span class="message-email">${msg.email}</span>
            </div>
            <div class="message-body">${msg.mensagem}</div>
            <div class="message-actions">
                <button class="responder-btn" data-email="${msg.email}" data-nome="${msg.nome}">Responder</button>
                <button class="delete-btn" data-id="${msg.id_solicitacao}">Excluir</button>
            </div>`;

        card.addEventListener('click', function (event) {
            if (event.target.tagName === 'BUTTON') return;
            this.classList.toggle('expanded');
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            excluirMensagem(msg.id_solicitacao);
        });

        card.querySelector('.responder-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const email = e.target.dataset.email;
            const nome = e.target.dataset.nome;
            alert(`Abrir janela de resposta para ${nome} <${email}>`);
        });

        lista.appendChild(card);
    });
}

async function excluirMensagem(id) {
    const token = getToken();
    if (!token) {
        alert('Token não encontrado. Faça login novamente.');
        return;
    }

    try {
        await apiService.excluirMensagem(id, token);
        await carregarMensagensDinamicamente();
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
    tbody.innerHTML = '';

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
    const mensagensTab = document.getElementById('mensagensTab');
    const usuariosTab = document.getElementById('usuariosTab');
    const linkMensagens = document.getElementById('link-mensagens');
    const linkUsuarios = document.getElementById('link-usuarios');
    const linkLogout = document.getElementById('link-logout');

    linkMensagens.addEventListener('click', (e) => {
        e.preventDefault();
        mensagensTab.classList.add('active');
        usuariosTab.classList.remove('active');
        linkMensagens.classList.add('active-link');
        linkUsuarios.classList.remove('active-link');
    });

    linkUsuarios.addEventListener('click', (e) => {
        e.preventDefault();
        usuariosTab.classList.add('active');
        mensagensTab.classList.remove('active');
        linkUsuarios.classList.add('active-link');
        linkMensagens.classList.remove('active-link');
    });

    linkLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.setItem('logoutMessage', 'Logout realizado com sucesso!');
        window.location.href = '../pages/login.html';
    });

    // Scroll infinito para mensagens
    const mensagensContainer = document.getElementById('messagesList');
    mensagensContainer.addEventListener('scroll', () => {
        if (
            mensagensContainer.scrollTop + mensagensContainer.clientHeight >=
            mensagensContainer.scrollHeight - 50
        ) {
            carregarMensagensDinamicamente();
        }
    });
}