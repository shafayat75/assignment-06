// *****
// Showing Category
// *****
let allCategoryContainer = document.querySelector(".all-category");
let mobileAllCategoryContainer = document.querySelector(".mobile-all-category");
let categoryBtn = document.querySelector(".category-btn");

const loadCategory = async () => {
  loadingSpinner(true, allCategoryContainer);
  let categoriesUrl = "https://openapi.programming-hero.com/api/categories";

  let response = await fetch(categoriesUrl);
  let data = await response.json();
  displayCategory(data.categories);
};

const displayCategory = (categories) => {
  loadingSpinner(false);
  let categoryList = categories
    .map((category) => {
      return `
        <li onclick="loadCategoryItem(${category.id})" id="${category.id}" class="category-${category.id} category cursor-pointer bg-gray-200 md:bg-transparent hover:bg-[#15803D] hover:text-white py-2 px-3 rounded-sm">
            ${category.category_name}
        </li>
    `;
    })
    .join(" ");

  const allTreesItem = ` 
      <li onclick="loadCategoryItem('plants')" id="plants" class="category-plants category cursor-pointer bg-gray-200 md:bg-transparent hover:bg-[#15803D] hover:text-white py-2 px-3 rounded-sm">
          All Trees
      </li>`;

  allCategoryContainer.innerHTML = categoryList;
  allCategoryContainer.insertAdjacentHTML("afterbegin", allTreesItem);
  mobileAllCategoryContainer.innerHTML = categoryList;
  mobileAllCategoryContainer.insertAdjacentHTML("afterbegin", allTreesItem);
};
// For Small Device
categoryBtn.addEventListener("click", () => {
  document.querySelector(".arrow-down").classList.toggle("rotate-180");
  mobileAllCategoryContainer.classList.toggle("min-h-[0px]");
  mobileAllCategoryContainer.classList.toggle("max-h-[250px]");
});

// *****
// Showing Category Item as a Card
// *****
let cardContainer = document.querySelector(".card-container");

const loadCategoryItem = async (id) => {
  console.log(id);
  loadingSpinner(true, cardContainer);
  let categoryItemUrl =
    id === "plants"
      ? `https://openapi.programming-hero.com/api/${id}`
      : `https://openapi.programming-hero.com/api/category/${id}`;
  let response = await fetch(categoryItemUrl);
  let data = await response.json();
  displayCategoryItem(data.plants);
  addActiveClass(`category-${id}`);
};

const displayCategoryItem = (categoryItems) => {
  loadingSpinner(false);
  cardContainer.innerHTML = categoryItems
    .map((item) => {
      return `
            <div class="card-item flex flex-col justify-between p-3 bg-white rounded-md shadow-md overflow-hidden">
             <div class="w-full h-full max-h-[230px] md:max-h-[206px] object-cover overflow-hidden"> 
                <img class="w-full h-full bg-cover object-cover rounded-md" src="${item.image}" alt="" />
              </div>

              <h2 onclick="loadDetails(${item.id})" class="font-bold mb-3 mt-3 cursor-pointer">${item.name}</h2>
              <p class="text-sm text-[#1F2937]/80 mb-3">
                ${item.description}
              </p>

              <div class="flex justify-between items-center">
                <span
                  class="text-[#15803D] bg-[#DCFCE7] py-2 px-3 rounded-[35px]"
                  >${item.category}</span
                >
                <span class="font-medium">$${item.price}</span>
              </div>

              <button
                onclick="addToCart('${item.name}', ${item.price}, '${item.id}')"
                class="add-cart-btn btn bg-[#15803D] text-white rounded-3xl w-full py-3 mt-3"
              >
                Add to Card
              </button>
            </div>
        `;
    })
    .join(" ");
};

const removeActiveClass = () => {
  let allCategory = document.querySelectorAll(".category");
  allCategory.forEach((category) => {
    category.classList.remove("bg-[#15803D]", "text-white");
    category.classList.add("bg-gray-200", "md:bg-transparent");
  });
};

const addActiveClass = (className) => {
  removeActiveClass();

  let clickedItem = document.querySelectorAll(`.${className}`);
  clickedItem.forEach((clicked) => {
    clicked.classList.remove("bg-gray-200", "md:bg-transparent");
    clicked.classList.add("bg-[#15803D]", "text-white");
  });
};

// *****
// Add to Cart Functionality
// *****

let cart = [];
let cartContainer = document.querySelector(".cart-container");
let totalCart = document.querySelector(".total-cart");

const addToCart = (treeName, price, id) => {
  let count = 1;
  let matchedItem = cart.find((cartItem) => cartItem.id === id);

  if (matchedItem) {
    matchedItem.price += price;
    matchedItem.count += 1;
    displayAddToCart(id);
    sumOfTotalPrice();
    return;
  }

  cart.unshift({ treeName, price, id, count });
  displayAddToCart(id);
  sumOfTotalPrice();
  totalCart.innerText = cart.length;
};

const removeCart = (id) => {
  cart = cart.filter((cartItem) => cartItem.id !== id);

  displayAddToCart();
  sumOfTotalPrice();
  totalCart.innerText = cart.length;
};

const displayAddToCart = () => {
  cartContainer.innerHTML = cart
    .map((cartItem) => {
      return `
        <div class="flex items-center justify-between p-2 rounded-sm bg-[#F0FDF4] cursor-pointer">
            <div>
              <h2 class="font-bold mb-1">${cartItem.treeName}</h2>
              <span class="text-[#1F2937]/50">৳ ${
                cartItem.price / cartItem.count
              } x ${cartItem.count}</span> = ${cartItem.price}
            </div>
            <span onclick="removeCart('${
              cartItem.id
            }')" class="cursor-pointer bg-gray-100 p-2 rounded-md text-red-600/70"><i class="fa-solid fa-trash text-sm"></i></span>
        </div>
    `;
    })
    .join(" ");
};

// *****
// Total Price of Add To Card Added
// *****
let totalPrice = document.querySelector(".total-price");

const sumOfTotalPrice = () => {
  let total = cart.reduce((sum, cartItem) => {
    sum += cartItem.price;
    return sum;
  }, 0);
  totalPrice.innerText = total;
};

// *****
// Loading Spinner Functionality
// *****
const loadingSpinner = (status, place) => {
  if (status) {
    place.innerHTML = `<div class="col-span-full text-center mt-20"><span class="loading loading-dots loading-xl"></span></div>`;
  }
};

// Showing Dialog Box for every single card detail
let dialogBox = document.getElementById("card_details");
const loadDetails = async (id) => {
  dialogBox.showModal();
  let detailsUrl = `https://openapi.programming-hero.com/api/plant/${id}`;

  let response = await fetch(detailsUrl);
  let data = await response.json();

  displayDetails(data.plants);
};

const displayDetails = (detail) => {
  dialogBox.innerHTML = `
   <div class="modal-box p-3">
      <div> 
        <h1 class="text-2xl font-bold mb-2">${detail.name} <h1>
        <div class="w-full max-h-[320px] overflow-hidden">
          <img class="w-full h-full aspect-video object-cover  rounded-md" src="${detail.image}"> 
        </div>
        <p class="mt-2"> <span class="font-bold">Category:</span> ${detail.category}</p>
        <p class="mt-2"> <span class="font-bold">Price:</span> $ ${detail.price}</p>
        <p class="mt-2"> <span class="font-bold">Description:</span> ${detail.description}</p>


      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
  </div>
  `;
};

loadCategory();
loadCategoryItem("plants");