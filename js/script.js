import { createElementWithClass } from "./utils.js";
import { username } from "./constants.js";

// Header
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("navigation-menu");
const closeBtn = document.querySelector(".close-btn i");

let menuActive = false;

menuBtn.addEventListener("click", (event) => {
  navMenu.classList.add("show");
  menuActive = true;
  event.stopPropagation();
});

closeBtn.addEventListener("click", (event) => {
  navMenu.classList.remove("show");
  menuActive = false;
});

document.addEventListener("click", (event) => {
  if (menuActive && !navMenu.contains(event.target)) {
    navMenu.classList.remove("show");
    event.preventDefault();
    menuActive = false;
  }
});

function createNavigationMenu() {
  const navList = document.getElementById("navigation-list");

  let navOne = document.createElement("li");
  let homeNav = document.createElement("a");
  let homeIcon = createElementWithClass("i", "fa-solid fa-house fa-3x");
  let homeText = document.createElement("p");
  homeText.textContent = "Home";
  homeNav.append(homeIcon, homeText);
  navOne.appendChild(homeNav);

  if (
    window.location.pathname.includes("account") ||
    window.location.pathname.includes("post")
  ) {
    homeNav.href = "../index.html";
  } else {
    homeNav.href = `index.html`;
  }

  const isUserLoggedIn = localStorage.getItem("accessToken") !== null;
  const userLoggedIn = JSON.parse(localStorage.getItem("user"));
  const owner = username;

  let navTwo = document.createElement("li");
  let createPostNav = document.createElement("a")
  let createPostIcon = createElementWithClass("i", "fa-solid fa-3x fa-file-circle-plus")
  let createPostText = document.createElement("p");
  createPostText.textContent = "New Post";
  createPostNav.append(createPostIcon, createPostText);
  navTwo.appendChild(createPostNav)

  if (window.location.pathname.includes("account")) {
    createPostNav.href = "../post/create.html";
  } else if (window.location.pathname.includes("post")) {
    createPostNav.href = "create.html";
  } else {
    createPostNav.href = "post/create.html";
  }

  let navThree = document.createElement("li");
  let accountNav = document.createElement("a");
  let loginIcon = createElementWithClass("i", "fa-solid fa-3x");
  let loginText = document.createElement("p");


  if (isUserLoggedIn) {
    loginIcon.classList.add("fa-right-from-bracket");
    loginText.textContent = "Logout";

    accountNav.addEventListener("click", (event) => {
      event.preventDefault();
      logoutUser();
    });
  } else {
    loginIcon.classList.add("fa-right-to-bracket");
    loginText.textContent = "Login";

    if (window.location.pathname.includes("account")) {
      accountNav.href = "login.html";
    } else if (window.location.pathname.includes("post")) {
      accountNav.href = `../account/login.html`;
    } else {
      accountNav.href = `account/login.html`;
    }
  }

  accountNav.append(loginIcon, loginText);
  navThree.appendChild(accountNav);

  if (userLoggedIn === owner) {
    navList.append(navOne, navTwo, navThree);
  } else {
    navList.append(navOne, navThree);
  }

}

function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  if (window.location.pathname.includes("account")) {
    window.location.href = "login.html";
  } else if (window.location.pathname.includes("post")) {
    window.location.href = "../account/login.html";
  } else {
    window.location.href = "account/login.html";
  }
}

createNavigationMenu();