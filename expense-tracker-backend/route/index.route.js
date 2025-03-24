const router = require("express").Router();




const userRoutes = require("./user.route");
const verifyToken = require("../middlewares/auth.middleware");

const { currentUser } = require("../controller/decodeToken.controller");

router.use("/users", userRoutes);
router.get("/current-user", verifyToken, currentUser);

module.exports = router;

