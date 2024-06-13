import { Router } from "express";
import transporter from "../config/nodemailer.config.js";


const routerMail = new Router();

routerMail.use('/resetPassword/:mail', async (req, res) => {
    const { mail } = req.params;
    let mensaje = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: mail,
        subject: 'Reset Password',
        html: `
        <h1>Reset Password</h1>
        <p>Para resetear tu contraseña haz click en el siguiente link:</p>
        <a href="http://localhost:8080/auth/newPassword/${mail}">Reset Password</a>
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