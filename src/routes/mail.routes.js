import { Router } from "express";
import transporter from "../config/nodemailer.config.js";


const routerMail = new Router();

routerMail.use('/sendMail', async (req, res) => {
    let mensaje = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: 'vanesalettieri96@gmail.com',
        subject: 'Te amo',
        text: 'Hola, te amo',
        html: `
        <div>
            <h1>Te amo</h1>
            <p>Te amo mucho</p>
        </div>
        `
    })
    if(!mensaje.messageId) {
        console.log(`Error al enviar el mail: ${mensaje}`)
        res.status(500).send('Error al enviar el mail')
    } else {
        console.log('Mail enviado correctamente')
        res.status(200).send('Mail enviado correctamente')
    }
})

export default routerMail;