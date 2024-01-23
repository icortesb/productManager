
const addMessage = () => {
    const mensaje = {
        nombre: document.getElementById('nombre').value,
        mensaje: document.getElementById('mensaje').value
    }

    socket.emit('newMessage', mensaje);
    
    return false;
}

socket.on('chatMessage', (data) => {
    render(data);
    let chat = document.getElementById('lista_mensajes');
    chat.scrollTop = chat.scrollHeight;
})

const render = (data) => {
    const html = data.map((elem) => {
        return(`<div>
                    <strong style=color:white>${elem.nombre}:</strong>
                    <em style=color:white>${elem.mensaje}</em>
                </div>`)
    }).join(' ');
    document.getElementById('lista_mensajes').innerHTML = html;
}