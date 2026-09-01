import { Router } from "express";
import { getTeamMatchesController } from "../controllers/match";
import { getBournemouthMatchesController } from "../controllers/testMatch";

const router = Router();

router.get("/matches", getTeamMatchesController);
router.get("/bournemouth/matches", getBournemouthMatchesController);

export default router;