document.getElementById("vendorBtn").addEventListener("click", function () {
  document.getElementById("loginForm").style.display = "block";
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const vendors = JSON.parse(localStorage.getItem("vendors")) || [];
  const vendor = vendors.find(
    (v) => v.username === username && v.password === password
  );

  if (vendor) {
    alert("Login successful!");
    // Redirect to vendor's dashboard or relevant page
    window.location.href = "vendor_dashboard.html";
  } else {
    document.getElementById("error-message").innerText =
      "Invalid username or password";
  }
});
