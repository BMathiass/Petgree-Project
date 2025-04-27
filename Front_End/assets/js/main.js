async function enviarContato() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagem = document.getElementById('mensagem').value;

    const baseURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://petgree-project.onrender.com';

    try {
        const response = await fetch(`${baseURL}/api/form/submit-contato`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, telefone, mensagem })
        });

        const data = await response.json();
        alert(data.message || "Contato enviado com sucesso!");
    } catch (error) {
        console.error('Erro ao enviar contato:', error);
        alert('Erro ao enviar o contato');
    }
}
