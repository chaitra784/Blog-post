const params =
    new URLSearchParams(window.location.search);

const postId = params.get("id");

const token =
    localStorage.getItem("token");


async function loadPost() {

    const response =
        await fetch(`/api/posts/${postId}`);

    const data =
        await response.json();

    const container =
        document.getElementById("postContainer");

    if (!data.success) {

        container.innerHTML =
            "<h2>Post not found</h2>";

        return;
    }

    const post = data.data;

    container.innerHTML = `

        <h1>${escapeHTML(post.title)}</h1>

        <p class="author">
            By ${escapeHTML(post.author)}
        </p>

        <p>
            ${escapeHTML(post.content)}
        </p>

    `;
}


async function loadComments() {

    const response =
        await fetch(`/api/comments/${postId}`);

    const data =
        await response.json();

    const container =
        document.getElementById("comments");

    if (!data.success ||
        data.data.length === 0) {

        container.innerHTML =
            "<p>No comments yet.</p>";

        return;
    }

    container.innerHTML =
        data.data.map(comment => `

            <div class="comment">

                <strong>
                    ${escapeHTML(comment.author)}
                </strong>

                <p>
                    ${escapeHTML(comment.content)}
                </p>

            </div>

        `).join("");
}


function showCommentForm() {

    const container =
        document.getElementById(
            "commentFormContainer"
        );

    if (!token) {

        container.innerHTML = `
            <p>
                <a href="login.html">
                    Login
                </a>
                to add a comment.
            </p>
        `;

        return;
    }

    container.innerHTML = `

        <form id="commentForm">

            <textarea
                id="commentContent"
                placeholder="Write a comment..."
                required
            ></textarea>

            <button type="submit">
                Add Comment
            </button>

        </form>

        <p id="commentMessage"></p>

    `;

    document
        .getElementById("commentForm")
        .addEventListener(
            "submit",
            addComment
        );
}


async function addComment(e) {

    e.preventDefault();

    const content =
        document
        .getElementById("commentContent")
        .value;

    try {

        const response =
            await fetch(
                `/api/comments/${postId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        content
                    })
                }
            );

        const data =
            await response.json();

        document
            .getElementById("commentMessage")
            .textContent = data.message;

        if (data.success) {

            document
                .getElementById("commentContent")
                .value = "";

            loadComments();
        }

    } catch (error) {

        document
            .getElementById("commentMessage")
            .textContent =
            "Server error";
    }
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


loadPost();
loadComments();
showCommentForm();