let allPosts = [];


async function loadPosts() {

    const container =
        document.getElementById("postsContainer");

    try {

        const response =
            await fetch("/api/posts");

        const data =
            await response.json();

        if (!data.success) {

            container.innerHTML =
                "<p>Unable to load posts.</p>";

            return;
        }

        allPosts = data.data;

        displayPosts(allPosts);

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


function displayPosts(posts) {

    const container =
        document.getElementById("postsContainer");

    if (posts.length === 0) {

        container.innerHTML = `
            <div class="post-card">
                <h2>No posts found</h2>
                <p>Try a different search.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = posts.map(post => `

        <div class="post-card">

            <h2>${escapeHTML(post.title)}</h2>

            <p class="author">
                By ${escapeHTML(post.author)}
            </p>

            <p>
                ${escapeHTML(
                    post.content.substring(0, 200)
                )}${post.content.length > 200 ? "..." : ""}
            </p>

            <a href="post.html?id=${post.id}">
                Read More
            </a>

        </div>

    `).join("");
}


function searchPosts() {

    const searchInput =
        document.getElementById("searchInput");

    const searchText =
        searchInput.value.toLowerCase().trim();

    const filteredPosts =
        allPosts.filter(post => {

            return (
                post.title.toLowerCase().includes(searchText) ||
                post.content.toLowerCase().includes(searchText) ||
                post.author.toLowerCase().includes(searchText)
            );

        });

    displayPosts(filteredPosts);
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function updateNavbar() {

    const token =
        localStorage.getItem("token");

    const loginLink =
        document.getElementById("loginLink");

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (token) {

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "inline-block";
        }

    } else {

        if (loginLink) {
            loginLink.style.display = "inline";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }
    }
}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}


loadPosts();
updateNavbar();