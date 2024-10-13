let serialNo = 1;
const adminUsername = "admin";
const adminPassword = "123";

// Load table data on page load
window.onload = function () {
  loadTableData(); // Load table data from localStorage
};

document.getElementById("productForm").onsubmit = function () {
  var componentNumber = document.getElementById("componentNumberProduct").value;
  var storedComponentNumber = sessionStorage.getItem("componentNumber");

  if (componentNumber === storedComponentNumber) {
    // Component is valid, proceed with form submission
  } else {
    alert("Please add a component first on the product page.");
    return false;
  }
};

// Unified credentials prompt function
function requestCredentials(callback) {
  const username = prompt("Enter Admin Username:");
  const password = prompt("Enter Admin Password:");
  if (username === adminUsername && password === adminPassword) {
    callback();
  } else {
    alert("Incorrect username or password. Access denied.");
  }
}

// Add a new row with component number synchronization
function addRow() {
  const table = document.getElementById("productTable");
  const row = document.createElement("tr");
  const componentNumberInput = prompt("Enter Component Number:");

  if (!componentNumberInput) {
    alert("Component Number is required!");
    return;
  }

  let componentNumbers =
    JSON.parse(localStorage.getItem("componentNumbers")) || [];
  if (componentNumbers.includes(componentNumberInput)) {
    alert("Component Number already exists! Please enter a unique number.");
    return;
  }

  componentNumbers.push(componentNumberInput);
  localStorage.setItem("componentNumbers", JSON.stringify(componentNumbers));

  // Check if there is a vendor for the component number
  const componentVendors =
    JSON.parse(localStorage.getItem("componentVendors")) || {};
  const vendorId = componentVendors[componentNumberInput] || "N/A"; // Default to N/A if no vendor

  row.innerHTML = `
    <td>${serialNo++}</td>
    <td><input type="text" name="componentNumber" value="${componentNumberInput}" required readonly></td>
    <td><input type="text" name="quantity" required></td>
    <td><input type="text" name="materialName" required></td>
    <td><input type="number" name="materialCost" required></td>
    <td>
      <label>Enter Number of Processes:</label>
      <input type="number" name="numberOfProcesses" oninput="generateProcessRows(this)">
    </td>
    <td class="processDetails"></td>
    <td class="details"></td>
    <td>Vendor ID: ${vendorId}</td>
    <td><button type="button" onclick="requestCredentials(() => deleteRow(this))">Delete</button></td>
  `;

  table.appendChild(row);
  saveTableData();
}

function generateProcessRows(input) {
  const numberOfProcesses = parseInt(input.value) || 0;
  const row = input.closest("tr");
  const processDetailsCell = row.querySelector(".processDetails");

  processDetailsCell.innerHTML = ""; // Clear previous process rows

  for (let i = 1; i <= numberOfProcesses; i++) {
    processDetailsCell.innerHTML += `
      <div>
        <label>Process ${i} Type:</label>
        <select name="processType${i}" onchange="showDetails(this, ${i})">
          <option value="">Select</option>
          <option value="inhouse">Inhouse</option>
          <option value="outhouse">Outhouse</option>
          <option value="both">Both</option>
        </select>
        <div class="processTypeDetails process${i}Details"></div>
      </div>
    `;
  }

  saveTableData(); // Save updated data to localStorage
}

// Delete a row and update component numbers
function deleteRow(button) {
  const row = button.closest("tr");
  const componentNumber = row.querySelector(
    'input[name="componentNumber"]'
  ).value;
  const confirmation = confirm(
    "Are you sure you want to delete this component?"
  );
  if (confirmation) {
    row.remove();

    let componentNumbers =
      JSON.parse(localStorage.getItem("componentNumbers")) || [];
    componentNumbers = componentNumbers.filter(
      (number) => number !== componentNumber
    );
    localStorage.setItem("componentNumbers", JSON.stringify(componentNumbers));

    saveTableData();
    updateSerialNumbers();
  }
}
// Update serial numbers after deletion
function updateSerialNumbers() {
  const rows = document.querySelectorAll("#productTable tr");
  serialNo = 1;
  rows.forEach((row) => {
    row.querySelector("td").textContent = serialNo++;
  });
  saveTableData();
}

// Show details based on process type
// Show details based on process type
// Show details based on process type
function showDetails(select, processNumber) {
  const row = select.closest("tr");
  const detailsCell = row.querySelector(`.process${processNumber}Details`);
  detailsCell.innerHTML = ""; // Clear previous details

  const componentNumber = row.querySelector(
    'input[name="componentNumber"]'
  ).value;
  const componentVendors =
    JSON.parse(localStorage.getItem("componentVendors")) || {};
  const vendorId = componentVendors[componentNumber] || "N/A"; // Fetch the correct Vendor ID

  if (select.value === "inhouse") {
    detailsCell.innerHTML = `
      <label>Labor Charge/Per Hour (Rs): </label>
      <input type="number" name="laborCharge${processNumber}" oninput="calculateInhouseCost(this)">
      <label>Working Hours: </label>
      <input type="number" name="workingHours${processNumber}" oninput="calculateInhouseCost(this)">
      <label>GST (%): </label>
      <input type="number" name="gstPercent${processNumber}" oninput="calculateInhouseCost(this)">
      <p>Total Labor Cost: Rs <span class="totalCost">0</span></p>
      <p>Total Amount with GST: Rs <span class="totalCostWithGst">0</span></p>
    `;
  } else if (select.value === "outhouse") {
    detailsCell.innerHTML = `
      <label>Vendor Name: </label><input type="text" name="vendorName${processNumber}">
      <label>Vendor Cost (Rs): </label><input type="number" name="vendorCost${processNumber}" oninput="calculateOuthouseCost(this)">
      <label>Transport Cost (Rs): </label><input type="number" name="transportCost${processNumber}" oninput="calculateOuthouseCost(this)">
      <label>Purchase Cost (Rs): </label><input type="number" name="purchaseCost${processNumber}" oninput="calculateOuthouseCost(this)">
      <label>GST (%): </label>
      <input type="number" name="gstPercent${processNumber}" oninput="calculateOuthouseCost(this)">
      <p>Total Outhouse Cost: Rs <span class="totalCost">0</span></p>
      <p>Total Amount with GST: Rs <span class="totalCostWithGst">0</span></p>
    `;
  } else if (select.value === "both") {
    detailsCell.innerHTML = `
      <label>Labor Charge/Per Hour (Rs): </label>
      <input type="number" name="laborCharge${processNumber}" oninput="calculateInhouseCost(this)">
      <label>Working Hours: </label>
      <input type="number" name="workingHours${processNumber}" oninput="calculateInhouseCost(this)">
      <label>Vendor Name: </label><input type="text" name="vendorName${processNumber}">
      <label>Vendor Cost (Rs): </label><input type="number" name="vendorCost${processNumber}" oninput="calculateOuthouseCost(this)">
      <label>Transport Cost (Rs): </label><input type="number" name="transportCost${processNumber}" oninput="calculateOuthouseCost(this)">
      <label>Purchase Cost (Rs): </label><input type="number" name="purchaseCost${processNumber}" oninput="calculateOuthouseCost(this)">
      <label>GST (%): </label>
      <input type="number" name="gstPercent${processNumber}" oninput="calculateOuthouseCost(this)">
      <p>Total Cost (Inhouse & Outhouse): Rs <span class="totalCost">0</span></p>
      <p>Total Amount with GST: Rs <span class="totalCostWithGst">0</span></p>
    `;
  }

  saveTableData(); // Save updated data to localStorage
}
// Save table data to localStorage
function saveDetails() {
  saveTableData(); // Save updated data to localStorage
  alert("Details have been saved successfully.");
}

// Save table data to localStorage
function saveTableData() {
  const tableData = [];
  const rows = document.querySelectorAll("#productTable tr");
  rows.forEach((row) => {
    const rowData = {
      serialNo: row.querySelector("td").textContent,
      componentNumber: row.querySelector('input[name="componentNumber"]').value,
      quantity: row.querySelector('input[name="quantity"]').value,
      materialName: row.querySelector('input[name="materialName"]').value,
      materialCost: row.querySelector('input[name="materialCost"]').value,
      numberOfProcesses: row.querySelector('input[name="numberOfProcesses"]')
        .value,
      processDetails: row.querySelector(".processDetails").innerHTML,
      detailsClass: row.querySelector(".details").className,
    };
    tableData.push(rowData);
  });
  localStorage.setItem("productTableData", JSON.stringify(tableData));
}
// Calculate total cost for inhouse process
function calculateInhouseCost(input) {
  const row = input.closest("tr");
  const laborCharge =
    parseFloat(row.querySelector('input[name="laborCharge"]').value) || 0;
  const workingHours =
    parseFloat(row.querySelector('input[name="workingHours"]').value) || 0;
  const materialCost =
    parseFloat(row.querySelector('input[name="materialCost"]').value) || 0;
  const gstPercent =
    parseFloat(row.querySelector('input[name="gstPercent"]').value) || 0;

  const totalLaborCost = laborCharge * workingHours;
  const totalAmount = totalLaborCost + materialCost; // Include material cost

  const totalGst = (totalAmount * gstPercent) / 100; // GST calculation
  const totalAmountWithGst = totalAmount + totalGst;

  row.querySelector(".totalCost").textContent = totalAmount; // Show total amount without GST
  row.querySelector(".totalCostWithGst").textContent = totalAmountWithGst; // Show total amount with GST

  saveTableData(); // Save updated data to localStorage
}
// Calculate total cost for outhouse process
function calculateOuthouseCost(input) {
  const row = input.closest("tr");
  const vendorCost =
    parseFloat(row.querySelector('input[name="vendorCost"]').value) || 0;
  const transportCost =
    parseFloat(row.querySelector('input[name="transportCost"]').value) || 0;
  const purchaseCost =
    parseFloat(row.querySelector('input[name="purchaseCost"]').value) || 0;
  const materialCost =
    parseFloat(row.querySelector('input[name="materialCost"]').value) || 0;
  const gstPercent =
    parseFloat(row.querySelector('input[name="gstPercent"]').value) || 0;

  const totalOuthouseCost = vendorCost + transportCost + purchaseCost;
  const totalAmount = totalOuthouseCost + materialCost; // Include material cost

  const totalGst = (totalAmount * gstPercent) / 100; // GST calculation
  const totalAmountWithGst = totalAmount + totalGst;

  row.querySelector(".totalCost").textContent = totalAmount; // Show total amount without GST
  row.querySelector(".totalCostWithGst").textContent = totalAmountWithGst; // Show total amount with GST

  saveTableData(); // Save updated data to localStorage
}

function loadTableData() {
  const tableData = JSON.parse(localStorage.getItem("productTableData")) || [];
  const componentVendors =
    JSON.parse(localStorage.getItem("componentVendors")) || {};
  const vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  tableData.forEach((data) => {
    const row = document.createElement("tr");

    // Fetch the correct vendor ID for each component
    const vendorId = componentVendors[data.componentNumber] || "N/A";
    const vendor = vendors.find((v) => v.id === vendorId);

    // Check the vendor's status and set default value if vendor doesn't exist
    const vendorStatus = vendor ? vendor.status : "Not Taken"; // Default to "Not Taken"

    row.innerHTML = `
  <td>${data.serialNo}</td>
  <td><input type="text" name="componentNumber" value="${
    data.componentNumber
  }" required readonly></td>
  <td><input type="text" name="quantity" value="${data.quantity}" required></td>
  <td><input type="text" name="materialName" value="${
    data.materialName
  }" required></td>
  <td><input type="number" name="materialCost" value="${
    data.materialCost
  }" required></td>
  <td>
        <label>Enter Number of Processes:</label>
        <input type="number" name="numberOfProcesses" value="${
          data.numberOfProcesses
        }" oninput="generateProcessRows(this)">
      </td>
      <td class="processDetails">${data.processDetails}</td>
  <td>Vendor ID: ${vendorId}</td>
  <td><button type="button" onclick="requestCredentials(() => deleteRow(this))">Delete</button></td>
  <td class="status">
    <span class="status-dot ${getStatusClass(
      vendorStatus
    )}">●</span> ${vendorStatus}
  </td>
`;

    function getStatusClass(status) {
      switch (status) {
        case "Completed":
          return "green";
        case "Process Taken":
          return "yellow";
        case "Not Taken":
          return "red";
        default:
          return "";
      }
    }
    document.getElementById("productTable").appendChild(row);
  });
}
function updateStatus(componentNumber, status) {
  let componentStatuses =
    JSON.parse(localStorage.getItem("componentStatuses")) || {};
  componentStatuses[componentNumber] = status;
  localStorage.setItem("componentStatuses", JSON.stringify(componentStatuses));

  saveTableData(); // Save updated status to localStorage
}
// Event listeners for status dots
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("status-dot")) {
    const row = event.target.closest("tr");
    const componentNumber = row.querySelector(
      'input[name="componentNumber"]'
    ).value;

    // Cycle through statuses when dot is clicked
    let currentStatus = event.target.classList.contains("green")
      ? "Completed"
      : event.target.classList.contains("yellow")
      ? "Process Taken"
      : "Not Taken";

    let newStatus;
    if (currentStatus === "Completed") newStatus = "Process Taken";
    else if (currentStatus === "Process Taken") newStatus = "Not Taken";
    else newStatus = "Completed";

    // Update the status dot and text
    const statusCell = row.querySelector(".status");
    statusCell.innerHTML = `<span class="status-dot ${getStatusClass(
      newStatus
    )}">●</span> ${newStatus}`;

    updateStatus(componentNumber, newStatus);
  }
});
function assignComponentToVendor(componentNumber, vendorId) {
  const componentVendors =
    JSON.parse(localStorage.getItem("componentVendors")) || {};
  componentVendors[componentNumber] = vendorId;
  localStorage.setItem("componentVendors", JSON.stringify(componentVendors));
}
