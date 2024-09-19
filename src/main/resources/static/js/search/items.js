const jwt = localStorage.getItem("token");
if (!jwt) location.href = "/views/login";

const pageForm = document.getElementById("page-form");
const pageInput = pageForm.querySelector("input");
const searchParams = new URLSearchParams(location.search);

pageForm.addEventListener("submit", e => {
  e.preventDefault();
  const page = parseInt(pageInput.value) - 1;
  searchParams.set("page", page.toString());
  location.href = `/views/search/items?${searchParams}`;
});

const itemsContainer = document.getElementById("items-container");
const setData = (shopsPage) => {
  const { content, page } = shopsPage;
  if (content.length === 0)
    pageInput.disabled = true;
  else pageInput.max = page.totalPages;

  if (content.length === 0) {
    const messageHead = document.createElement("h3");
    messageHead.innerText = "No Items";
    shopsContainer.append(messageHead);
    return;
  }

  const containerFluid = document.createElement("div");
  containerFluid.className = "container-fluid";
  const row = document.createElement("div");
  row.className = "row gx-5 gy-4";
  content.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    const card = document.createElement("div");
    card.className = "card w-100";
    const img = document.createElement("img");
    img.src = item.img ?? "/static/img/item.png";
    img.className = "card-img-top p-3";
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = item.name;

    const subtitle = document.createElement("h6");
    subtitle.className = "card-subtitle mb-2 text-body-secondary";
    subtitle.innerText = item.shop.name;

    const info = document.createElement("p");
    info.className = "card-text";
    info.innerText = `price: ${item.price}\nstock: ${item.stock}`;

    const link = document.createElement("a");
    link.className = "card-link";
    link.href = `/views/shops/${item.shop.id}/items/${item.id}`;
    link.innerText = "Go See";

    body.append(title, subtitle, info, link);
    card.append(img, body);
    col.append(card);
    row.append(col);
  });
  containerFluid.append(row);
  itemsContainer.append(containerFluid);
}

fetch(`/search/items?${searchParams}`, {
  headers: {
    "Authorization": `Bearer ${jwt}`,
  },
}).then(response => {
  if (!response.ok) {
    localStorage.removeItem("token");
    location.href = "/views/login";
  }
  return response.json();
}).then(setData);

const shopCriteriaSelect = document.getElementById("shop-criteria-select");
const shopNameSearchForm = document.getElementById("shop-name-search-form");
const shopCategorySearchForm = document.getElementById("shop-category-search-form");
shopCriteriaSelect.addEventListener("change", e => {
  const value = shopCriteriaSelect.value;
  if (value === "name") {
    shopNameSearchForm.classList.remove("d-none");
    shopCategorySearchForm.classList.add("d-none");
  }
  else {
    shopNameSearchForm.classList.add("d-none");
    shopCategorySearchForm.classList.remove("d-none");
  }
});

const shopNameInput = shopNameSearchForm.querySelector("input");
const shopCategorySelect = shopCategorySearchForm.querySelector("select");
shopNameSearchForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = shopNameInput.value;
  if (!value) return;
  location.href = `/views/search/shops?name=${value}`;
});
shopCategorySearchForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = shopCategorySelect.value;
  if (!value) return;
  location.href = `/views/search/shops?category=${value}`;
})

const itemCriteriaSelect = document.getElementById("item-criteria-select");
const itemNameSearchForm = document.getElementById("item-name-search-form");
const itemPriceSearchForm = document.getElementById("item-price-search-form");
itemCriteriaSelect.addEventListener("change", e => {
  const value = itemCriteriaSelect.value;
  if (value === "name") {
    itemNameSearchForm.classList.remove("d-none");
    itemPriceSearchForm.classList.add("d-none");
  }
  else {
    itemNameSearchForm.classList.add("d-none");
    itemPriceSearchForm.classList.remove("d-none");
  }
});

const itemNameInput = itemNameSearchForm.querySelector("input");
const itemMinPriceInput = document.getElementById("item-min-price-input");
const itemMaxPriceInput = document.getElementById("item-max-price-input");
itemNameSearchForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = itemNameInput.value;
  if (!value) return;
  location.href = `/views/search/items?name=${value}`;
});
itemPriceSearchForm.addEventListener("submit", e => {
  e.preventDefault();
  const minValue = itemMinPriceInput.value === "" ? null : itemMinPriceInput.value;
  const maxValue = itemMaxPriceInput.value === "" ? null : itemMaxPriceInput.value;
  if (minValue === null && maxValue === null) return;
  location.href = `/views/search/items?priceFloor=${minValue}&priceCeil=${maxValue}`;
});