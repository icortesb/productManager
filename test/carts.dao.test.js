import mongoose from "mongoose";
import { CartManager } from "../src/dao/mongo/controllers/cartManager.js";
import assert from "assert";
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../src/.env');

dotenvConfig({ path: envPath });

describe("Testing cartManager", function() {

    before(async function() {
        // Establecer conexión a MongoDB antes de todas las pruebas
        console.log(`Connecting to MongoDB...`)
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@proyectocoder.iu36jco.mongodb.net/test`, {
        });
    });

    beforeEach(function() {
        this.timeout(5000);
        this.cartManager = new CartManager();
    });

    after(async function() {
        // Cerrar conexión a MongoDB después de todas las pruebas
        await mongoose.connection.close();
    });

    it("should return an array with all carts", async function() {
        // Given
        console.log("Creating a new cart...");
        const newCart = await this.cartManager.newCart();
        console.log(`New cart created: ${JSON.stringify(newCart)}`);
    
        // When
        console.log("Getting all carts...");
        const response = await this.cartManager.getCarts();    
        // Then
        assert.strictEqual(Array.isArray(response), true);
    });

});
