export function getLoginFormData(form) {
    const email = form.querySelector('#email');
    const senha = form.querySelector('#senha');

    return {
        email: email?.value.trim() || '',
        senha: senha?.value || ''
    };
}

export function getRegisterFormData(form) {
    const nome = form.querySelector('input[name="nome"]').value.trim();
    const cpf = form.querySelector('input[name="cpf"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const telefone = form.querySelector('input[name="telefone"]').value.trim();
    const senha = form.querySelector('input[name="senha"]').value.trim();
    const confirmaSenha = form.querySelector('input[name="confirmaSenha"]').value.trim();
    const ofertas = form.querySelector('input[name="ofertas"]').checked;
    const politicas = form.querySelector('input[name="politicas"]').checked;

    return { nome, cpf, email, telefone, senha, confirmaSenha, ofertas, politicas };
}
