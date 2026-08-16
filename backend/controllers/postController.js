const db = require("../config/db");

exports.getAllPosts = async (req, res) => {

    try {

        const [posts] = await db.promise().query(`
            SELECT
                posts.id,
                posts.title,
                posts.content,
                posts.user_id,
                posts.created_at,
                posts.updated_at,
                users.name AS author
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC
        `);

        res.json({
            success: true,
            data: posts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch posts"
        });
    }
};


exports.getPostById = async (req, res) => {

    try {

        const { id } = req.params;

        const [posts] = await db.promise().query(`
            SELECT
                posts.id,
                posts.title,
                posts.content,
                posts.user_id,
                posts.created_at,
                posts.updated_at,
                users.name AS author
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `, [id]);

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            data: posts[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch post"
        });
    }
};


exports.createPost = async (req, res) => {

    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const [result] = await db.promise().query(
            "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
            [title, content, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            postId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create post"
        });
    }
};


exports.updatePost = async (req, res) => {

    try {

        const { id } = req.params;
        const { title, content } = req.body;

        const [posts] = await db.promise().query(
            "SELECT * FROM posts WHERE id = ?",
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (posts[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can edit only your own posts"
            });
        }

        await db.promise().query(
            "UPDATE posts SET title = ?, content = ? WHERE id = ?",
            [title, content, id]
        );

        res.json({
            success: true,
            message: "Post updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update post"
        });
    }
};


exports.deletePost = async (req, res) => {

    try {

        const { id } = req.params;

        const [posts] = await db.promise().query(
            "SELECT * FROM posts WHERE id = ?",
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (posts[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your own posts"
            });
        }

        await db.promise().query(
            "DELETE FROM posts WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete post"
        });
    }
};