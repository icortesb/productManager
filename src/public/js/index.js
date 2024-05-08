document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    
    addMessage();
});

const addMessage = async () => {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, message: message })
        });

    } catch (error) {
        console.error('Error:', error);
    }
    
    socket.emit('newMessage', { email, message });
}

socket.on('chatMessage', (data) => {
    render(data);
});

const render = (data) => {
    const html = data.map((elem) => {
        return(`<div>
                    <strong style=color:white>${elem.user.email}:</strong>
                    <em style=color:white>${elem.message}</em>
                </div>`)
    }).join(' ');
    document.getElementById('lista_mensajes').innerHTML = html;
}
