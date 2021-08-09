window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || 
window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || 
window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || 
window.webkitIDBKeyRange || window.msIDBKeyRange
 
if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//we need to create a local storage
var db;
const openRequest = indexedDB.open("budget-db", 1);

openRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("success: "+ db);
 };

 openRequest.onerror = function(event) {
    console.log("error: ");
 };
 
 openRequest.onupgradeneeded = function(event) {
   const db = event.target.result;
   let objectStore = db.createObjectStore("BudgetStore", {autoIncrement: true});
   // Use transaction oncomplete to make sure the objectStore creation is
   // finished before adding data into it.
   // an objectStore is like a table.
   objectStore.transaction.oncomplete = function(event) {
      console.log('we complete the creation of the object store BudgetStore!');
   }
 }

 function saveRecord(record) {
   const transaction = db.transaction("BudgetStore", "readwrite");
   const budgetStore = transaction.objectStore("BudgetStore");
   budgetStore.add({name: record.name, value: record.value, date: record.date });
}
 
 function readDB() {
    let transaction = db.transaction("BudgetStore", "readonly");
    let objectStore = transaction.objectStore("BudgetStore");
    let getAllRequest = objectStore.getAll();
    
    getAllRequest.onerror = function(event) {
       alert("Unable to retrieve daa from database!");
    };
    
    getAllRequest.onsuccess = function(event) {
       // Do something with the request.result!
       if(event.target.result.length > 0) {
          fetch(`/api/transaction/bulk`, {
            method: 'POST',
            body: JSON.stringify(event.target.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
          });
    }
   }
 }

window.addEventListener('online', readDB);
