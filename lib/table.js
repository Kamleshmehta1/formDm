class Table {
  constructor(storageId, tableContainerId, mainObj) {
    // Pass tableContainerId to append table inside of HTML DIV element
    this.tableContainerId = tableContainerId;
    this.td;
    this.tr;
    this.edit = false;
    this.headTr;
    this.flag = false;
    this.mySet = new Map();
    this.mainObj = mainObj
    this.storageId = storageId;
    this.table = document.createElement("table");
    this.section = document.createElement("section");
    this.renderTable();
  }

  getLocalStorage() {
    return JSON.parse(localStorage.getItem(this.storageId));
  }

  setLocalStorage(globalArr) {
    localStorage.setItem(this.storageId, JSON.stringify(globalArr));
  }
  // create methods/event to refresh table data, add data row, update data row, delete data row, etc
  renderTable() {

    this.headTr = document.createElement("tr");
    this.tableContainerId.innerHTML = "";
    this.getLocalStorage() != null && this.getLocalStorage().length != 0 ? this.getLocalStorage().forEach((Obj, idx) => {

      this.tr = document.createElement("tr");
      this.headTr = document.createElement("tr");
      for (let key in Obj) {
        if (!this.flag) {
          let th = document.createElement("th");
          if (key != "userId") {
            th.innerHTML = key;
            this.headTr.appendChild(th);
          }
        }
        this.td = document.createElement("td");
        if (key != "userId") {
          this.td.innerHTML = Obj[key];
          this.tr.appendChild(this.td);
        }
      }
      if (!this.flag) {
        let th = document.createElement("th");
        th.innerText = "Action";
        this.headTr.appendChild(th);
      }
      this.flag = true;
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      deleteButton.innerText = "DELETE";
      editButton.innerText = "EDIT";
      editButton.onclick = (event) => {
        !this.edit ?
          this.handleEdit(event, Obj.id, editButton) :
          this.handleUpdate(event, Obj.id, idx, editButton);
      }

      deleteButton.classList = "button delete";
      deleteButton.onclick = (event) => this.handleDelete(event, Obj.id)
      editButton.classList = "button edit";
      let buttonContainer = document.createElement("td");
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);
      this.table.appendChild(this.headTr);
      this.tr.appendChild(buttonContainer);
      this.table.appendChild(this.tr);
      this.section.appendChild(this.table);
      this.tableContainerId.appendChild(this.table);
    }) : this.tableContainerId.innerHTML = `<h1 class="error">NO DATA FOUND</h1>`;
  }

  handleEdit(e, userId, editButton) {
    console.log("EDIT");
    console.log(e.target.parentNode.parentNode.parentNode.childNodes);
    let globalObject = {};
    let inputList = Array.from(e.target.getRootNode().forms[0]);
    let checkList = Array.from(e.target.getRootNode().forms[0].childNodes);
    globalObject = this.getLocalStorage().find((ele) => userId === ele.id)

    for (let x in globalObject) {
      this.mySet.set(x, globalObject[x])
    }
    inputList.forEach((ele) => {
      if (this.mySet.has(ele.getAttribute("key")) && ele.getAttribute("key") != "hobbies" && ele.getAttribute("key") != "gender") {
        ele.value = this.mySet.get(ele.getAttribute("key"))
      }
    });

    checkList.forEach((ele) => {
      if (ele.id === "handleCheck") {
        if (this.mySet.has(ele.firstChild.getAttribute("key"))) {
          if (Array.isArray(this.mySet.get(ele.firstChild.getAttribute("key")))) {
            if (this.mySet.get(ele.firstChild.getAttribute("key")).includes(ele.firstChild.getAttribute("value"))) {
              ele.firstChild.checked = true;
            }
          }
        }
      } else if (ele.id === "handleRadio" && ele.firstChild.getAttribute("value") === this.mySet.get(ele.firstChild.getAttribute("key"))) {
        console.log(ele);
        ele.firstChild.checked = true;
      }
    })
    let submitNode = inputList.find((ele) => ele.type === "submit")
    submitNode.style.display = "none";
    editButton.innerText = "Update";
    this.edit = true;
  }
  handleUpdate(e, userId, index, editButton) {
    console.log("UPDATE");
    let globalObject = {};
    let currentNode = Array.from(e.target.parentNode.parentNode.childNodes);
    let inputList = Array.from(e.target.getRootNode().forms[0]);
    let checkList = Array.from(e.target.getRootNode().forms[0].childNodes);
    globalObject = this.getLocalStorage().find((ele) => userId === ele.id)


    inputList.forEach((ele) => {
      if (this.mySet.has(ele.getAttribute("key")) && ele.getAttribute("key") != "hobbies" && ele.getAttribute("key") != "gender") {
        globalObject[ele.getAttribute("key")] = ele.value;
      }
    });
    let localArr = []
    checkList.forEach((ele) => {
      if (ele.id === "handleCheck") {
        if (ele.firstChild.checked) {
          localArr.push(ele.firstChild.value);
          globalObject[ele.firstChild.getAttribute("key")] = localArr;
        } else {
          globalObject[ele.firstChild.getAttribute("key")] = localArr;
        }
      }
      if (ele.id === "handleRadio") {
        if (ele.firstChild.checked) {
          globalObject[ele.firstChild.getAttribute("key")] = ele.firstChild.value;
        }
      }
    })

    let count = 0
    for (let x in globalObject) {
      if (x != "userId") {
        currentNode[count].innerText = globalObject[x];
        count += 1;
      }
    }

    let updateArr = this.getLocalStorage();
    updateArr[index] = globalObject;
    this.setLocalStorage(updateArr);
    this.edit = false;
    editButton.innerText = "Edit"
    e.target.getRootNode().forms[0].reset();
    let submitNode = inputList.find((ele) => ele.type === "submit")
    submitNode.style.display = "block";
  }

  handleDelete(e, id) {
    e.target.getRootNode().forms[0].reset();
    e.target.parentNode.parentNode.remove();
    if (this.getLocalStorage().length != 0) {
      let updatedData = this.getLocalStorage().filter((ele) => ele.id != id);
      this.setLocalStorage(updatedData);
    }
  }
}