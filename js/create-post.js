import { POSTS_API, username } from "./constants.js";
import { displayOverlay } from "./utils.js";

async function createPost() {
  const createForm = document.getElementById("create-form");

  createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newPost = {
      title: document.getElementById("title").value.trim(),
      body: document.getElementById("content").value.trim(),
      tags: document.getElementById("tags").value.trim().split(" "),
      media: {
        url: document.getElementById("imageURL").value.trim(),
        alt: document.getElementById("imageALT").value.trim(),
      },
    };

    const accessToken = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(`${POSTS_API}/${username}`, {
       method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${accessToken}`
         },
         body: JSON.stringify(newPost),
       });
    
       await response.json();
      
       if (!response.ok) {
        const failedMessage = "Failed to create post. Please try again.";
        displayOverlay(failedMessage);
        return;
       }
  
       const successMessage = "Post created successfully";
       displayOverlay(successMessage);
       setTimeout(() => {
         window.location.href = "../index.html";
       }, 2000);
    } catch (error) {
       console.error("Error creating post:", error);
       const errorMessage = "Something went wrong. Please try again.";
       displayOverlay(errorMessage); 
    }
  }  
)}

createPost()