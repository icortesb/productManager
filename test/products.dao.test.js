import mongoose from "mongoose";
import Product from "../src/dao/mongo/models/product.model.js";
import Assert from "assert";

const assert = Assert.strict;

describe("Product", () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@proyectocoder.iu36jco.mongodb.net/test`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        });
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });

    before(function() {
        this.product = new Product({
            name: "Laptop",
            description: "Dell Laptop",
            price: 500,
        });
    })

    beforeEach(function() {
        this.timeout(5000);
    })
   
    
    it("should insert a product into collection", async () => {
        const product = new Product({
        name: "Laptop",
        description: "Dell Laptop",
        price: 500,
        });
        await product.save();
        const insertedProduct = await Product.findOne({ name: "Laptop" });
        Assert(insertedProduct.name === "Laptop");
    });
    
    it("should delete a product from collection", async () => {
        await Product.deleteOne({ name: "Laptop" });
        const deletedProduct = await Product.findOne({ name: "Laptop" });
        Assert(deletedProduct === null);
    });
    });