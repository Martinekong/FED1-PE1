import { fetchPostById, createElementWithClass } from "./utils.js";
import { username } from "./constants.js";

async function setupPostPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id")

  const post = await fetchPostById(username, postId);

  displayPost(post);
};

setupPostPage();

function displayPost(postToDisplay) {
    const postContainer = document.getElementById("post-container");
  
    const postImg = createElementWithClass("img", "post-banner");
    postImg.src = postToDisplay.media.url;
    postImg.alt = postToDisplay.media.alt;
  
    const postInfo = createElementWithClass("div", "post-info");
  
    const authorInfo = createElementWithClass("div", "author-info");
  
    const authorImg = createElementWithClass("img", "author-img");
    authorImg.src = postToDisplay.author.avatar.url;
    authorImg.alt = postToDisplay.author.avatar.alt;
  
    const authorName = document.createElement("p");
    authorName.textContent = postToDisplay.author.name;
  
    const postPublished = document.createElement("p");
    postPublished.textContent = postToDisplay.created.slice(0,10);
  
    authorInfo.append(authorImg, authorName, postPublished);
  
    const postBtns = createElementWithClass("div", "post-btns");
    const editBtn = createElementWithClass("button", "primary-btn");
    editBtn.setAttribute("aria-label", "edit post");
    const editIcon = createElementWithClass("i", "fa-solid fa-pen")
    editBtn.appendChild(editIcon)

    const urlBtn = createElementWithClass("button", "secondary-btn");
    urlBtn.setAttribute("aria-label", "copy post url");
    const urlIcon = createElementWithClass("i", "fa-solid fa-link");
    urlBtn.appendChild(urlIcon);
  
    editPost(editBtn, postToDisplay.id, postBtns);
    copyURL(urlBtn, postBtns);
    
    postBtns.append(editBtn, urlBtn);
    postInfo.append(authorInfo, postBtns);
    
    const postTitle = document.createElement("h1");
    postTitle.textContent = postToDisplay.title;
    
    const postContent = document.createElement("p");
    postContent.innerHTML = postToDisplay.body.replace(/\n/g, "<br>");
    
    postContainer.append(postImg, postInfo, postTitle, postContent);
};

function editPost(button, postID, container) {
  button.addEventListener("click", () => {
    const isUserLoggedIn = localStorage.getItem("user") !== null;
    const userLoggedIn = JSON.parse(localStorage.getItem("user"));
    const owner = username;

    const overlay = createElementWithClass("div", "message");
    const overlayMessage = document.createElement("p");  

    if (userLoggedIn === owner) {
      window.location.href = `edit.html?id=${postID}`;
    } else if (isUserLoggedIn && userLoggedIn !== owner) {
      overlayMessage.textContent = "Only the author can edit this post"
      overlay.appendChild(overlayMessage)

      overlay.classList.add("message-visible");
      setTimeout(() => {
        overlay.classList.remove("message-visible");
      }, 4000)
      
      container.appendChild(overlay);
    } else {
      overlayMessage.textContent = "You need to be logged in to edit";
    
      const editLogin = document.createElement("a");
      editLogin.textContent = "Login";
      editLogin.href = "../account/login.html";    
  
      overlay.append(overlayMessage, editLogin);

      overlay.classList.add("message-visible");
      setTimeout(() => {
        overlay.classList.remove("message-visible");
      }, 4000)
      
      container.appendChild(overlay);
    }
  })
}

function copyURL(button, container) {
  button.addEventListener("click", () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);

    const UrlMessage = createElementWithClass("div", "message");

    const copied = document.createElement("p");
    copied.textContent = "URL copied to clipboard";  

    UrlMessage.appendChild(copied);

    UrlMessage.classList.add("message-visible");
    setTimeout(() => {
      UrlMessage.classList.remove("message-visible");
    }, 2000);

    container.appendChild(UrlMessage);
  })
}