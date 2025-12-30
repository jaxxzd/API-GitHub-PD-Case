const formGetUserName = document.querySelector("#form-search-user");

formGetUserName.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputGetUserName = e.target.querySelector("#input-search-user").value
    const userData = await getUserGitHub(inputGetUserName);
    const userRepo = await getUserRepo(inputGetUserName);

    contentUserGitHubScreen(userData, userRepo);
});

async function getUserGitHub(u) {
    const resp = await fetch(`https://api.github.com/users/${u}`);

    if (!resp.ok) {
        return null
    }

    const data = await resp.json();
    return data
}

async function getUserRepo(u) {
    const resp = await fetch(`https://api.github.com/users/${u}/repos?sort=created&per_page=6`);

    if (!resp.ok) {
        return null
    }

    const data = await resp.json();
    return data
}

function contentUserGitHubScreen(userData, userRepo) {
    const sectionContentUserGitHubScreen = document.querySelector("#section-user");

    const verifyItemIfNull = (value, html) => value ? html : "";

    sectionContentUserGitHubScreen.innerHTML = `
        <img src="${userData.avatar_url}" alt="${userData.name || ""}" id="user-img">
        <div id="container-user-repo-top">
            <h2 id="user-name">${userData.name || ""}</h2>
        </div>
        <h3 id="user-login">${userData.login}</h3>
        <p id="user-bio">${userData.bio || ""}</p>
        <div id="container-follow">
            <div id="user-followers-container">
                <i class="fa-solid fa-users"></i>
                <span id="user-followers">${userData.followers}</span>
                seguidores
            </div>
            <span>|</span>
            <div id="user-following-container">
                <span id="user-following">${userData.following}</span>
                seguindo
            </div>
        </div>

        ${verifyItemIfNull(userData.company, `
            <div id="container-company-location">
                <i class="fa-regular fa-building"></i>
                <span id="user-location">${userData.company}</span>
            </div>
        `)}

        ${verifyItemIfNull(userData.location, `
            <div id="container-company-location">
                <i class="fa-solid fa-globe"></i>
                <span id="user-location">${userData.location}</span>
            </div>
        `)}
    `
    
    const listRepo = document.querySelector("#list-repo");
    listRepo.innerHTML = "";

    userRepo.forEach(repo => {
        const li = document.createElement("li");
        li.classList.add("list-item-repo");

        li.innerHTML = `
            <div class="container-top-repo">
                <div class="title-repo-container">
                    <i class="fa-solid fa-map-pin"></i>
                    <a href="${repo.html_url}" target="_blank" class="user-name-repo">${repo.name || "Não possui    nome"}</a>
                </div>
                <span class="user-view">${userData.user_view_type}</span>
            </div>

            <p class="user-desc-repo">${repo.description || "Não possui descrição"}</p>

            <div class="created-data-repo">
                <p>${new Intl.DateTimeFormat("pt-BR").format(new Date(repo.created_at))}</p>
            </div>
        `

        listRepo.appendChild(li);
    });
}