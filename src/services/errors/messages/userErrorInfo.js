export const generateUserErrorInfoSP = (user) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        -> username: type String, recibido: ${typeof user.user.user}
        -> password: type String, recibido: ${typeof user.user.password}
`;
}

export const generateUserErrorInfoENG = (user) => {
    return `One or more properties were sent incomplete or are not valid.
    List of required properties:
        -> username: type String, received: ${JSON.stringify(user)}
        -> password: type String, received: ${JSON.stringify(user)}
`;
}