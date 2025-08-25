const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const profileContainer = document.getElementById("profile-container");
const errorContainer = document.getElementById("error-container");
const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const joinedDateElement = document.getElementById("joined-date");
const profileLink = document.getElementById("profile-link");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");
const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const emailElement = document.getElementById("email");
const companyContainer = document.getElementById("company-container");
const blogContainer = document.getElementById("blog-container");
const emailContainer = document.getElementById("email-container");
const reposContainer = document.getElementById("repos-container");

searchBtn.addEventListener("click", searchUser);
searchInput.addEventListener("keypress", (e)=>{
  if(e.key === "Enter"){
    searchUser();
  }
});

async function searchUser(){
  const username = searchInput.value.trim();
  if(!username) return alert("Please Enter a Username");
  
  try {
    profileContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");

    // ✅ no token in frontend
    const response = await fetch(`https://api.github.com/users/${username}`);

    if(!response.ok) throw new Error("User not found");
    const userData = await response.json();

    displayUserData(userData);

    fetchRepositories(userData.repos_url);
  } catch (error) {
    showError();
  }
}

function displayUserData(user){
  avatar.src = user.avatar_url;
  nameElement.textContent = user.name || user.login;
  usernameElement.textContent = `@${user.login}`;
  bioElement.textContent = user.bio || "No bio available";

  locationElement.textContent = user.location || "Not Specified";
  joinedDateElement.textContent = formatDate(user.created_at) || "Not Specified";

  profileLink.href = user.html_url;
  followers.textContent = user.followers;
  following.textContent = user.following;
  repos.textContent = user.public_repos;

  companyElement.textContent = user.company || "Not Specified";

  if (user.blog) {
    blogElement.textContent = user.blog;
    blogElement.href = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
  } else {
    blogElement.textContent = "No website";
    blogElement.href = "#";
  }

  if (user.email) {
    // Email exists
    emailElement.textContent = user.email;
    emailElement.href = `https://mail.google.com/mail/?view=cm&to=${user.email}`;
    emailElement.target = "_blank";
  } else {
    // Email is private: show placeholder, still opens Gmail
    const fakeEmail = "example@gmail.com"; // placeholder
    emailElement.textContent = fakeEmail;
    emailElement.href = `https://mail.google.com/mail/?view=cm&to=${fakeEmail}`;
    emailElement.target = "_blank";
  }



  profileContainer.classList.remove("hidden");
}

function showError(){
  errorContainer.classList.remove("hidden");
  profileContainer.classList.add("hidden");
}

function formatDate(date){
  return new Date(date).toLocaleDateString("en-US", {
    year:"numeric",
    month: "short",
    day:"numeric"
  });
}

async function fetchRepositories(reposUrl){
  reposContainer.innerHTML = '<div class="loading-repos">Loading Repositories...</div>';

  try {
    const response = await fetch(reposUrl);
    const repos = await response.json();
    displayRepos(repos);

  } catch (error) {
    reposContainer.innerHTML = `<div class="no-repos">No repositories found</div>`;
  }
}

function displayRepos(repos){
  if(repos.length === 0) {
    reposContainer.innerHTML = `<div class="no-repos">No repositories found</div>`;
    return;
  }
  reposContainer.innerHTML="";
  
  repos.forEach(repo => {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";

    const updatedAt = formatDate(repo.updated_at);

    repoCard.innerHTML = `
      <a href="${repo.html_url}" target="_blank" class="repo-name">
        <i class="fas fa-code-branch"></i> ${repo.name}
      </a>
      <p class="repo-description">${repo.description || "No description available"}</p>
      <div class="repo-meta">
        ${repo.language ? `<div class="repo-meta-item"><i class="fas fa-circle"></i> ${repo.language}</div>` : ""}
        <div class="repo-meta-item"><i class="fas fa-star"></i> ${repo.stargazers_count}</div>
        <div class="repo-meta-item"><i class="fas fa-code-fork"></i> ${repo.forks_count}</div>
        <div class="repo-meta-item"><i class="fas fa-history"></i> ${updatedAt}</div>
      </div>
    `;

    reposContainer.appendChild(repoCard);
  });
}

// Default search
searchInput.value = "github";
searchUser();
