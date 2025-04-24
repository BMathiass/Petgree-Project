async function enviarEmail() {
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('LEMBRAR DE COLOCAR A URL DO BACK AQUI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('Erro ao enviar o e-mail');
    }
}
