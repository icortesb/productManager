import {Router} from "express";

const loggerRouter = new Router();

loggerRouter.get("/", (req, res) => {
    res.send("Logger");
});
