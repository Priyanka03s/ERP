let currentRole = ""; // Declare currentRole variable

const adminCredentials = {
  username: "admin", // Replace with actual admin username
  password: "123", // Replace with actual admin password
};

// Event listener for Admin Login button
document.getElementById("adminBtn").addEventListener("click", function () {
  currentRole = "Admin";
  displayLoginForm(currentRole);
});

// Event listener for Vendor Login button
document.addEventListener("DOMContentLoaded", function () {
  const vendorBtn = document.getElementById("vendorBtn");

  if (vendorBtn) {
    vendorBtn.addEventListener("click", function () {
      currentRole = "Vendor";
      displayLoginForm(currentRole);
    });
  }
});

// Event listener for Login form submission
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (currentRole === "Admin") {
      // Admin login logic
      if (
        username === adminCredentials.username &&
        password === adminCredentials.password
      ) {
        // Successful login for admin
        window.location.href = "admin_dashboard.html"; // Redirect to admin dashboard
      } else {
        document.getElementById("error-message").textContent =
          "Invalid admin credentials";
      }
    } else if (currentRole === "Vendor") {
      // Vendor login logic
      const vendors = JSON.parse(localStorage.getItem("vendors")) || [];
      const vendor = vendors.find(
        (v) => v.username === username && v.password === password
      );

      if (vendor) {
        // Successful login for vendor
        localStorage.setItem("loggedInVendor", JSON.stringify(vendor));
        window.location.href = "vendor_dashboard.html"; // Redirect to vendor dashboard
      } else {
        document.getElementById("error-message").textContent =
          "Invalid vendor credentials";
      }
    }

    // Clear the input fields after submission
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  });

// Function to display login form with the correct role title
function displayLoginForm(role) {
  const loginForm = document.getElementById("loginForm");
  const formTitle = document.querySelector(".login-container h1");
  formTitle.textContent = role + " Login";
  loginForm.style.display = "block";
  document.getElementById("error-message").textContent = ""; // Clear any previous error messages

  // Clear input fields when displaying the login form
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// Subscription buttons
const basicSubscriptionBtn = document.getElementById("basicSubscriptionBtn");
const premiumSubscriptionBtn = document.getElementById(
  "premiumSubscriptionBtn"
);

// Login section and form
const loginContainer = document.querySelector(".login-container");

// Show login form after selecting subscription
basicSubscriptionBtn.addEventListener("click", () => {
  document.querySelector(".subscription-container").style.display = "none";
  loginContainer.style.display = "block";
});

premiumSubscriptionBtn.addEventListener("click", () => {
  document.querySelector(".subscription-container").style.display = "none";
  loginContainer.style.display = "block";
});
