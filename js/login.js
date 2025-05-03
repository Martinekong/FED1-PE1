import { NOROFF_API_URL } from "./constants.js";
import { displayOverlay } from "./utils.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    const missingMessage = "Please fill out both fields.";
    displayOverlay(missingMessage);
    return;
  }

  try {
    const response = await fetch(`${NOROFF_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const { data } = await response.json();

    if (!response.ok) {
      const errorMessage = "Invalid email or password";
      displayOverlay(errorMessage);  
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.name));

    const successMessage = "Success! Rederecting...";
    displayOverlay(successMessage);

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error("Error:", error);
    const failedMessage = "Login failed. Please try again!";
    displayOverlay(failedMessage);
  }
});