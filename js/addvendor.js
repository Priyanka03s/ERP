// Predefined admin credentials
const adminCredentials = {
  username: "admin",
  password: "123",
};

// Generate a unique ID
function generateUniqueId() {
  return "vendor_" + Date.now();
}

function addVendor() {
  const vendorId = prompt("Enter Vendor ID:");
  const vendorStatus = prompt("Enter Vendor Status: (Active, Inactive, etc.)");

  let vendorStatuses = JSON.parse(localStorage.getItem("vendorStatuses")) || {};
  vendorStatuses[vendorId] = vendorStatus;
  localStorage.setItem("vendorStatuses", JSON.stringify(vendorStatuses));

  // Store vendor details like vendorId
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
  vendors.push({ id: vendorId, status: vendorStatus });
  localStorage.setItem("vendors", JSON.stringify(vendors));

  alert("Vendor added successfully with status.");
}

// Initialize event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if admin is authenticated
  if (localStorage.getItem("isAdminAuthenticated") !== "true") {
    document.getElementById("adminAuthModal").style.display = "block";
  } else {
    displayVendors();
  }

  // Save vendor button listener
  document
    .getElementById("saveVendorBtn")
    .addEventListener("click", function () {
      if (localStorage.getItem("isAdminAuthenticated") !== "true") {
        alert("Admin not authenticated!");
        return;
      }

      saveVendorDetails();
    });

  // Handle admin authentication
  document
    .getElementById("authAdminBtn")
    .addEventListener("click", function () {
      const adminUsername = document.getElementById("adminUsername").value;
      const adminPassword = document.getElementById("adminPassword").value;

      if (
        adminUsername === adminCredentials.username &&
        adminPassword === adminCredentials.password
      ) {
        alert("Admin authenticated!");
        localStorage.setItem("isAdminAuthenticated", "true");
        document.getElementById("adminAuthModal").style.display = "none";
        displayVendors();
      } else {
        alert("Invalid admin credentials!");
      }
    });

  // Save vendor list button listener
  document
    .getElementById("saveVendorListBtn")
    .addEventListener("click", function () {
      saveVendorList();
      alert("Vendor list saved successfully!");
    });
});

// Save vendor details in localStorage
function saveVendorDetails() {
  const componentNumber = document.getElementById("componentNumber").value;

  if (localStorage.getItem("componentNumbers")) {
    const componentNumbers = JSON.parse(
      localStorage.getItem("componentNumbers")
    );
    if (!componentNumbers.includes(componentNumber)) {
      alert(
        "This component number does not exist. Please enter a valid number."
      );
      return;
    }
  } else {
    alert(
      "No components available. Please add a component first on the product page."
    );
    return;
  }

  const vendorDetails = {
    id: generateUniqueId(),
    companyName: document.getElementById("vendorCompanyName").value,
    componentNumber: componentNumber,
    materialName: document.getElementById("materialName").value,
    materialCost: document.getElementById("materialCost").value,
    username: document.getElementById("vendorUsername").value,
    password: document.getElementById("vendorPassword").value,
    phone: document.getElementById("vendorPhone").value,
    address: document.getElementById("vendorAddress").value,
    status: "gray", // Set default status to "gray"
    startTime: "", // Placeholder for Start Time
    endTime: "", // Placeholder for End Time
    totalTime: "", // Placeholder for Total Time
  };

  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
  vendors.push(vendorDetails);
  localStorage.setItem("vendors", JSON.stringify(vendors));

  let componentVendors =
    JSON.parse(localStorage.getItem("componentVendors")) || {};
  componentVendors[componentNumber] = vendorDetails.id;
  localStorage.setItem("componentVendors", JSON.stringify(componentVendors));

  alert("Vendor added successfully!");
  displayVendors();
  document.getElementById("addVendorForm").reset();
}

// Display vendor details in table
function displayVendors() {
  const vendorListTable = document
    .getElementById("vendorListTable")
    .getElementsByTagName("tbody")[0];
  vendorListTable.innerHTML = "";
  const vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  vendors.forEach((vendor) => {
    const row = vendorListTable.insertRow();
    row.insertCell(0).innerText = vendor.id;
    row.insertCell(1).innerText = vendor.companyName;
    row.insertCell(2).innerText = vendor.componentNumber;
    row.insertCell(3).innerText = vendor.materialName;
    row.insertCell(4).innerText = vendor.materialCost;
    row.insertCell(5).innerText = vendor.username;
    row.insertCell(6).innerText = vendor.password;
    row.insertCell(7).innerText = vendor.phone;
    row.insertCell(8).innerText = vendor.address;

    // Add status text based on the vendor's status
    const statusCell = row.insertCell(9);
    statusCell.innerText = vendor.status || "Not Taken"; // Default to "Not Taken" if no status

    // Start Time, End Time, and Total Time columns
    row.insertCell(10).innerText = vendor.startTime || "N/A";
    row.insertCell(11).innerText = vendor.endTime || "N/A";
    row.insertCell(12).innerText = vendor.totalTime || "N/A";

    // Add delete button
    const deleteCell = row.insertCell(13);
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete this vendor?")) {
        deleteVendor(vendor.id);
      }
    });
    deleteCell.appendChild(deleteBtn);
  });
}

// Set vendor status and update Start Time, End Time, and Total Time
function setStatus(vendorId, color) {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
  vendors = vendors.map((vendor) => {
    if (vendor.id === vendorId) {
      const currentTime = new Date().toLocaleString();
      if (color === "yellow") {
        vendor.startTime = currentTime;
        vendor.status = "In Progress"; // Set status to "In Progress"
      } else if (color === "lightgreen") {
        vendor.endTime = currentTime;
        vendor.status = "Completed"; // Set status to "Completed"
        if (vendor.startTime) {
          const startTime = new Date(vendor.startTime).getTime();
          const endTime = new Date(currentTime).getTime();
          vendor.totalTime = Math.ceil((endTime - startTime) / 1000) + " secs";
        }
      } else if (color === "red") {
        vendor.startTime = "Not Taken";
        vendor.endTime = "Not Taken";
        vendor.totalTime = "Not Taken";
        vendor.status = "Not Taken"; // Set status to "Not Taken"
      }
    }
    return vendor;
  });

  localStorage.setItem("vendors", JSON.stringify(vendors)); // Save updated vendors list
  displayVendors(); // Refresh the display to show updated status
}

// Save the current vendor list to localStorage
function saveVendorList() {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
  localStorage.setItem("vendors", JSON.stringify(vendors));
}

// Delete vendor from localStorage
function deleteVendor(vendorId) {
  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
  vendors = vendors.filter((vendor) => vendor.id !== vendorId);
  localStorage.setItem("vendors", JSON.stringify(vendors));
  displayVendors();
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("adminAuthModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Close modal when clicking the close button
document.querySelector(".close").onclick = function () {
  document.getElementById("adminAuthModal").style.display = "none";
};
