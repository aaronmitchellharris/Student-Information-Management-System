function submit(event){
    if ((document.getElementById('fname').value != "") && 
        (document.getElementById('lname').value != "") &&
        (document.getElementById('department').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'insert', fname:null, lname:null, department:null};
        payload.fname = document.getElementById('fname').value;
        payload.lname = document.getElementById('lname').value;
        payload.department = document.getElementById('department').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/instructors' , true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                response.results = JSON.parse(response.results);
                buildTable(response);
            }
        });

        document.getElementById('fname').value = "";
        document.getElementById('lname').value = "";
        document.getElementById('department').value = "";

    } else {
        console.log("Error: Info Missing");
    };
    event.preventDefault();
};

function deleteInstructor(event){
     
    var req = new XMLHttpRequest();
    var payload = {task:'delete', id:null,};
    payload.id = event.target.previousSibling.value;

    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/instructors' , true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            response.results = JSON.parse(response.results);
            buildTable(response);
        }
    });

    event.preventDefault();
};

function bindButtons(){
    document.getElementById('postSubmit').addEventListener('click', submit);
    var deleteButtons = document.getElementsByClassName('delete');
    for (var i = 0; i < deleteButtons.length; i++){
        deleteButtons[i].addEventListener('click', deleteInstructor);
    }

};

function initial(){
    var req = new XMLHttpRequest();
    var payload = {task:'initial'};
    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/instructors' , true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            response.results = JSON.parse(response.results);
            buildTable(response);
        }
    });
};
initial();

function buildTable(tableInfo){
    document.getElementsByTagName("table")[0].remove();
    var table = document.createElement("table");
    table.className = "table";

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerID = document.createElement("th");
    var headerFname = document.createElement("th");
    var headerLname = document.createElement("th");
    var headerDep = document.createElement("th");

    headerID.textContent = "ID";
    headerFname.textContent = "First Name";
    headerLname.textContent = "Last Name";
    headerDep.textContent = "Department";

    thead.appendChild(headerRow);
    headerRow.appendChild(headerID);
    headerRow.appendChild(headerFname);
    headerRow.appendChild(headerLname);
    headerRow.appendChild(headerDep);

    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < tableInfo.results.length; i++){
        var current = document.createElement("tr");
        var id = document.createElement("td");
        var fname = document.createElement("td");
        var lname = document.createElement("td");
        var department = document.createElement("td");

        id.textContent = tableInfo.results[i].instructor_id;
        fname.textContent = tableInfo.results[i].first_name;
        lname.textContent = tableInfo.results[i].last_name;
        department.textContent = tableInfo.results[i].department_code;
        
        var deleteTd = document.createElement("td");
        var deleteForm = document.createElement("form");
        var deleteId = document.createElement("input");
        deleteId.type = "hidden";
        deleteId.value = tableInfo.results[i].instructor_id;
        var deleteSubmit = document.createElement("input");
        deleteSubmit.type = "submit";
        deleteSubmit.value = "Delete";
        deleteSubmit.className += "delete btn btn-danger";
        deleteForm.appendChild(deleteId);
        deleteForm.appendChild(deleteSubmit);
        deleteTd.appendChild(deleteForm);

        current.appendChild(id);
        current.appendChild(fname);
        current.appendChild(lname);
        current.appendChild(department);
        current.appendChild(deleteTd)
        tbody.appendChild(current);
        table.appendChild(tbody);
    };
    document.getElementById("table").appendChild(table);
    bindButtons();
};