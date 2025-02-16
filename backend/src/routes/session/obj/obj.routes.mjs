import express from "express";
import authMiddleware from "../../../middlewares/auth.mjs";
import { idValidatorMiddleware } from "../../../middlewares/idValidatorMiddleware.mjs";
import { litObjHandler, unlitObjHandler } from "./obj.controller.mjs";

const objRoutes = express.Router(); 

// TODO change
objRoutes.post('/:objId/turnOff', idValidatorMiddleware, authMiddleware,  unlitObjHandler);
objRoutes.post('/:objId/turnOn', idValidatorMiddleware, authMiddleware, litObjHandler);

export default objRoutes;