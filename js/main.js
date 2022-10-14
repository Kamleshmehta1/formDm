// formData is accessible here as we have global variable in formData.js
class Main {
  constructor(formContainerId, formData, storageID, tableId) {
    // start code to init and link form.js, storage.js, table.js
    // const frm = new Form(formContainerId) // form js class to create form and access its methods
    // const strg = new Storage(storageId)  // storage class to access storage methods
    // const tbl = new Table(tableContainerId) // table js class to create table and access its methods
    const form = new Form(formContainerId, formData, storageID, tableId);
  }
}
//formContainerId: HTML Div element id inside of which you want to create form4
// formContainerId -> #employeeForm of current index.html

// storageId: localStorage key for saving json  string data init
// storageId -> 'employeeData' simple string to selected as key of localStorage

//tableContainerId: HTML Div element id inside of which you want to create table
// tableContainerId -> #tableDiv of current index.html
const main = new Main(
  document.getElementById("employeeForm"),
  formData,
  "mainData",
  document.getElementById("tableDiv")
);

const table = new Table(
  "mainData",
  document.getElementById("tableDiv")
)