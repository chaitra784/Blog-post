const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getComments,
    createComment
} = require("../controllers/commentController");

router.get("/:postId", getComments);

router.post("/:postId", authMiddleware, createComment);

module.exports = router;