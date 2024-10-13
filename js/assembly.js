let serialNo = 1;
const adminUsername = "admin";
const adminPassword = "123";

window.onload = function () {
  loadTableData(); // Only load existing data without adding new rows.
};

function requestCredentials(action) {
  const username = prompt("Enter Admin Username:");
  const password = prompt("Enter Admin Password:");
  if (username === adminUsername && password === adminPassword) {
    action();
  } else {
    alert("Incorrect username or password. Access denied.");
  }
}

function addRow() {
  const table = document.getElementById("assemblingTable");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${serialNo++}</td>
        <td><input type="number" name="laborHours" required></td>
        <td><input type="number" name="laborCostPerHour" required></td>
        <td><input type="number" name="totalAmount" disabled></td>
        <td>
          <button type="button" onclick="requestCredentials(() => deleteRow(this))">Delete</button>
          <button type="button" onclick="saveRow(this)">Save</button>
        </td>
    `;
  table.appendChild(row);
  calculateTotalAmount(row);
}

function calculateTotalAmount(row) {
  const laborHours = row.querySelector('input[name="laborHours"]');
  const laborCostPerHour = row.querySelector('input[name="laborCostPerHour"]');
  const totalAmount = row.querySelector('input[name="totalAmount"]');

  laborHours.addEventListener("input", updateTotal);
  laborCostPerHour.addEventListener("input", updateTotal);

  function updateTotal() {
    const total =
      parseFloat(laborHours.value || 0) *
      parseFloat(laborCostPerHour.value || 0);
    totalAmount.value = total.toFixed(2);
  }
}

function saveRow(button) {
  const row = button.closest("tr");
  const rowData = {
    serialNo: row.querySelector("td").textContent,
    laborHours: row.querySelector('input[name="laborHours"]').value,
    laborCostPerHour: row.querySelector('input[name="laborCostPerHour"]').value,
    totalAmount: row.querySelector('input[name="totalAmount"]').value,
  };

  let tableData = JSON.parse(localStorage.getItem("assemblingTableData")) || [];
  const existingIndex = tableData.findIndex(
    (item) => item.serialNo === rowData.serialNo
  );

  // Replace row data if it exists, otherwise add a new entry
  if (existingIndex >= 0) {
    tableData[existingIndex] = rowData;
  } else {
    tableData.push(rowData);
  }

  localStorage.setItem("assemblingTableData", JSON.stringify(tableData));
  alert("Details are saved!");
}

function deleteRow(button) {
  const row = button.closest("tr");
  const confirmation = confirm(
    "Are you sure you want to delete this component?"
  );
  if (confirmation) {
    row.remove();
    saveTableData();
    updateSerialNumbers();
  }
}

function updateSerialNumbers() {
  const rows = document.querySelectorAll("#assemblingTable tr");
  serialNo = 1;
  rows.forEach((row) => {
    row.querySelector("td").textContent = serialNo++;
  });
  saveTableData();
}

function saveTableData() {
  const tableData = [];
  const rows = document.querySelectorAll("#assemblingTable tr");
  rows.forEach((row) => {
    const rowData = {
      serialNo: row.querySelector("td").textContent,
      laborHours: row.querySelector('input[name="laborHours"]').value,
      laborCostPerHour: row.querySelector('input[name="laborCostPerHour"]')
        .value,
      totalAmount: row.querySelector('input[name="totalAmount"]').value,
    };
    tableData.push(rowData);
  });
  localStorage.setItem("assemblingTableData", JSON.stringify(tableData));
}

function loadTableData() {
  const tableData =
    JSON.parse(localStorage.getItem("assemblingTableData")) || [];
  tableData.forEach((data) => {
    const table = document.getElementById("assemblingTable");
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${data.serialNo}</td>
            <td><input type="number" name="laborHours" value="${data.laborHours}" required></td>
            <td><input type="number" name="laborCostPerHour" value="${data.laborCostPerHour}" required></td>
            <td><input type="number" name="totalAmount" value="${data.totalAmount}" disabled></td>
            <td>
              <button type="button" onclick="requestCredentials(() => deleteRow(this))">Delete</button>
              <button type="button" onclick="saveRow(this)">Save</button>
            </td>
        `;
    table.appendChild(row);
    serialNo = Math.max(serialNo, parseInt(data.serialNo) + 1);
    calculateTotalAmount(row);
  });
}
