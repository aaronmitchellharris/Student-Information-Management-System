function submit(event){
    if ((document.getElementById('name').value != "") && 
        (document.getElementById('instructor').value != "") &&
        (document.getElementById('department').value != "") &&
        (document.getElementById('units').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'insert', name:null, instructor:null, department:null, units:null};
        payload.name = document.getElementById('name').value;
        payload.instructor = document.getElementById('instructor').value;
        payload.department = document.getElementById('department').value;
        payload.units = document.getElementById('units').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/courses' , true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                response.results = JSON.parse(response.results);
                buildTable(response);
            }
        });

        document.getElementById('name').value = "";
        document.getElementById('instructor').value = "";
        document.getElementById('department').value = "";
        document.getElementById('units').value = "";

    } else {
        console.log("Error: Info Missing");
    };
    event.preventDefault();
};

function deleteCourse(event){
     
    var req = new XMLHttpRequest();
    var payload = {task:'delete', id:null,};
    payload.id = event.target.previousSibling.value;

    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/courses' , true);
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
        deleteButtons[i].addEventListener('click', deleteCourse);
    }
};

function initial(){
    var req = new XMLHttpRequest();
    var payload = {task:'initial'};
    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/courses' , true);
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
    var headerName = document.createElement("th");
    var headerUnits = document.createElement("th");
    var headerDep = document.createElement("th");
    var headerInstr = document.createElement("th");

    headerID.textContent = "ID";
    headerName.textContent = "Name";
    headerInstr.textContent = "Instructor";
    headerDep.textContent = "Department";
    headerUnits.textContent = "Units";

    thead.appendChild(headerRow);
    headerRow.appendChild(headerID);
    headerRow.appendChild(headerName);
    headerRow.appendChild(headerInstr);
    headerRow.appendChild(headerDep);
    headerRow.appendChild(headerUnits);

    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < tableInfo.results.length; i++){
        var current = document.createElement("tr");
        var id = document.createElement("td");
        var name = document.createElement("td");
        var instructor = document.createElement("td");
        var department = document.createElement("td");
        var units = document.createElement("td");

        id.textContent = tableInfo.results[i].course_id;
        name.textContent = tableInfo.results[i].name;
        instructor.textContent = tableInfo.results[i].instructor_id;
        department.textContent = tableInfo.results[i].department_code;
        units.textContent = tableInfo.results[i].units;
        
        var deleteTd = document.createElement("td");
        var deleteForm = document.createElement("form");
        var deleteId = document.createElement("input");
        deleteId.type = "hidden";
        deleteId.value = tableInfo.results[i].course_id;
        var deleteSubmit = document.createElement("input");
        deleteSubmit.type = "submit";
        deleteSubmit.value = "Delete";
        deleteSubmit.className += "delete btn btn-danger";
        deleteForm.appendChild(deleteId);
        deleteForm.appendChild(deleteSubmit);
        deleteTd.appendChild(deleteForm);

        current.appendChild(id);
        current.appendChild(name);
        current.appendChild(instructor);
        current.appendChild(department);
        current.appendChild(units);
        current.appendChild(deleteTd)
        tbody.appendChild(current);
        table.appendChild(tbody);
    };
    document.getElementById("table").appendChild(table);
    bindButtons();
};