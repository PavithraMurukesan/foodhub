const foods = [
    {
        id: 1,
        name: "Pizza",
        category: "Pizza",
        price: 249,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        id: 2,
        name: "Burger",
        category: "Burger",
        price: 179,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 3,
        name: "Noodles",
        category: "Noodles",
        price: 149,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"
    },
    {
        id: 4,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 299,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"
    },
    {
        id: 5,
        name: "Cheese Burger",
        category: "Burger",
        price: 219,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 6,
        name: "French Fries",
        category: "Burger",
        price: 99,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 7,
        name: "Cold Coffee",
        category: "Drinks",
        price: 99,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
    },
    {
        id: 8,
        name: "Fresh Juice",
        category: "Drinks",
        price: 79,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"
    },
    {
        id: 9,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 149,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    },
    {
        id: 10,
        name: "Ice Cream",
        category: "Dessert",
        price: 89,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"
    }
];

let cart = JSON.parse(localStorage.getItem("foodieCart")) || [];

function updateCartCount() {
    let count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.querySelectorAll("#cartCount").forEach(element => {
        element.textContent = count;
    });
}

function updateWishlistCount() {
    let wishlist =
        JSON.parse(localStorage.getItem("foodieWishlist")) || [];

    document.querySelectorAll("#wishlistCount").forEach(element => {
        element.textContent = wishlist.length;
    });
}

function addToCart(id) {
    let item = cart.find(food => food.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    localStorage.setItem("foodieCart", JSON.stringify(cart));
    updateWishlistCount();

    updateCartCount();

    alert("Food added to cart!");
}

// DISPLAY FOOD ITEMS
function displayFoods(items, container) {
    if (!container) return;

    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<h3>No food found!</h3>";
        return;
    }

    items.forEach(food => {
        container.innerHTML += `
            <div class="food-card">
                <img src="${food.image}" alt="${food.name}">

                <h3>${food.name}</h3>

                <p>Category: ${food.category}</p>

                <h4>₹${food.price}</h4>

                <button onclick="addToCart(${food.id})">
                    Add to Cart
                </button>

                <button class="wishlist-btn"
                    onclick="addToWishlist(${food.id})">
                    ❤️ Add to Wishlist
                </button>
            </div>
        `;
    });
}
// HOME PAGE
const homeContainer = document.getElementById("foodContainer");

if (homeContainer) {
    displayFoods(foods.slice(0, 3), homeContainer);

    document.getElementById("foodSearch")
        .addEventListener("input", function() {

            let value = this.value.toLowerCase().trim();

            let filtered = foods.filter(food =>
                food.name.toLowerCase().includes(value)
            );

            displayFoods(filtered, homeContainer);
        });
}

// MENU PAGE
const menuContainer = document.getElementById("menuContainer");

if (menuContainer) {

    let selectedCategory = "All";

    function filterMenu() {

        let searchValue = document
            .getElementById("menuSearch")
            .value.toLowerCase().trim();

        let filtered = foods.filter(food => {

            let categoryMatch =
                selectedCategory === "All" ||
                food.category === selectedCategory;
            let searchMatch =
                food.name.toLowerCase().includes(searchValue) ||
                food.category.toLowerCase().includes(searchValue);

            return categoryMatch && searchMatch;
        });

        displayFoods(filtered, menuContainer);
    }

    document.getElementById("menuSearch")
        .addEventListener("input", filterMenu);

    document.querySelectorAll(".category-buttons button")
        .forEach(button => {

            button.addEventListener("click", function() {

                let activeButton = document.querySelector(
    ".category-buttons .active"
);

if (activeButton) {
    activeButton.classList.remove("active");
}

                this.classList.add("active");

                selectedCategory = this.dataset.category;

                filterMenu();
            });
        });

    filterMenu();
}

updateCartCount();
// CART PAGE

const cartContainer = document.getElementById("cartItems");

function renderCart() {

    if (!cartContainer) return;

    cart = JSON.parse(localStorage.getItem("foodieCart")) || [];

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart is Empty! 🛒</h2>
                <p>Add your favourite food from our menu.</p>
                <a href="menu.html">Explore Menu</a>
            </div>
        `;

        document.getElementById("subtotal").textContent = "₹0";
        document.getElementById("delivery").textContent = "₹0";
        document.getElementById("grandTotal").textContent = "₹0";

        updateCartCount();
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {

        let food = foods.find(f => f.id === item.id);

        if (!food) return;

        let itemTotal = food.price * item.quantity;

        subtotal += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">

                <img src="${food.image}" alt="${food.name}">

                <div class="cart-details">
                    <h3>${food.name}</h3>
                    <p>Price: ₹${food.price}</p>
                    <p>Item Total: ₹${itemTotal}</p>

                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${food.id}, -1)">−</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${food.id}, 1)">+</button>
                    </div>

                    <button class="remove-btn"
                        onclick="removeFromCart(${food.id})">
                        Remove
                    </button>
                </div>

            </div>
        `;
    });

    let deliveryFee = subtotal > 0 ? 40 : 0;
    let grandTotal = subtotal + deliveryFee;

    document.getElementById("subtotal").textContent = "₹" + subtotal;
    document.getElementById("delivery").textContent = "₹" + deliveryFee;
    document.getElementById("grandTotal").textContent = "₹" + grandTotal;

    updateCartCount();
}

function changeQuantity(id, change) {

    let item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    localStorage.setItem("foodieCart", JSON.stringify(cart));

    renderCart();
}

function removeFromCart(id) {

    cart = cart.filter(food => food.id !== id);

    localStorage.setItem("foodieCart", JSON.stringify(cart));
    updateWishlistCount();

    renderCart();
}

// Checkout button
const checkoutButton = document.getElementById("checkoutBtn");

if (checkoutButton) {

    checkoutButton.addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            window.location.href = "checkout.html";
        }

    });
}

renderCart();

// FOODIEHUB CHECKOUT

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        let currentCart = JSON.parse(
            localStorage.getItem("foodieCart")
        ) || [];

        if (currentCart.length === 0) {
            alert("Your cart is empty! Please add food first.");
            window.location.href = "menu.html";
            return;
        }

        let customerName = document.getElementById("customerName").value.trim();
        let mobile = document.getElementById("mobile").value.trim();
        let address = document.getElementById("address").value.trim();

        let paymentElement = document.querySelector(
            'input[name="payment"]:checked'
        );

        if (!customerName || !mobile || !address) {
            alert("Please fill all delivery details.");
            return;
        }

        if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            alert("Please enter a valid 10 digit mobile number.");
            return;
        }

        if (!paymentElement) {
            alert("Please select a payment method.");
            return;
        }

        let payment = paymentElement.value;

        let subtotal = 0;

        currentCart.forEach(function(item) {
            let food = foods.find(f => f.id === Number(item.id));

            if (food) {
                subtotal += food.price * item.quantity;
            }
        });

        if (subtotal === 0) {
            alert("Food details not found. Please add food again.");
            return;
        }

        let couponCode = localStorage.getItem("foodieCoupon");
        let discountPercent = Number(
            localStorage.getItem("foodieCouponDiscount")
        ) || 0;

        let enteredCoupon = document.getElementById("couponCode");
        let discountAmount = 0;

        if (
            couponCode === "FOODIE10" &&
            discountPercent === 10 &&
            enteredCoupon &&
            enteredCoupon.value.trim().toUpperCase() === "FOODIE10"
        ) {
            discountAmount = Math.round(subtotal * discountPercent / 100);
        } else {
            couponCode = "";
        }

        let deliveryFee = 40;
        let grandTotal = subtotal - discountAmount + deliveryFee;

        const placeOrderBtn = document.getElementById("placeOrderBtn");

        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = "Placing Order...";
        }

        try {
            // GitHub Pages demo: save order in browser only.
            // No PHP or database connection is used here.

            let order = {
                orderId: "FH" + Date.now(),
                customerName: customerName,
                mobile: mobile,
                address: address,
                paymentMethod: payment,

                paymentStatus:
                    payment === "Cash on Delivery"
                    ? "Pay on delivery"
                    : "Not paid - Demo only",

                items: currentCart.map(function(item) {
                    let food = foods.find(
                        f => f.id === Number(item.id)
                    );

                    return {
                        id: item.id,
                        name: food ? food.name : "Food Item",
                        price: food ? food.price : 0,
                        quantity: item.quantity
                    };
                }),

                subtotal: subtotal,
                couponCode: couponCode || "No Coupon",
                discountAmount: discountAmount,
                deliveryFee: deliveryFee,
                grandTotal: grandTotal,
                trackingStartTime: Date.now(),
                orderDate: new Date().toLocaleString()
            };

            localStorage.setItem("foodieOrder", JSON.stringify(order));

            localStorage.removeItem("foodieCart");
            localStorage.removeItem("foodieCoupon");
            localStorage.removeItem("foodieCouponDiscount");

            alert(
                "Thank you " + customerName +
                "!\nYour demo order was placed successfully." +
                "\nOrder ID: " + order.orderId +
                "\nFinal Total: ₹" + grandTotal
            );

            window.location.href = "success.html";

        } catch (error) {
            alert("Order failed: " + error.message);

            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = "Place Order";
            }
        }
    });
}
// ORDER SUCCESS PAGE

const orderIdElement = document.getElementById("orderId");

if (orderIdElement) {

    let order = JSON.parse(
        localStorage.getItem("foodieOrder")
    );

    if (order) {

        document.getElementById("orderId").textContent =
            order.orderId || "Not Available";

        document.getElementById("successName").textContent =
            order.customerName || "Not Available";

        document.getElementById("successPayment").textContent =
            order.paymentMethod || "Not Available";

        document.getElementById("successTotal").textContent =
            "₹" + (order.grandTotal || 0);

        document.getElementById("successDate").textContent =
            order.orderDate || "Not Available";

    } else {

        document.querySelector(".order-details").innerHTML =
            "<h2>Order details not found!</h2>";

    }
}
// MY ORDERS PAGE

const ordersList = document.getElementById("ordersList");

if (ordersList) {

    let order = JSON.parse(
        localStorage.getItem("foodieOrder")
    );

    if (!order) {

        ordersList.innerHTML = `
            <div class="empty-orders">
                <h2>No Orders Found! 📦</h2>
                <p>You haven't placed any orders yet.</p>
                <a href="menu.html">Explore Menu</a>
            </div>
        `;

    } else {

        let foodNames = order.items.map(function(item) {
            return item.name || "Food Item";
        }).join(", ");

        ordersList.innerHTML = `
            <div class="order-card">

                <h2>Order Details</h2>

                <p><b>Order ID:</b> ${order.orderId}</p>

                <p><b>Customer:</b> ${order.customerName}</p>

                <p><b>Food Items:</b> ${foodNames}</p>

                <p><b>Payment:</b> ${order.paymentMethod}</p>

                <p><b>Total Amount:</b> ₹${order.grandTotal}</p>

                <p><b>Order Date:</b> ${order.orderDate}</p>

                <span class="order-status">
                    Order Placed
                </span>

            </div>
        `;
    }
}
/* =================================
   FOODIEHUB AUTOMATIC ORDER TRACKING
================================= */

function startOrderTracking() {

    let order = JSON.parse(
        localStorage.getItem("foodieOrder")
    );

    if (!order) {
        let statusElement = document.getElementById("orderStatus");
        let messageElement = document.getElementById("deliveryMessage");

        if (statusElement) {
            statusElement.innerText = "No Order Found";
        }

        if (messageElement) {
            messageElement.innerText =
                "Please order some delicious food first!";
        }

        return;
    }

    // Order start time
    let placedTime = order.trackingStartTime;

    if (!placedTime) {
        placedTime = Date.now();

        order.trackingStartTime = placedTime;

        localStorage.setItem(
            "foodieOrder",
            JSON.stringify(order)
        );
    }

    // Calculate elapsed seconds
    let elapsedSeconds = Math.floor(
        (Date.now() - placedTime) / 1000
    );

    // Automatic status
    let status = "Order Placed";
    let message = "Your order has been received!";

    if (elapsedSeconds >= 30) {

        status = "Delivered";
        message = "Your order has been delivered. Enjoy your food!";

    } else if (elapsedSeconds >= 20) {

        status = "Out for Delivery";
        message = "Your order is on the way!";

    } else if (elapsedSeconds >= 10) {

        status = "Preparing Your Food";
        message = "Your delicious food is being prepared!";

    }

    // Save current status
    localStorage.setItem(
        "foodieOrderStatus",
        status
    );

    // Display status
    let statusElement = document.getElementById("orderStatus");

    let messageElement = document.getElementById("deliveryMessage");

    if (statusElement) {
        statusElement.innerText = status;
    }

    if (messageElement) {
        messageElement.innerText = message;
    }
}

// Start tracking only on My Orders page
if (document.getElementById("orderStatus")) {

    startOrderTracking();

    setInterval(function () {
        startOrderTracking();
    }, 1000);

}
//contact
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        alert("Thank you! Your message has been received.");

        contactForm.reset();
    });
}
// FoodieHub Dynamic Payment Selection

const paymentRadios = document.querySelectorAll(
    'input[name="payment"]'
);

const paymentDetails = document.getElementById("paymentDetails");

function updatePaymentDetails() {

    if (!paymentDetails) return;

    const selected = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!selected) return;

    const method = selected.value;

    paymentDetails.innerHTML = "";

    if (method === "UPI") {

        paymentDetails.innerHTML = `
            <h3>📱 UPI Payment</h3>
            <label>Demo UPI ID</label>
            <input type="text"
                placeholder="example@upi">
            <p>Enter a sample UPI ID for this demo.</p>
        `;

    } else if (method === "Debit Card") {

    paymentDetails.innerHTML = `
        <h3>💳 Debit Card Payment</h3>

        <label>Demo Account Number</label>
        <input type="text"
            placeholder="Enter account number">

        <label>Demo MPIN</label>
        <input type="password"
            placeholder="Enter MPIN">

        <p>Demo details only. Do not enter real banking information.</p>
    `;

   } else if (method === "Credit Card") {

    paymentDetails.innerHTML = `
        <h3>💳 Credit Card Payment</h3>

        <label>Demo Account Number</label>
        <input type="text"
            placeholder="Enter account number">

        <label>Demo MPIN</label>
        <input type="password"
            placeholder="Enter MPIN">

        <p>Demo details only. Do not enter real banking information.</p>
    `;

    } else if (method === "Net Banking") {

    paymentDetails.innerHTML = `
        <h3>🏦 Net Banking</h3>

        <label>Select Bank</label>
        <select id="bankName">
            <option value="">Choose Your Bank</option>
            <option>SBI</option>
            <option>Indian Bank</option>
            <option>Canara Bank</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
        </select>

        <div id="bankDetails"></div>
    `;

    const bankName = document.getElementById("bankName");
    const bankDetails = document.getElementById("bankDetails");

    bankName.addEventListener("change", function() {

        if (bankName.value !== "") {

            bankDetails.innerHTML = `
                <h4>${bankName.value} Selected</h4>

                <label>Demo Account Number</label>
                <input type="text"
                    placeholder="Enter account number">

                <label>Demo MPIN</label>
                <input type="password"
                    placeholder="Enter MPIN">

                <p class="payment-note">
                    Demo fields only. Do not enter real banking credentials.
                </p>
            `;

        } else {
            bankDetails.innerHTML = "";
        }
    });

    } else if (method === "Cash on Delivery") {

        paymentDetails.innerHTML = `
            <h3>💵 Cash on Delivery</h3>
            <p>Pay when your food is delivered!</p>
        `;
    }
}

paymentRadios.forEach(function(radio) {
    radio.addEventListener("change", updatePaymentDetails);
});

updatePaymentDetails();

// FOODIEHUB COUPON FEATURE

const couponInput = document.getElementById("couponCode");
const applyCouponBtn = document.getElementById("applyCoupon");
const couponMessage = document.getElementById("couponMessage");

if (couponInput && applyCouponBtn && couponMessage) {

    applyCouponBtn.addEventListener("click", function() {

        const enteredCode = couponInput.value.trim().toUpperCase();

        if (enteredCode === "FOODIE10") {

            localStorage.setItem("foodieCoupon", "FOODIE10");
            localStorage.setItem("foodieCouponDiscount", "10");

            couponMessage.innerText =
                "🎉 Coupon applied! You are eligible for 10% discount.";

            couponMessage.style.color = "green";

        } else {

            localStorage.removeItem("foodieCoupon");
            localStorage.removeItem("foodieCouponDiscount");

            couponMessage.innerText =
                "❌ Invalid coupon code. Please try again.";

            couponMessage.style.color = "red";
        }
    });
}

// WISHLIST FEATURE

function addToWishlist(foodId) {
    let wishlist =
        JSON.parse(localStorage.getItem("foodieWishlist")) || [];

    if (wishlist.includes(foodId)) {
        alert("Already added to Wishlist ❤️");
        return;
    }

    wishlist.push(foodId);

    localStorage.setItem(
        "foodieWishlist",
        JSON.stringify(wishlist)
    );
     renderWishlistInCart();
    alert("Food added to Wishlist successfully! ❤️");
}

// WISHLIST PAGE

const wishlistContainer = document.getElementById("wishlistContainer");

function displayWishlist() {
    if (!wishlistContainer) return;

    let wishlist =
        JSON.parse(localStorage.getItem("foodieWishlist")) || [];

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your Wishlist is Empty! ❤️</h2>
                <p>Add your favourite foods from the menu.</p>
                <a href="menu.html">Explore Menu</a>
            </div>
        `;
        return;
    }

    wishlist.forEach(id => {
        let food = foods.find(item => item.id === id);

        if (!food) return;

        wishlistContainer.innerHTML += `
            <div class="food-card">
                <img src="${food.image}" alt="${food.name}">
                <h3>${food.name}</h3>
                <p>Category: ${food.category}</p>
                <h4>₹${food.price}</h4>

                <button onclick="addToCart(${food.id})">
                    Add to Cart 🛒
                </button>

                <button class="remove-btn"
                    onclick="removeFromWishlist(${food.id})">
                    Remove ❤️
                </button>
            </div>
        `;
    });
}

function removeFromWishlist(foodId) {
    let wishlist =
        JSON.parse(localStorage.getItem("foodieWishlist")) || [];

    wishlist = wishlist.filter(id => id !== foodId);

    localStorage.setItem("foodieWishlist", JSON.stringify(wishlist));

    displayWishlist();
}

displayWishlist();

// FOOD RATING AND REVIEW

const reviewForm = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

function displayReviews() {
    if (!reviewsList) return;

    let reviews =
        JSON.parse(localStorage.getItem("foodieReviews")) || [];

    reviewsList.innerHTML = "<h2>Customer Reviews ⭐</h2>";

    if (reviews.length === 0) {
        reviewsList.innerHTML += "<p>No reviews yet!</p>";
        return;
    }

    reviews.forEach(review => {
        let card = document.createElement("div");
        card.className = "review-card";

        let name = document.createElement("h3");
        name.textContent = review.name;

        let rating = document.createElement("p");
        rating.textContent = "Rating: " + "⭐".repeat(review.rating);

        let message = document.createElement("p");
        message.textContent = review.message;

        card.append(name, rating, message);
        reviewsList.appendChild(card);
    });
}

if (reviewForm) {
    reviewForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById("reviewName").value.trim();
        let rating = Number(document.getElementById("foodRating").value);
        let message = document.getElementById("reviewText").value.trim();

        if (!name || !rating || !message) {
            alert("Please fill all review details!");
            return;
        }

        let reviews =
            JSON.parse(localStorage.getItem("foodieReviews")) || [];

        reviews.unshift({
            name: name,
            rating: rating,
            message: message
        });

        localStorage.setItem("foodieReviews", JSON.stringify(reviews));

        alert("Thank you for your review! ❤️");

        reviewForm.reset();
        displayReviews();
    });
}

displayReviews();

function renderWishlistInCart() {
    const wishlistContainer = document.getElementById("wishlistItems");

    if (!wishlistContainer) return;

    let wishlist =
        JSON.parse(localStorage.getItem("foodieWishlist")) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML =
            "<p>Wishlist empty ah irukku.</p>";
        return;
    }

    wishlistContainer.innerHTML = "";

    wishlist.forEach(foodId => {
        const food = foods.find(item => String(item.id) === String(foodId));

        if (!food) return;

        wishlistContainer.innerHTML += `
            <div class="wishlist-item">
                <img src="${food.image}" alt="${food.name}" width="100">

                <h3>${food.name}</h3>
                <p>₹${food.price}</p>

                <button onclick="addToCart(${food.id})">
                    Add to Cart
                </button>

                <button onclick="removeFromCartWishlist(${food.id})">
                    Remove
                </button>
            </div>
        `;
    });
}

function removeFromCartWishlist(foodId) {
    let wishlist =
        JSON.parse(localStorage.getItem("foodieWishlist")) || [];

    wishlist = wishlist.filter(id => id !== foodId);

    localStorage.setItem(
        "foodieWishlist",
        JSON.stringify(wishlist)
    );

    renderWishlistInCart();
}
