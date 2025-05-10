const router = require("express").Router();
const dashboardRoutes = require("./dashboard.route");



const userRoutes = require("./user.route");
const incomeRoutes = require("./income.route");
const savingsRoutes = require("./savings.route");
const budgetRoutes = require("./budget.route");
const profileRoutes= require("./profile.route")
const verifyToken = require("../middlewares/auth.middleware");

const { currentUser } = require("../controller/decodeToken.controller");

router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/dashboard", budgetRoutes);
router.use("/dashboard", incomeRoutes);
router.use("/dashboard", savingsRoutes);
router.use("/profile",profileRoutes)
router.get("/current-user", verifyToken, currentUser);

module.exports = router;

