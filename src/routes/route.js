const { Router } = require("express");
const { addTour, showTour, findSuitabel } = require("../contoller/controller");

const router = Router();
router.post("/addTour", addTour);

router.get("/showTour", showTour);
router.post("/find", findSuitabel);

module.exports = router;
