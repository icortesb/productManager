import bcrypt from 'bcrypt';

export const createHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = async (user, password) => {
    let compare = bcrypt.compareSync(user.password, password);
    return compare;
}
