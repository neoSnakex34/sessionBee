import express from "express";
import objRoutes from "./obj/obj.routes.mjs";
import { retrieveSessionHandler, terminateSessionHandler } from "./session.controller.mjs";
import { idValidatorMiddleware } from "../../middlewares/idValidatorMiddleware.mjs";
import authMiddleware from "../../middlewares/auth.mjs";

const sessionRoutes = express.Router(); 

sessionRoutes.post('/:objId/start', idValidatorMiddleware, retrieveSessionHandler);
sessionRoutes.delete('/:objId/terminate', idValidatorMiddleware, authMiddleware, terminateSessionHandler);

sessionRoutes.use('/obj', objRoutes);

export default sessionRoutes;