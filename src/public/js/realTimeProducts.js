const socket = io();

socket.on('getProducts', (data) => {

    const html = data.products.map((prod) => {
        return(`<div id="product_card">
                    <img src="${prod.thumbnails ? prod.thumbnails[0] : 'https://placehold.co/600x400?text=Image+Not+Found'}">
                    <strong>Title:</strong><span>${prod.title}</span>
                    <strong>Description:</strong><span>${prod.description}</span>
                    <strong>Category:</strong><span>${prod.category}</span>
                    <strong>Price:</strong><span>${prod.price}</span>
                    <strong>Thumbnail:</strong><span>${prod.thumbnails || 'https://placehold.co/600x400?text=Image+Not+Found'}</span>
                    <strong>Code:</strong><span>${prod.code}</span>
                    <strong>${prod.stock}</strong><span>${prod.stock}</span>
                    <strong>Status:</strong><span>${prod.status}</span>
                </div>`)
    }).join(' ');
    document.getElementById('lista_products').innerHTML = html;

})