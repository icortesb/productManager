export const compressString = async (req, res) => {
    let string = `Hola Coders, soy un string ridiculamente largo`

    for(let i = 0; i < 5e4; i++) {
        string += ` y este es el string numero ${i}`
    }

    res.send(string)
}