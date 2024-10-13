// SecureLS example for storing encrypted data
var ls = new SecureLS({
  encodingType: "aes",
  encryptionSecret: "your-secret-key",
});

// Function to save data in encrypted form
function saveEncryptedData(key, data) {
  ls.set(key, data);
}

// Function to retrieve encrypted data
function getEncryptedData(key) {
  return ls.get(key);
}

// Example usage
saveEncryptedData("key-name", "your-sensitive-data");
console.log(getEncryptedData("key-name"));
