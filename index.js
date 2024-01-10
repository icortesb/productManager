const express = require('express');

const app = express();

let PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor arriba. Puerto ${PORT}`)
})