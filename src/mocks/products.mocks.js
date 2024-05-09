import { faker } from '@faker-js/faker/locale/es';

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 1, max: 100})
    }
}