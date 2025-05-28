import { apiService } from '../services/apiServices.js';
import { getToken } from '../utils/authUtils.js';
import { showModal, showError } from '../utils/modalUtils.js';

let currentPageUsuarios = 1;
const limitUsuarios = 13;
let paginaAtualMensagens = 1;
const limitMensagens = 15;
let loadingMensagens = false;
let allMensagensCarregadas = false;
let loadingUsuarios = false;
let allUsuariosCarregados = false;

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    if (!token) {
        showError('Acesso negado. Faça login como administrador.');
        setTimeout(() => window.location.href = '../pages/login.html', 3000);
        return;
    }

    try {
        await carregarMensagensDinamicamente();
        await carregarUsuariosDinamicamente();
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showError('errorModal', `Erro ao carregar dados do dashboard:\n${error.message || error}`);
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

        if (!data || !data.results || !Array.isArray(data.results)) {
            allMensagensCarregadas = true;
            return;
        }

        if (data.results.length === 0) {
            allMensagensCarregadas = true;
            document.getElementById('loadMoreMsgBtn').style.display = 'none';
            return;
        }

        renderizarMensagens(data.results, true);
        paginaAtualMensagens++;

        if (data.results.length < limitMensagens) {
            allMensagensCarregadas = true;
            document.getElementById('loadMoreMsgBtn').style.display = 'none';
        }
        else {
            const nextPageData = await apiService.getMessages(token, paginaAtualMensagens, limitMensagens);
            if (!nextPageData.results || nextPageData.results.length === 0) {
                allMensagensCarregadas = true;
                document.getElementById('loadMoreMsgBtn').style.display = 'none';
            }
        }

        // Atualiza visibilidade do botão
        const btn = document.getElementById('loadMoreMsgBtn');
        if (btn) btn.style.display = allMensagensCarregadas ? 'none' : 'block';
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
                <button class="delete-btn" data-id="${msg.id_mensagem}">Excluir</button>
            </div>`;

        card.addEventListener('click', function (event) {
            if (event.target.tagName === 'BUTTON') return;

            document.querySelectorAll('.message-card.expanded').forEach(card => {
                if (card !== this) {
                    card.classList.remove('expanded');
                }
            });

            this.classList.toggle('expanded');
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            excluirMensagem(msg.id_mensagem);
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
        showError('errorModal', 'Token não encontrado. Faça login novamente.');
        return;
    }

    // Guarda a referência do card
    const messageCard = document.querySelector(`.delete-btn[data-id="${id}"]`)?.closest('.message-card');

    showModal(
        'confirmationModal',
        'Confirmar exclusão',
        'Tem certeza que deseja excluir esta mensagem?',
        async () => {
            try {
                await apiService.excluirMensagem(id, token);
                
                // Função para remover a mensagem
                const removeMessageCard = () => {
                    if (messageCard) {
                        messageCard.style.opacity = '0';
                        setTimeout(() => {
                            messageCard.remove();
                            
                            document.getElementById('confirmationModal').classList.remove('show');
                            
                            // Verifica se precisa recarregar
                            const lista = document.getElementById('messagesList');
                            if (lista && lista.children.length === 0) {
                                paginaAtualMensagens = 1;
                                allMensagensCarregadas = false;
                                carregarMensagensDinamicamente();
                            }
                        }, 300);
                    }
                };
                
                // Mostra o modal de sucesso
                showModal(
                    'confirmationModal',
                    'Sucesso',
                    'Mensagem excluída com sucesso!',
                    removeMessageCard, // Executa ao clicar no OK
                    true // Fecha automaticamente
                );
                
                // Configura para remover também quando fechar automaticamente
                setTimeout(removeMessageCard, 3000); // Mesmo tempo do auto-close
                
            } catch (err) {
                console.error(err);
                showError('errorModal', err.message || 'Erro ao excluir mensagem');
            }
        }
    );

    document.getElementById('cancelButton').onclick = () => {
        document.getElementById('confirmationModal').classList.remove('show');
    };
}

async function carregarUsuariosDinamicamente() {
    if (loadingUsuarios || allUsuariosCarregados) return;

    loadingUsuarios = true;

    try {
        const token = getToken();
        const { results, total } = await apiService.getUsers(token, currentPageUsuarios, limitUsuarios);

        if (!results || results.length === 0) {
            allUsuariosCarregados = true;
            return;
        }

        renderizarUsuarios(results, true);
        currentPageUsuarios++;

        const totalPaginas = Math.ceil(total / limitUsuarios);
        if (currentPageUsuarios > totalPaginas) {
            allUsuariosCarregados = true;
        }

        // Atualiza visibilidade do botão
        const btn = document.getElementById('loadMoreUsersBtn');
        if (btn) btn.style.display = allUsuariosCarregados ? 'none' : 'block';

    } catch (erro) {
        console.error('Erro ao carregar usuários dinamicamente:', erro);
    } finally {
        loadingUsuarios = false;
    }
}


function renderizarUsuarios(users, append = false) {
    const tbody = document.getElementById('usersTableBody');

    // Limpa completamente o conteúdo anterior se não for append
    if (!append) {
        tbody.innerHTML = '';
    } else {
        // Remove apenas os usuários que serão substituídos
        users.forEach(user => {
            const existingRow = document.getElementById(`user-row-${user.id_usuario}`);
            if (existingRow) existingRow.remove();
        });
    }

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'user-row';
        tr.id = `user-row-${user.id_usuario}`; // ID único para a linha

        tr.innerHTML = `
            <td class="user-summary">
                <div class="user-name">${user.nome}</div>
                <div class="user-details" style="display:none">
                    <div class="detail-row">
                        <label>Email:</label>
                        <input value="${user.email}" class="user-email" data-id="${user.id_usuario}" />
                    </div>
                    <div class="detail-row">
                        <label>Papel:</label>
                        <select class="user-role" data-id="${user.id_usuario}">
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
                        </select>
                    </div>
                    <div class="user-actions">
                        <button class="btn-salvar" data-id="${user.id_usuario}">Salvar</button>
                        <button class="btn-excluir" data-id="${user.id_usuario}">Excluir</button>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(tr);

        const detailsDiv = tr.querySelector('.user-details');

        tr.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            const isExpanded = tr.classList.contains('expanded');

            // Fecha todos
            document.querySelectorAll('.user-row.expanded').forEach(row => {
                row.classList.remove('expanded');
                const details = row.querySelector('.user-details');
                if (details) details.style.display = 'none';
            });

            // Alterna visibilidade da linha atual
            if (!isExpanded) {
                tr.classList.add('expanded');
                if (detailsDiv) detailsDiv.style.display = 'block';
            } else {
                tr.classList.remove('expanded');
                if (detailsDiv) detailsDiv.style.display = 'none';
            }
        });

        // Adiciona eventos aos botões
        tr.querySelector('.btn-salvar')?.addEventListener('click', (e) => {
            e.stopPropagation();
            editarUsuario(user.id_usuario);
        });

        tr.querySelector('.btn-excluir')?.addEventListener('click', (e) => {
            e.stopPropagation();
            excluirUsuario(user.id_usuario);
        });
        tr.dataset.role = user.role;
    });
}

async function editarUsuario(id) {
    const token = getToken();
    const nome = document.getElementById(`nome-${id}`)?.value || '';
    const email = document.getElementById(`email-${id}`).value;
    const role = document.getElementById(`role-${id}`).value;

    try {
        await apiService.updateUser(id, { nome, email, role }, token);
        showModal(
            'confirmationModal',
            'Sucesso',
            'Usuário atualizado com sucesso!',
            () => document.getElementById('confirmationModal').classList.remove('show')
        );
        // Mantém o item expandido após edição
        const row = document.querySelector(`[data-id="${id}"]`).closest('.user-row');
        row.querySelector('.user-details').style.display = 'block';
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        showError('errorModal', 'Erro ao atualizar usuário');
    }
}

async function excluirUsuario(id) {
    const token = getToken();
    if (!token) {
        showError('errorModal', 'Token não encontrado. Faça login novamente.');
        return;
    }

    // Mostra o modal de confirmação
    showModal(
        'confirmationModal',
        'Confirmar exclusão',
        'Tem certeza que deseja excluir este usuário?',
        async () => {
            try {
                await apiService.deleteUser(id, token);

                // Remove visualmente o usuário da lista
                const userRow = document.querySelector(`.btn-excluir[data-id="${id}"]`)?.closest('.user-row');
                if (userRow) {
                    userRow.style.opacity = '0';
                    setTimeout(() => {
                        userRow.remove();

                        // Verifica se não há mais usuários e recarrega se necessário
                        if (document.getElementById('usersTableBody').children.length === 0) {
                            currentPageUsuarios = 1;
                            allUsuariosCarregados = false;
                            carregarUsuariosDinamicamente();
                        }
                    }, 300);
                }

                // Fecha o modal após a confirmação
                document.getElementById('confirmationModal').classList.remove('show');
            } catch (err) {
                console.error('Erro ao excluir usuário:', err);
                showError('errorModal', 'Erro ao excluir usuário');
            }
        }
    );

    // Configura o botão de cancelar
    document.getElementById('cancelButton').onclick = () => {
        document.getElementById('confirmationModal').classList.remove('show');
    };
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
        showModal(
            'confirmationModal',
            'Sucesso',
            'Usuário criado com sucesso',
            () => {
                document.getElementById('confirmationModal').classList.remove('show');
                window.location.reload();
            }
        );
        window.location.reload();
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        showError('errorModal', 'Erro ao criar usuário');
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

    document.getElementById('loadMoreUsersBtn')?.addEventListener('click', async () => {
        await carregarUsuariosDinamicamente();
    });
    document.getElementById('loadMoreMsgBtn')?.addEventListener('click', async () => {
        await carregarMensagensDinamicamente();
    });
}