import { NOROFF_API_URL } from "./constants.js";
import { displayOverlay } from "./utils.js";

const registerForm = document.getElementById("register");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordRepeatInput = document.getElementById("repeat-password");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const repeatPassword = passwordRepeatInput.value.trim();

  if (password === repeatPassword) {
    try {
      const response = await fetch(`${NOROFF_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password}),
      });
  
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors[0].message;
        displayOverlay(errorMessage || "Something went wrong. Please try again.");
        return;
      }  

      const successMessage = "Success! Rederecting..."
      displayOverlay(successMessage);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000)
    } catch (error) {
      console.error("Error", error);
      const errorMessage = "Something went wrong. Please try again.";
      displayOverlay(errorMessage);
    }
  } else {
    const passwordMatchMessage = "Password does not match";
    displayOverlay(passwordMatchMessage);
  }
});