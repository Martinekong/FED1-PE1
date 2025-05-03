import { POSTS_API } from "./constants.js";

export async function fetchAllPosts(username) {
  const loadingSpinner = document.getElementsByClassName("loading-spinner")
  try {
    Array.from(loadingSpinner).forEach(spinner => {
      spinner.classList.remove("hidden");
    });
    const response = await fetch(`${POSTS_API}/${username}`);
    const { data } = await response.json();
    return data;
  } catch(error) {
    console.error("Error fetching posts:", error)
    const latestPosts = document.getElementById("latest-posts");
    const postGrid = document.getElementById("grid");
    showFetchErrorMessage(latestPosts);
    showFetchErrorMessage(postGrid);

    const chevronBtns = document.getElementsByClassName("chevron-btn");
    Array.from(chevronBtns).forEach(btn => {
      btn.classList.add("hidden");
    });  

    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.classList.add("hidden");  
  } finally {
    Array.from(loadingSpinner).forEach(spinner => {
      spinner.classList.add("hidden")
    })
  }
}

export async function fetchPostById(username, postId) {
  const loadingSpinner = document.getElementById("loading-spinner")
  try {
    loadingSpinner.classList.remove("hidden");
    const response = await fetch(`${POSTS_API}/${username}/${postId}`);
    const { data } = await response.json();
    return data;
  } catch(error) {
    console.error("Error fetching post:", error);
    if (window.location.pathname.includes("post.html")) {
      const postContainer = document.getElementById("post-container");
      showFetchErrorMessage(postContainer);
    } else if (window.location.pathname.includes("edit.html")) {
      const editContainer = document.getElementById("edit-section");
      const editForm = document.getElementById("edit-form");
      editForm.classList.add("hidden");
      showFetchErrorMessage(editContainer);
    }
  } finally {
    loadingSpinner.classList.add("hidden");
  }
}

function showFetchErrorMessage(container) {
  const errorMessage = createElementWithClass("p", "error-message");
  errorMessage.textContent = "Something went wrong. Please try again!";
  container.appendChild(errorMessage);
}

export function createElementWithClass(elementType, className = "") {
  const element = document.createElement(elementType);
  if (className) {
    element.className = className;
  };
  return element;
}

export function displayOverlay(message) {
  const overlayBg = createElementWithClass("div", "overlay-bg");
  const overlay = createElementWithClass("div", "overlay");

  const overlayMessage = document.createElement("p");
  overlayMessage.textContent = message;

  if (
    message === "Success! Rederecting..." || 
    message === "Post updated successfully" || 
    message === "Post created successfully" ||
    message === "Post deleted successfully") {
    overlay.appendChild(overlayMessage);
    document.body.append(overlayBg, overlay);
    return;
  } else {
    const closeBtn = createElementWithClass("button", "secondary-btn");
    closeBtn.textContent = "OK";
  
    closeBtn.addEventListener("click", () => {
      overlayBg.remove();
      overlay.remove();
    });
  
    overlay.append(overlayMessage, closeBtn);
    document.body.append(overlayBg, overlay);
  }
}