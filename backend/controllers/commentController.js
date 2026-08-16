const db = require("../config/db");

exports.getComments = async (req, res) => {

    try {

        const { postId } = req.params;

        const [comments] = await db.promise().query(`
            SELECT
                comments.id,
                comments.content,
                comments.user_id,
                comments.post_id,
                comments.created_at,
                users.name AS author
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.created_at ASC
        `, [postId]);

        res.json({
            success: true,
            data: comments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch comments"
        });
    }
};


exports.createComment = async (req, res) => {

    try {

        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            });
        }

        const [posts] = await db.promise().query(
            "SELECT id FROM posts WHERE id = ?",
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        await db.promise().query(
            "INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)",
            [content, req.user.id, postId]
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add comment"
        });
    }
};