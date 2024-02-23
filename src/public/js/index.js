document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    
    addMessage();
});

const addMessage = async () => {
    const mail = document.getElementById('mail').value;
    const mensaje = document.getElementById('mensaje').value;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: mail, message: mensaje })
        });

        if (response.ok) {
            console.log('Mensaje guardado correctamente');
        } else {
            console.error('Error al guardar el mensaje');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
    socket.emit('newMessage', { mail, mensaje });
}

socket.on('chatMessage', (data) => {
    render(data);
});

const render = (data) => {
    const html = data.map((elem) => {
        return(`<div>
                    <strong style=color:white>${elem.mail}:</strong>
                    <em style=color:white>${elem.mensaje}</em>
                </div>`)
    }).join(' ');
    document.getElementById('lista_mensajes').innerHTML = html;
}
