import bcrypt from 'bcrypt';

export const createHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = async (plain, hash) => {
    let compare = bcrypt.compareSync(plain, hash); //plaintext, hash
    return compare;
}
