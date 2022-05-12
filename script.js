// setting data base
const db = new Dexie("shoppingApp");
db.version(1).stores({ items: "++id ,name,price,isPurchased" });

//setting variables
const itemForm = document.querySelector("#item-form");
const itemDev = document.querySelector("#itemsdiv");
const totalPrice = document.querySelector("#totalpriced");

//making pupulate dev to get all dataBase items

const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray();
  
  //creating items dev
  itemDev.innerHTML = allItems.map(
    (item) =>
      ` 
          <div class="item ${item.isPurchased && "purchase"}" >
              <input type="checkbox" class="check-box" ${
                item.isPurchased && "checked" 
              } onchange="toggleItemStatus(event,${item.sid})">

              <div class="item-info  ">
                  <p>${item.name}</p>
                  <p>$ ${item.price} x ${item.quantity} </p>
              </div>
              <button class="delete-btn" onclick="removeItem(${item.sid})">
                  X
              </button>
          </div> 
             `
  ).join('')
  // array of total prices
  const arrayOfPrices = allItems.map((item) => item.price * item.quantity);
  const totalPrices = arrayOfPrices.reduce((a, b) => a + b, 0);
  totalPrice.innerText= 'total Price : $' + totalPrices;
};
//  window on load function
window.onload = populateItemsDiv;

// adding submit event
itemForm.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const price = document.querySelector("#price-input").value;
  const quantity = document.querySelector("#quantity-input").value;
  await db.items.add({ name, quantity, price });
  await populateItemsDiv()
};

// toggle item status 
const toggleItemStatus = async (event , sid )=>{
    await db.items.update(sid , {isPurchased : !! event.target.checked});
    await populateItemsDiv();
}
const removeItem = async (sid)=>{
    await db.items.delete(sid);
    await populateItemsDiv();
}