import { fetchAllPosts, createElementWithClass } from "./utils.js";
import { username } from "./constants.js";

let blogPosts = [];
let filteredPosts = [];

async function setupIndex() {
  blogPosts = await fetchAllPosts(username);
  filteredPosts = [...blogPosts];

  createLatestCarousel(blogPosts)
  updateGrid();

  searchGridPosts();
  sortGridPosts();
  filterGridPosts();
}

setupIndex()

function createLatestCarousel(postsToDisplay) {
  const carousel = document.getElementById("latest-carousel");
  carousel.innerHTML = "";

  const cardContainer = createElementWithClass("div", "card-container");

  const latestPosts = [...postsToDisplay]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 3);

  latestPosts.forEach((post) => {
    const card = createElementWithClass("a", "card large-card");
    card.href = `post/post.html?id=${post.id}`;

    const cardImg = document.createElement("img");
    cardImg.src = post.media.url;
    cardImg.alt = post.media.alt;

    const cardInfo = createElementWithClass("div", "card-info");
    const cardTitle = document.createElement("h3");
    cardTitle.textContent = post.title;
    const cardBody = document.createElement("p");
    cardBody.textContent = `${post.body.slice(0, 200)}...`;
    const postBtn = createElementWithClass("button", "primary-btn");
    postBtn.textContent = "read more";

    cardInfo.append(cardTitle, cardBody, postBtn);
    card.append(cardImg, cardInfo);
    cardContainer.appendChild(card);
  })

  carousel.appendChild(cardContainer);
  setupCarousel()
};

function setupCarousel() {
  const cardContainer = document.querySelector(".card-container");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentIndex = 0;
  let cards = document.querySelectorAll(".large-card");
  let totalCards = cards.length;

  function updateCarousel() {
    const offset = -currentIndex * 100;
    cardContainer.style.transform = `translateX(${offset}%)`;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  updateCarousel();
}

function updateGrid() {
  createBlogGrid(filteredPosts.slice(0, 12));
  showGridPagination();
}

function createBlogGrid(postsToDisplay) {
  const postGrid = document.getElementById("post-grid");
  postGrid.innerHTML = "";

  postsToDisplay.forEach((post) => {
    const card = createElementWithClass("a", "card small-card");
    card.href = `post/post.html?id=${post.id}`;

    const postImg = document.createElement("img");
    postImg.src = post.media.url;
    postImg.alt = post.media.alt;

    const postInfo = createElementWithClass("div", "card-info");
    const postTitle = document.createElement("h3");
    postTitle.textContent = post.title;
    const postBody = document.createElement("p");
    postBody.textContent = `${post.body.slice(0, 100)}...`;

    const postBtn = createElementWithClass("button", "secondary-btn post-btn");
    postBtn.textContent = "read more";

    postInfo.append(postTitle, postBody);
    card.append(postImg, postInfo, postBtn);
    postGrid.appendChild(card);
  });
}

function showGridPagination() {
  const loadMoreBtn = document.getElementById("load-more-btn");
  if (!loadMoreBtn) return;

  let displayedPostsCount = 12;

  loadMoreBtn.style.display = filteredPosts.length > displayedPostsCount ? "flex" : "none";

  loadMoreBtn.addEventListener("click", () => {
    displayedPostsCount += 12;
    createBlogGrid(filteredPosts.slice(0, displayedPostsCount));

    if (displayedPostsCount >= filteredPosts.length) {
      loadMoreBtn.style.display = "none";
    }
  });
}

function searchGridPosts() {
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    filteredPosts = blogPosts.filter((post) => 
      post.title.toLowerCase().includes(searchText) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchText))
    );

    updateGrid();
  });
}

function sortGridPosts() {
  const sortBtn = document.getElementById("sort");
  const sortIcon = document.getElementById("sort-icon");
  let isNewestFirst = true;

  sortBtn.addEventListener("click", () => {
    isNewestFirst = !isNewestFirst;

    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);

      return isNewestFirst ? dateB - dateA : dateA - dateB;
    });

    if (isNewestFirst) {
      sortIcon.classList.remove("fa-arrow-up-short-wide");
      sortIcon.classList.add("fa-arrow-down-wide-short");
    } else {
      sortIcon.classList.remove("fa-arrow-down-wide-short");
      sortIcon.classList.add("fa-arrow-up-short-wide");
    }

    updateGrid();
  });
}

function filterGridPosts() {
  const filterBtn = document.getElementById("filter");

  filterBtn.addEventListener("click", () => {
    const overlayBg = createElementWithClass("div", "overlay-bg");
    const overlay = createElementWithClass("div", "overlay");

    const categories = ["Cardio", "Strength", "Recovery", "Nutrition"];
    
    const allLabel = document.createElement("label");
    const allCheckbox = document.createElement("input");
    allCheckbox.type = "checkbox";
    allCheckbox.value = "all";
    allCheckbox.checked = true;
    allLabel.append(allCheckbox, document.createTextNode("All posts"));

    const checkboxes = categories.map(category => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = category.toLowerCase();
      label.append(checkbox, document.createTextNode(category));
      return label;
    });

    const applyFilterBtn = createElementWithClass("button", "primary-btn");
    applyFilterBtn.textContent = "Apply Filter";

    overlay.appendChild(allLabel);
    checkboxes.forEach(label => overlay.appendChild(label));
    overlay.appendChild(applyFilterBtn);
    document.body.append(overlayBg, overlay);

    allCheckbox.addEventListener("change", () => {
      if (allCheckbox.checked) {
        checkboxes.forEach(label => label.querySelector("input").checked = false);
      }
    });

    checkboxes.forEach(label => {
      label.querySelector("input").addEventListener("change", () => {
        if (label.querySelector("input").checked) {
          allCheckbox.checked = false;
        }
      });
    });

    applyFilterBtn.addEventListener("click", () => {
      overlayBg.remove();
      overlay.remove();

      if (allCheckbox.checked) {
        filteredPosts = [...blogPosts];
      } else {
        const selectedFilters = checkboxes
          .filter(label => label.querySelector("input").checked)
          .map(label => label.querySelector("input").value);

        filteredPosts = blogPosts.filter(post =>
          post.tags.some(tag => selectedFilters.includes(tag.toLowerCase()))
        );
      };

      updateGrid();
    });
  });
}

function addBackToTopBtn() {
  const topBtn = createElementWithClass("button", "secondary-btn top-btn");
  topBtn.setAttribute("aria-label", "Back to top");
  const topIcon = createElementWithClass("i", "fa-solid fa-chevron-up");
  topBtn.appendChild(topIcon);
  document.body.appendChild(topBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 1600) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  });

  topBtn.addEventListener("click", () => {
    const gridSection = document.getElementById("grid");
    gridSection.scrollIntoView({ behavior: "smooth" });
  });
}

addBackToTopBtn();