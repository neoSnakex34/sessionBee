import express from "express";
import sessionRoutes from "./session/session.routes.mjs";

const router = express.Router();


router.use('/session', sessionRoutes);

// FIXME make a real healtcheck possibly
router.get('/hello', (req, res) => {
    res.json('world');
})


export default router;