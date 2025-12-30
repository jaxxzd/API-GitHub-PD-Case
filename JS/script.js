// variável que pega o formulário do html como seletor

const formGetUserName = document.querySelector("#form-search-user");

// formulário com evento de envio com função assíncrona na arrow function

formGetUserName.addEventListener("submit", async (e) => {
    e.preventDefault(); // metodo que tira a configuração padrão do evento, nesse caso, pra evitar que fique carregando a página a cada busca através do formulário

    const inputGetUserName = e.target.querySelector("#input-search-user").value // através do alvo do evento transforma o seletor do input em valor e armazena todo esse conteúdo em uma variável
    const userData = await getUserGitHub(inputGetUserName); // recebe os dados do perfil do usuário através da requisição com a API do GitHub e armazena na variável

    if (userData) { // verifica se o usuário existe após a requisição da API com fetch
        const userRepo = await getUserRepo(inputGetUserName); // recebe os dados do repositório do usuário através da requisição com a API do GitHub e armazena na variável

        contentUserGitHubScreen(userData, userRepo); // pega as duas variáveis e define como valor de parâmetro pra função
    } else {
        alert("usuário não encontrado") // faz um alerta se o usuário não for encontrado
    }

});

async function getUserGitHub(u) { // função que recebe o valor digitado no input e coloca no endpoint pra procura o usuário
    const resp = await fetch(`https://api.github.com/users/${u}`);

    if (!resp.ok) { // verifica se a resposta está ok, se não, retorna null
        return null
    }

    const data = await resp.json(); // armazena na variável "data" a resposta do fetch com a url convertida em json
    return data // retorna os dados da variável "data" pra função
}

async function getUserRepo(u) { // função que obtêm no parãmetro (nome de usuário) o valor digitado no input
    const resp = await fetch(`https://api.github.com/users/${u}/repos?sort=created&per_page=6`); // pega o parâmetro e coloca no endpoint para buscar o usuário

    if (resp.ok) { // verifica se a resposta está ok, se não, retorna null
        const data = await resp.json(); // armazena na variável "data" a resposta do fetch com a url convertida em json
        return data // retorna os dados da variável "data" pra função
    }

}

function contentUserGitHubScreen(userData, userRepo) { // função que recebe como parâmetro as requisições com os dados do perfil do usuário e seus repositórios
    const sectionContentUserGitHubScreen = document.querySelector("#section-user"); // variável que recebe como valor, um seletor responsável pela seção dos dados do usuário de perfil

    const verifyItemIfNull = (value, html) => value ? html : ""; //  verifica se um dado do usuário no perfil existe, se não existir, excluir esse dado. Foi feito isso pra excluir principalmente o ícone de empresa e localização

    // seção recebe os dados do usuário de perfil e coloca ao HTML, dinamicamente feito pelo JavaScript
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

    const listRepo = document.querySelector("#list-repo"); // seletor responsável pelos repositórios do usuário é armazenado na variável
    listRepo.innerHTML = ""; // faz a limpeza dos repositórios

    userRepo.forEach(repo => { // é buscado cada um, os respositórios do usuário, buscado no input
        const li = document.createElement("li"); // cria tag li
        li.classList.add("list-item-repo"); // coloca seletor de classe

        // tag li recebe código HTML, dinamicamente pelo JavaScript
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

        // variável recebe como filho a própria estrutura do repositório
        listRepo.appendChild(li);
    });
}