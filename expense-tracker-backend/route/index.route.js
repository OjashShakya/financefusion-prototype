const router = require("express").Router();
const dashboardRoutes = require("./dashboard.route");



const userRoutes = require("./user.route");
const incomeRoutes = require("./income.route");
const savingsRoutes = require("./savings.route");
const verifyToken = require("../middlewares/auth.middleware");

const { currentUser } = require("../controller/decodeToken.controller");

router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/dashboard", incomeRoutes);
router.use("/dashboard", savingsRoutes);
router.get("/current-user", verifyToken, currentUser);

module.exports = router;

