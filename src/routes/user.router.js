const express = require("express");
const { User } = require("../model/user.model");
const { registerUser, getUser } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.get("/", getUser);

userRouter.post("/", registerUser);

module.exports = userRouter;