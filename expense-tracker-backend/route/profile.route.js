const express = require("express");
const {
    updateEmail,
    verifyNewEmail,
    updatePassword,
    uploadProfilePicture,
} = require("../controller/profile.controller");
const upload = require("../middlewares/fileUpload.middleware");
const authenticateUser = require("../middlewares/auth.middleware");

const router = express.Router();

// Update email endpoint (change from POST to PATCH or PUT)
router.patch(
    "/update-email/:id",
    authenticateUser,
    updateEmail
);

// Verify new email endpoint (change from POST to PATCH or PUT)
router.patch(
    "/verify-new-email/:id",
    authenticateUser,
    verifyNewEmail
);

// Update password endpoint (change from POST to PATCH or PUT)
router.patch(
    "/update-password/:id",
    authenticateUser,
    updatePassword
);

// Upload profile picture endpoint remains POST since it creates a new resource (profile picture)
router.post(
    "/upload-picture/:id",
    authenticateUser,
    upload.single('profilePicture'),
    uploadProfilePicture
);

module.exports = router;
