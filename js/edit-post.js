import { POSTS_API, username } from "./constants.js";
import { fetchPostById, displayOverlay, createElementWithClass } from "./utils.js";

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id")

async function setupEditPage() {
  const post = await fetchPostById(username, postId)

  showPostContent(post);
  editPostContent();
  deletePost();
}

setupEditPage();
 
function showPostContent(postToEdit) {
  const titleInput = document.getElementById("title");
  titleInput.value = postToEdit.title;

  const contentInput = document.getElementById("content");
  contentInput.value = postToEdit.body;

  const imageURLInput = document.getElementById("imageURL");
  imageURLInput.value = postToEdit.media.url;

  const imageALTInput = document.getElementById("imageALT");
  imageALTInput.value = postToEdit.media.alt;

  const tagsInput = document.getElementById("tags");
  tagsInput.value = postToEdit.tags.join(" ");
}


function editPostContent() {
  const submitBtn = document.getElementById("submit-btn")

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
  
    const accessToken = localStorage.getItem("accessToken");
    
    const updatedPost = {
      title: document.getElementById("title").value.trim(),
      body: document.getElementById("content").value.trim(),
      media: {
        url: document.getElementById("imageURL").value.trim(),
        alt: document.getElementById("imageALT").value.trim(),
      },
      tags: document.getElementById("tags").value.trim().split(" "),
    };
  
    try {
      const response = await fetch(`${POSTS_API}/${username}/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(updatedPost),
      });

      await response.json();
  
      if (!response.ok) {
        const failedMessage = "Failed to update post. Please try again.";
        displayOverlay(failedMessage);
        return;
      }
  
      const successMessage = "Post updated successfully";
      displayOverlay(successMessage);;
      setTimeout(() => {
        window.location.href = `post.html?id=${postId}`;
      }, 2000)
    } catch (error) {
      console.error("Error updating post:", error);
      const errorMessage = "Something went wrong. Please try again.";
      displayOverlay(errorMessage);
    }
  });
}

function deletePost() {
  const deleteBtn = document.getElementById("delete-btn")

  deleteBtn.addEventListener("click", async (event) => {
    event.preventDefault()

      const overlayBg = createElementWithClass("div", "overlay-bg");
      const overlay = createElementWithClass("div", "overlay");
      const overlayMessage = document.createElement("p");
      overlayMessage.textContent = "Are you sure you want to delete this post?";
    
      const yesBtn = createElementWithClass("button", "secondary-btn")
      yesBtn.textContent = "Delete"
    
      const cancelBtn = createElementWithClass("button", "primary-btn")
      cancelBtn.textContent = "Cancel"
    
      overlay.append(overlayMessage, yesBtn, cancelBtn);
      document.body.append(overlayBg, overlay);

      yesBtn.addEventListener("click", async (event) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
          const response = await fetch(`${POSTS_API}/${username}/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
      
          if (!response.ok) {
            const failedMessage = "Failed to delete post. Please try again.";
            displayOverlay(failedMessage);
            return;
          }
      
          const successMessage = "Post deleted successfully";
          displayOverlay(successMessage);
          overlayBg.remove();
          overlay.remove();
          setTimeout(() => {
            window.location.href = `../index.html`;
          }, 2000)
        } catch (error) {
          console.error("Error deleting post:", error);
          const errorMessage = "Something went wrong. Please try again.";
          displayOverlay(errorMessage);
        }    
      })

      cancelBtn.addEventListener("click", () => {
        overlayBg.remove();
        overlay.remove();
      });  
  })
}