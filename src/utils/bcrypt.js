import bcrypt from 'bcrypt';

export const createHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = async (plaintext, hash) => {
    let compare = bcrypt.compareSync(plaintext, hash);
    return compare;
}
