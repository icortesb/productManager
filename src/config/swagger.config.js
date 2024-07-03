import __dirname from "../utils/dirname.js";
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación API - Curso Backend - Coderhouse",
            description: "API para uso de swagger en el curso de backend de Coderhouse"
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};
export default swaggerOptions;