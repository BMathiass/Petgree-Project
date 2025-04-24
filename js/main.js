async function enviarContato() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagem = document.getElementById('mensagem').value;

    try {
        const response = await fetch('https://desafio-html-dio.onrender.com', {
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
