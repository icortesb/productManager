import {Router} from "express";
import twilio from "twilio";

const routerTwilio = new Router();

routerTwilio.use("/sendSMS", async (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    let numbers = ["+541158583740"];
    let response = await client.messages.create({
        body: "Hola, esto es una prueba de SMS desde Twilio",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: numbers,
    });
    res.status(200).send(`SMS enviado correctamente ${response.sid}`);
});

export default routerTwilio;
