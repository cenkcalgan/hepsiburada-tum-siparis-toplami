const blockContainer = document.querySelector(".layout-container");
const totalPriceDiv = document.createElement("div");
totalPriceDiv.className = "price price__total";
let orderBlockElementsLength = 0;

function createStyle() {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
  .price{
    display: flex;
    justify-content: flex-end;
    font-size: 15px;
    font-weight: 700;
    padding: 10px 115px 10px 10px;
    border-radius: 10px;
    background-color: #eee;
    box-sizing: border-box;
  }
  .price span{
    color: #000;
    margin-right: 5px;
  }
  .price__subtotal{
    color: #439e4a;
    margin-top: 10px;
  }
  .price__total{
    color: #ff6600;
    position: fixed;
    padding: 10px 15px;
    border-radius: 10px;

    box-shadow: 0 4px 8px 0 rgba(0,0,0,.16);
    border: 1px solid rgba(0,0,0,.08);
  }
  @media(max-width: 767px){
    .price__subtotal{
      padding: 10px 78px 10px 10px;
    }
  }
  @media(max-width: 576px){
    .price__subtotal{
      font-size: 12px;
      padding: 10px;
      margin: 10px 15px 0;
    }
    .price__total{
      font-size: 12px;
      padding: 10px;
      margin: 5px 15px 0;
    }
  }
`;
  document.head.append(styleTag);
}

function convertCurrency(price) {
  return price.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });
}

function createSubtotalDiv(subtotal) {
  const subtotalDiv = document.createElement("div");
  subtotalDiv.className = "price price__subtotal";
  subtotalDiv.innerHTML = `<span>Ara Toplam :</span> ${convertCurrency(
    subtotal
  )}`;
  return subtotalDiv;
}

function removeSubtotalDiv(item) {
  document.removeChild(item);
}

function updateSubtotalDiv(subtotal) {
  return `<span>Ara Toplam :</span> ${convertCurrency(subtotal)}`;
}

function calculateOrderAmount() {
  const orderBlockElements = document.querySelectorAll(
    ".orders-page__groups__item"
  );
  let totalPrice = 0;

  orderBlockElementsLength = orderBlockElements.length;
  orderBlockElements.forEach((blockItem) => {
    let orderElements = blockItem.querySelectorAll(
      ".order-row__summary__price-and-date > b"
    );
    let subtotal = 0;
    orderElements.forEach((elementItem) => {
      let textContent = elementItem.textContent;

      subtotal += parseFloat(
        getPriceValueFromString(textContent).replace(".", "").replace(",", ".")
      );

      // elementItem.textContent
      // .replace(" TLKredi Kartı", "")
      // .replace(" TLHepsipay Cüzdanım", "")
      // .replace(".", "")
      // .replace(",", ".")
    });
    totalPrice += subtotal;

    const priceSubtotalDiv = blockItem.querySelector(".price__subtotal");
    // console.log("priceSubtotalDiv", priceSubtotalDiv);
    if (priceSubtotalDiv === null) {
      blockItem.append(createSubtotalDiv(subtotal));
    } else {
      priceSubtotalDiv.remove();
      blockItem.append(createSubtotalDiv(subtotal));
    }
  });
  totalPriceDiv.innerHTML = `<span>Genel Toplam :</span> ${convertCurrency(
    totalPrice
  )}`;
  document.querySelector(".layout-container").append(totalPriceDiv);
}

function getPriceValueFromString(textContent) {
  numbers = textContent.match(/([0-9].+\,?[0-9])/g);
  if (numbers) {
    return numbers[0];
  } else {
    return 0;
  }
}

function getElementDimensionPosition(element) {
  const rec = document.querySelector(element).getBoundingClientRect();
  return {
    top: rec.top + window.scrollY,
    left: rec.left + window.scrollX,
    width: rec.width,
  };
}

function totalPriceVerticalPosition() {
  const mainTitleDP = getElementDimensionPosition(".layout-container__title");
  if (document.querySelector("html").scrollTop > 100) {
    totalPriceDiv.style.top = "";
    if (window.innerWidth <= 576) {
      totalPriceDiv.style.bottom = "120px";
    } else {
      totalPriceDiv.style.bottom = "80px";
    }
  } else {
    totalPriceDiv.style.top = mainTitleDP.top - 8 + "px";
    totalPriceDiv.style.bottom = "";
  }
}

function resizeWindow() {
  const mainContainerDP = getElementDimensionPosition(".layout-container");
  const totalPriceDP = getElementDimensionPosition(".price__total");

  totalPriceVerticalPosition();

  if (window.innerWidth <= 576) {
    totalPriceDiv.style.left = "auto";
    totalPriceDiv.style.right = "0";
  } else if (window.innerWidth <= 768) {
    totalPriceDiv.style.left = "auto";
    totalPriceDiv.style.right = "15px";
  } else {
    totalPriceDiv.style.left =
      mainContainerDP.width - totalPriceDP.width + mainContainerDP.left + "px";
    totalPriceDiv.style.right = "";
  }
}

document.addEventListener("scroll", () => {
  calculateOrderAmount();
  totalPriceVerticalPosition();
});

window.addEventListener("resize", () => {
  resizeWindow();
});

setTimeout(() => {
  createStyle();
  calculateOrderAmount();
  resizeWindow();
}, 1000);
