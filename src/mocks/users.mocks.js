import { faker } from "@faker-js/faker/locale/es";
import { generateProduct } from "./products.mocks.js";

export const generateUser = () => {
    const numOfProducts = faker.number.int({min: 1, max: 5});
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }
    return {
        id: faker.database.mongodbObjectId(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        sex: faker.person.sex(),
        role: faker.helpers.arrayElement(['admin', 'user']),
        products: products
    }
}