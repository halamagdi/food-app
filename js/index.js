const rowData = document.querySelector("#rowData"),
  search = document.querySelector("#search"),
  searchContainer = document.querySelector("#searchContainer"),
  nameSearchInput = document.querySelector("#nameSearch"),
  letterSearchInput = document.querySelector("#letterSearch"),
  categories = document.querySelector("#categories"),
  area = document.querySelector("#area");


// screen loading

$(document).ready(function () {
  closeNav(0);
  $("#loading .sk-circle").fadeOut(500, () => {
    $("#loading .sk-circle")
      .parent()
      .fadeOut(500, () => {
        $("#loading").remove();
      });
  });
});

// close sidenav
function closeNav(term) {
  let innerbar = $(".inner-sidebar").outerWidth();
  $(".sidebar").animate({ left: -innerbar }, term);
  $(".outter-bar i#toggleBtn").removeClass("fa-xmark").addClass("fa-bars");
  $("#navList li").animate({ paddingTop: "30px", opacity: "0" });
}
// open sidenav
function openNav() {
  $(".sidebar").animate({ left: 0 }, 500);
  $(".outter-bar i#toggleBtn").removeClass("fa-bars").addClass("fa-xmark");
  $("#navList li").animate({ paddingTop: "0px", opacity: "1" }, 1000);
}
// toggle sidenav
$("#toggleBtn").click(function () {
  if ($(".sidebar").css("left") == "0px") {
    closeNav(1000);
  } else {
    openNav();
  }
});

// get meals
async function getMeals() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  let data = await response.json();
  displayMeals(data.meals);
  closeNav(500);
}
// display meals

function displayMeals(arr) {
  let container = ``;
  for (let i = 0; i < arr.length; i++) {
    container += ` <div class="col-md-3">
    <div class="item position-relative rounded-2 overflow-hidden" onclick="mealDetails(${arr[i].idMeal})">
      <img src="${arr[i].strMealThumb}" class="w-100 rounded-2" alt="" />
      <div
        class="layer bg-white bg-opacity-75 position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center"
      >
        <h3 class="ps-2 fw-semibold">${arr[i].strMeal}</h3>
      </div>
    </div>
  </div>`;
  }
  rowData.innerHTML = container;
}
getMeals();

// meals details

async function mealDetails(idMeal) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i= ${idMeal}`
  );
  let data = await response.json();
  detailsDisplay(data.meals[0]);
  closeNav(500);
}

function detailsDisplay(arr) {
  let container = ``;
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (arr[`strIngredient${i}`]) {
      ingredients += `<li>${arr[`strMeasure${i}`]} ${
        arr[`strIngredient${i}`]
      }</li>`;
    }
    let strTag = arr.strTags?.split(",");
    if (!strTag) strTag = [];
    let tagList = strTag.map((elem) => `<li>${elem}</li>`).join("");

    container = `  <div class="col-md-4">
  <div class="item-details">
    <img src="${arr.strMealThumb}" class="w-100 mb-2 rounded-2" alt="">
    <h3 >${arr.strMeal}
    </h3>
  </div>
</div>
<div class="col-md-8">
  <div class="item-details">
  <h2>Instructions</h2>
  <p>${arr.strInstructions}</p>
    <h3><span class="fw-bold">Area : </span class="fw-bold">${arr.strArea}</h3>
    <h3><span class="fw-bold">Category : </span>${arr.strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="d-flex flex-wrap recipe-list ps-1">
    ${ingredients}
    </ul>
    <h3 class="mb-4">Tags : </h3>
    <ul class="d-flex flex-wrap list-unstyled tag-list">
      ${tagList}
    </ul>
    <div class="links mt-5">
    <a href="${arr.strSource}" target="_blank" rel="noopener noreferrer" class="bg-success py-2 px-3 text-decoration-none text-white rounded-2">Source</a>
    <a href="${arr.strYoutube}" target="_blank" rel="noopener noreferrer" class="bg-danger py-2 px-3 text-decoration-none text-white rounded-2">Youtube</a>

    </div>
  </div>
</div>`;
  }
  rowData.innerHTML = container;
}

// categories

async function getCategories() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();
  displayCategorie(data.categories);
  closeNav(500);
}

function displayCategorie(arr) {
  let container = ``;
  for (let i = 0; i < arr.length; i++) {
    container += ` <div class="col-md-3">
      <div class="item position-relative rounded-2 overflow-hidden" onclick="getCategoryMeals('${
        arr[i].strCategory
      }')">
        <img src="${arr[i].strCategoryThumb}" class="w-100 rounded-2" alt="" />
        <div
          class="layer bg-white bg-opacity-75 position-absolute top-0 bottom-0 start-0 end-0 text-center"
        >
          <h3 class="p-2 fw-semibold ">${arr[i].strCategory}</h3>
          <p class ="p-2">${arr[i].strCategoryDescription
            .split(" ")
            .slice(0, 20)
            .join(" ")}</p>
        </div>
      </div>
    </div>`;
  }
  rowData.innerHTML = container;
}
categories.addEventListener("click", () => {
  getCategories();
  rowData.classList.remove("d-none");
  searchContainer.classList.add("d-none");
});

// ingredients
async function getIngredients() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  displayIngredients(data.meals);
  closeNav(500);
}

function displayIngredients(arr) {
  let container = ``;
  for (let i = 0; i < 20; i++) {
    container += ` <div class="col-md-3 pe-0 text-center">
    <div class="item text-white ms-2 " onclick="getMainIngredientMeals('${
      arr[i].strIngredient
    }')">
    <i class="fa-solid fa-drumstick-bite"></i>
        <h3 class="ps-2 fw-semibold mb-2">${arr[i].strIngredient}</h3>
        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
    </div>
  </div>`;
  }
  rowData.innerHTML = container;
}

document.querySelector("#ingredient").addEventListener("click", () => {
  getIngredients();
  rowData.classList.remove("d-none");
  searchContainer.classList.add("d-none");
});

// get area
async function getArea() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  displayArea(data.meals);
  closeNav(500);
}
// display area

function displayArea(arr) {
  let container = ``;
  for (let i = 0; i < arr.length; i++) {
    container += ` <div class="col-md-3 pe-0 text-center">
    <div class="item text-white" onclick="getAreaMeals('${arr[i].strArea}')">
    <i class="fa-solid fa-house-laptop"></i>
        <h3 class="ps-2 fw-semibold">${arr[i].strArea}</h3>
    </div>
  </div>`;
  }
  rowData.innerHTML = container;
}

area.addEventListener("click", () => {
  getArea();
  rowData.classList.remove("d-none");
  searchContainer.classList.add("d-none");
});

// area meals
async function getAreaMeals(area) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();
  displayMeals(data.meals);
  closeNav(500);
}

// cattegory meals
async function getCategoryMeals(category) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();
  displayMeals(data.meals);
  closeNav(500);
}
// ingredient meals
async function getMainIngredientMeals(ingredient) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  let data = await response.json();
  displayMeals(data.meals);
  closeNav(500);
}

// search functionality

search.addEventListener("click", () => {
  searchContainer.classList.remove("d-none");
  rowData.classList.add("d-none");
  closeNav(500);
});

// search by name
async function getSearchByNameApi(term) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let data = await response.json();
  displayMeals(data.meals);
}

nameSearchInput.addEventListener("keyup", (e) => {
  getSearchByNameApi(e.target.value);
  rowData.classList.remove("d-none");
});
// search by first letter

async function getSearchByFirstLetter(term) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();
  displayMeals(data.meals);
}

letterSearchInput.addEventListener("keyup", (e) => {
  if (letterSearchInput.value !== "") getSearchByFirstLetter(e.target.value);
  else getMeals();
  rowData.classList.remove("d-none");
});

// show contact input
function contactUs() {
  closeNav(500);
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center ">
  <div class="container w-75 ">
    <div class="row">
      <div class="col-md-6">
        <input type="text" placeholder="Enter Your Name" class="form-control mb-4" id="name" onchange="validateName()">
        <p class="alert alert-danger d-none nameErrorAlert"></p>
       </div>
       <div class="col-md-6">
        <input type="email" placeholder="Enter Your Email" class="form-control mb-4" id="email" onchange="validateEmail()">
        <p class="alert alert-danger d-none emailErrorAlert  "></p>
       </div>
       <div class="col-md-6">
        <input type="text" placeholder="Enter Your Phone" class="form-control mb-4" id="phone" onchange="validatePhone()" >
        <p class="alert alert-danger d-none phoneErrorAlert "></p>
       </div>
       <div class="col-md-6">
        <input type="number" placeholder="Enter Your Age" class="form-control mb-4" id="age" onchange="validateAge()">
        <p class="alert alert-danger d-none ageErrorAlert "></p>
       </div>
       <div class="col-md-6">
        <input type="password" placeholder="Enter Your Password" class="form-control mb-4" id="password" onchange="validatePassword()">
        <p class="alert alert-danger d-none passErrorAlert"></p>
       </div>
       <div class="col-md-6">
        <input type="password" placeholder="Enter Your RePassword" class="form-control mb-4" id="rePassword" onchange="validateRePassword()">
        <p class="alert alert-danger d-none rePassErrorAlert "></p>
       </div>
    <button class="btn btn-outline-danger disabled w-auto mx-auto " id="submitBtn" onfocus = "disableBtn() ">Submit</button>

    </div>
  </div>

 </div>`;

  document.querySelector("#name").addEventListener("focus", () => {
    nameInputFocused = true;
  });
  document.querySelector("#email").addEventListener("focus", () => {
    emailInputFocused = true;
  });
  document.querySelector("#phone").addEventListener("focus", () => {
    phoneInputFocused = true;
  });
  document.querySelector("#age").addEventListener("focus", () => {
    ageInputFocused = true;
  });
  document.querySelector("#password").addEventListener("focus", () => {
    passwordInputFocused = true;
  });
  document.querySelector("#rePassword").addEventListener("focus", () => {
    rePasswordInputFocused = true;
  });
}

// regex
const nameRegex = /^[A-Za-z]{2,20}$/,
  emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,4}$/,
  phoneRegex = /^0{1}[0-9]{10}$/,
  ageRegex = /^[1-9]{2,3}$/,
  passwordRegex = /^\w{2,10}$/,
  rePasswordRegex = /^\w{2,10}$/;

let nameInputFocused = false,
  emailInputFocused = false,
  phoneInputFocused = false,
  ageInputFocused = false,
  passwordInputFocused = false,
  rePasswordInputFocused = false;

function validateName() {
  if (nameInputFocused) {
    if (nameRegex.test(document.querySelector("#name").value)) {
      document.querySelector(".nameErrorAlert").classList.add("d-none");
      return true;
    } else {
      document.querySelector(".nameErrorAlert").innerHTML =
        "Special characters and numbers not allowed";
      document.querySelector(".nameErrorAlert").classList.remove("d-none");
      return false;
    }
  }
}
function validateEmail() {
  if (emailInputFocused) {
    if (emailRegex.test(document.querySelector("#email").value)) {
      document.querySelector(".emailErrorAlert").classList.add("d-none");
      return true;
    } else {
      document.querySelector(".emailErrorAlert").innerHTML =
        "Email not valid *exemple@yyy.zzz";
      document.querySelector(".emailErrorAlert").classList.remove("d-none");
      return false;
    }
  }
}
function validatePhone() {
  if (phoneInputFocused) {
    if (phoneRegex.test(document.querySelector("#phone").value)) {
      document.querySelector(".phoneErrorAlert").classList.add("d-none");
      return true;
    } else {
      document.querySelector(".phoneErrorAlert").innerHTML =
        "Enter valid Phone Number";
      document.querySelector(".phoneErrorAlert").classList.remove("d-none");
      return false;
    }
  }
}
function validateAge() {
  if (ageInputFocused) {
    if (ageRegex.test(document.querySelector("#age").value)) {
      document.querySelector(".ageErrorAlert").classList.add("d-none");
      return true;
    } else {
      document.querySelector(".ageErrorAlert").innerHTML = "Enter valid age";
      document.querySelector(".ageErrorAlert").classList.remove("d-none");
      return false;
    }
  }
}
function validatePassword() {
  if (passwordInputFocused) {
    if (passwordRegex.test(document.querySelector("#password").value)) {
      document.querySelector(".passErrorAlert").classList.add("d-none");
      return true;
    } else {
      document.querySelector(".passErrorAlert").innerHTML =
        "Enter valid password *Minimum two characters, at least one letter and one number:*";
      document.querySelector(".passErrorAlert").classList.remove("d-none");
      return false;
    }
  }
}
function validateRePassword() {
  if (rePasswordInputFocused) {
    if (rePasswordRegex.test(document.querySelector("#rePassword").value)) {
      document.querySelector(".rePassErrorAlert").classList.add("d-none");
      return true;
    } else {
      document.querySelector(".rePassErrorAlert").innerHTML =
        "Enter valid repassword";
      document.querySelector(".rePassErrorAlert").classList.remove("d-none");
      return false;
    }
  }
}

function disableBtn() {
  if (
    validateName() &&
    validateEmail() &&
    validateAge() &&
    validatePhone() &&
    validatePassword() &&
    validateRePassword()
  ) {
    document.querySelector("#submitBtn").classList.remove("disabled");
  } else {
    document.querySelector("#submitBtn").classList.add("disabled");
  }
}
