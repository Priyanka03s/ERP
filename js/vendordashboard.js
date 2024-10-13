document.addEventListener("DOMContentLoaded", function () {
  // Fetch the currently logged-in vendor from localStorage
  const vendor = JSON.parse(localStorage.getItem("loggedInVendor"));

  if (vendor) {
    displayVendorDashboard(vendor);
  } else {
    // If no vendor is logged in, redirect to the login page
    window.location.href = "login.html";
  }

  function displayVendorDashboard(vendor) {
    const vendorDetailsTable = document
      .getElementById("vendorDetailsTable")
      .getElementsByTagName("tbody")[0];

    // Clear existing rows
    vendorDetailsTable.innerHTML = "";

    // Insert vendor details
    const row = vendorDetailsTable.insertRow();
    row.insertCell(0).innerText = vendor.id;
    row.insertCell(1).innerText = vendor.companyName;
    row.insertCell(2).innerText = vendor.componentNumber;
    row.insertCell(3).innerText = vendor.materialName;
    row.insertCell(4).innerText = vendor.materialCost;
    row.insertCell(5).innerText = vendor.username;
    row.insertCell(6).innerText = vendor.password;
    row.insertCell(7).innerText = vendor.phone;
    row.insertCell(8).innerText = vendor.address;

    // Create the Status column with clickable dots, defaulting to gray
    const statusCell = row.insertCell(9);
    statusCell.innerHTML = `
      <div class="dot" id="status1" style="background-color: ${
        vendor.status === "Process Taken" ? "yellow" : "gray"
      };"></div>
      <div class="dot" id="status2" style="background-color: ${
        vendor.status === "Completed" ? "green" : "gray"
      };"></div>
      <div class="dot" id="status3" style="background-color: ${
        vendor.status === "Not Taken" ? "red" : "gray"
      };"></div>
    `;

    // Display Start Time, End Time, and Total Time
    row.insertCell(10).innerText = vendor.startTime || "N/A"; // Start Time
    row.insertCell(11).innerText = vendor.endTime || "N/A"; // End Time
    row.insertCell(12).innerText = vendor.totalTime || "N/A"; // Total Time

    // Handle click events for the dots
    document.getElementById("status1").addEventListener("click", function () {
      setProcessStatus(vendor, "yellow");
    });

    document.getElementById("status2").addEventListener("click", function () {
      setProcessStatus(vendor, "green");
    });

    document.getElementById("status3").addEventListener("click", function () {
      setProcessStatus(vendor, "red");
    });

    // Add a "Save" button to save updated details back to localStorage
    const saveButtonCell = row.insertCell(13);
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", function () {
      saveVendorDetails(vendor);
    });
    saveButtonCell.appendChild(saveButton);
  }

  // Function to update process status and time
  // Function to update process status and time
  function setProcessStatus(vendor, color) {
    const currentTime = new Date().toLocaleString();

    if (color === "yellow") {
      vendor.startTime = currentTime;
      vendor.endTime = "N/A";
      vendor.totalTime = "N/A";
      vendor.status = "Process Taken";
    } else if (color === "green") {
      vendor.endTime = currentTime;
      vendor.status = "Completed";
      if (vendor.startTime && vendor.startTime !== "Not Taken") {
        const startTime = new Date(vendor.startTime).getTime();
        const endTime = new Date(currentTime).getTime();
        const totalSeconds = Math.ceil((endTime - startTime) / 1000);

        // Calculate hours and minutes
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        vendor.totalTime = `${hours} hours and ${minutes} minutes`;
      }
    } else if (color === "red") {
      vendor.startTime = "Not Taken";
      vendor.endTime = "Not Taken";
      vendor.totalTime = "Not Taken";
      vendor.status = "Not Taken";
    }

    // Update localStorage
    localStorage.setItem("loggedInVendor", JSON.stringify(vendor));

    // Refresh dashboard with updated status
    displayVendorDashboard(vendor);
  }

  // Function to save vendor details
  function saveVendorDetails(vendor) {
    let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
    vendors = vendors.map((v) => (v.id === vendor.id ? vendor : v));
    localStorage.setItem("vendors", JSON.stringify(vendors));
    alert("Vendor details saved successfully!");
  }
});
