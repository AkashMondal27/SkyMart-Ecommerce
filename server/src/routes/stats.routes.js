import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { getStats } from "../controllers/getState.controller.js";

const router = express.Router();

router.get("/", isAuth, getStats);

export default router;