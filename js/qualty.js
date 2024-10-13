let serialNo = 1;
const adminUsername = "admin"; // Replace with your desired admin username
const adminPassword = "123"; // Replace with your desired admin password

// Load existing data from localStorage
window.onload = function () {
  loadTableData();
};

// Function to request credentials
function requestCredentials(action) {
  const username = prompt("Enter Admin Username:");
  const password = prompt("Enter Admin Password:");

  if (username === adminUsername && password === adminPassword) {
    action(); // Execute the passed action function (e.g., addRow or deleteRow)
  } else {
    alert("Incorrect username or password. Access denied.");
  }
}

// Function to add a new row with a Save button
function addRow() {
  const table = document.getElementById("qualityTable");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${serialNo++}</td>
        <td><input type="number" name="inspectorTime" required></td>
        <td><input type="number" name="costPerHour" required></td>
        <td><input type="number" name="laborCharge"></td>
        <td><input type="number" name="totalAmount" disabled></td>
        <td>
          <button type="button" onclick="requestCredentials(() => saveRow(this))">Save</button>
          <button type="button" onclick="requestCredentials(() => deleteRow(this))">Delete</button>
        </td>
    `;
  table.appendChild(row);
  calculateTotalAmount(row);
}

// Function to calculate the total amount
function calculateTotalAmount(row) {
  const inspectorTime = row.querySelector('input[name="inspectorTime"]');
  const costPerHour = row.querySelector('input[name="costPerHour"]');
  const laborCharge = row.querySelector('input[name="laborCharge"]');
  const totalAmount = row.querySelector('input[name="totalAmount"]');

  inspectorTime.addEventListener("input", updateTotal);
  costPerHour.addEventListener("input", updateTotal);
  laborCharge.addEventListener("input", updateTotal);

  function updateTotal() {
    const total =
      parseFloat(inspectorTime.value || 0) *
        parseFloat(costPerHour.value || 0) +
      parseFloat(laborCharge.value || 0);
    totalAmount.value = total.toFixed(2);
    saveTableData(); // Save data after calculating the total
  }
}

// Function to save a specific row's data to localStorage
function saveRow(button) {
  const row = button.closest("tr");
  const serialNo = row.querySelector("td").textContent;
  const inspectorTime = row.querySelector('input[name="inspectorTime"]').value;
  const costPerHour = row.querySelector('input[name="costPerHour"]').value;
  const laborCharge = row.querySelector('input[name="laborCharge"]').value;
  const totalAmount = row.querySelector('input[name="totalAmount"]').value;

  // Create a rowData object
  const rowData = {
    serialNo,
    inspectorTime,
    costPerHour,
    laborCharge,
    totalAmount,
  };

  // Load existing data from localStorage
  let tableData = JSON.parse(localStorage.getItem("qualityTableData")) || [];

  // Find if this serialNo already exists
  const existingRowIndex = tableData.findIndex(
    (item) => item.serialNo === serialNo
  );

  if (existingRowIndex !== -1) {
    // Update existing row data
    tableData[existingRowIndex] = rowData;
  } else {
    // Add new row data
    tableData.push(rowData);
  }

  // Save the updated data back to localStorage
  localStorage.setItem("qualityTableData", JSON.stringify(tableData));

  // Alert to confirm save
  alert("Your details are saved!");
}

// Function to delete a row
function deleteRow(button) {
  const row = button.closest("tr");
  const confirmation = confirm(
    "Are you sure you want to delete this component?"
  );
  if (confirmation) {
    row.remove();
    saveTableData(); // Save data after deletion
    updateSerialNumbers(); // Update serial numbers after deletion
  }
}

// Function to update serial numbers after deletion
function updateSerialNumbers() {
  const rows = document.querySelectorAll("#qualityTable tr");
  serialNo = 1; // Reset serial number
  rows.forEach((row) => {
    row.querySelector("td").textContent = serialNo++;
  });
  saveTableData(); // Save updated serial numbers
}

// Function to save the table data to localStorage
function saveTableData() {
  const tableData = [];
  const rows = document.querySelectorAll("#qualityTable tr");
  rows.forEach((row) => {
    const rowData = {
      serialNo: row.querySelector("td").textContent,
      inspectorTime: row.querySelector('input[name="inspectorTime"]').value,
      costPerHour: row.querySelector('input[name="costPerHour"]').value,
      laborCharge: row.querySelector('input[name="laborCharge"]').value,
      totalAmount: row.querySelector('input[name="totalAmount"]').value,
    };
    tableData.push(rowData);
  });
  localStorage.setItem("qualityTableData", JSON.stringify(tableData));
}

// Function to load the table data from localStorage
function loadTableData() {
  const tableData = JSON.parse(localStorage.getItem("qualityTableData")) || [];
  tableData.forEach((data) => {
    const table = document.getElementById("qualityTable");
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${data.serialNo}</td>
            <td><input type="number" name="inspectorTime" value="${data.inspectorTime}" required></td>
            <td><input type="number" name="costPerHour" value="${data.costPerHour}" required></td>
            <td><input type="number" name="laborCharge" value="${data.laborCharge}"></td>
            <td><input type="number" name="totalAmount" value="${data.totalAmount}" disabled></td>
            <td>
              <button type="button" onclick="requestCredentials(() => saveRow(this))">Save</button>
              <button type="button" onclick="requestCredentials(() => deleteRow(this))">Delete</button>
            </td>
        `;
    table.appendChild(row);
    serialNo = Math.max(serialNo, parseInt(data.serialNo) + 1);
    calculateTotalAmount(row);
  });
}
