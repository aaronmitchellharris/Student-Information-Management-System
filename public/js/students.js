function submit(event){
    if ((document.getElementById('fname').value != "") && 
        (document.getElementById('lname').value != "") &&
        (document.getElementById('egdate').value != "") &&
        (document.getElementById('unitsProgress').value != "") &&
        (document.getElementById('unitsCompleted').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'insert', fname:null, lname:null, egdate:null, department:null, major:null, unitsCompleted:null, unitsProgress:null};
        payload.fname = document.getElementById('fname').value;
        payload.lname = document.getElementById('lname').value;
        payload.egdate = document.getElementById('egdate').value;
        payload.department = document.getElementById('department').value;
        payload.major = document.getElementById('major').value;
        payload.unitsCompleted = document.getElementById('unitsCompleted').value;
        payload.unitsProgress = document.getElementById('unitsProgress').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students' , true);
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
        document.getElementById('major').value = "";
        document.getElementById('egdate').value = "";
        document.getElementById('department').value = "";
        document.getElementById('unitsProgress').value = "";
        document.getElementById('unitsCompleted').value = "";

    } else {
        alert("Error: Info Missing");
    };
    event.preventDefault();
};

function search(event){
    if ((document.getElementById('fnameSearch').value != "") |
        (document.getElementById('lnameSearch').value != "") |
        (document.getElementById('majorSearch').value != "") |
        (document.getElementById('departmentSearch').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'search', fname:null, lname:null, department:null, major:null};
        payload.fname = document.getElementById('fnameSearch').value;
        payload.lname = document.getElementById('lnameSearch').value;
        payload.department = document.getElementById('departmentSearch').value;
        payload.major = document.getElementById('majorSearch').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students' , true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                response.results = JSON.parse(response.results);
                buildTable(response);
            }
        });

    } else {
        console.log("Error: Info Missing");
    };
    event.preventDefault();
};

function bindButtons(){
    document.getElementById('postSubmit').addEventListener('click', submit);
    document.getElementById('postSearch').addEventListener('click', search);
};

function buildList(){
    var req = new XMLHttpRequest();
    var payload = {task:'list'};
    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students' , true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            var response = JSON.parse(req.responseText);
            response.results = JSON.parse(response.results);
            
            var lists = document.getElementsByClassName("departments");
            for (var i = 0; i < response.results.length; i++){
            
                var current = document.createElement("option");
                current.value = response.results[i].department_code;
                var t = document.createTextNode(response.results[i].department_code);
                current.appendChild(t);
                for (var j = 0; j < lists.length; j++){
                    lists[j].appendChild(current);
                }
            }  
        }
    });
};

function initial(){
    var req = new XMLHttpRequest();
    var payload = {task:'initial'};
    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students' , true);
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
buildList();
initial();
function buildTable(tableInfo){
    document.getElementsByTagName("table")[0].remove();
    var table = document.createElement("table");
    table.className = "table";

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerID = document.createElement("th");
    var headerFN = document.createElement("th");
    var headerLN = document.createElement("th");
    var headerGradDate = document.createElement("th");
    var headerUnitsIP = document.createElement("th");
    var headerUnitsC = document.createElement("th");
    var headerDep = document.createElement("th");
    var headerMajor = document.createElement("th");

    headerID.textContent = "ID";
    headerFN.textContent = "First Name";
    headerLN.textContent = "Last Name";
    headerMajor.textContent = "Major";
    headerDep.textContent = "Department";
    headerUnitsIP.textContent = "Units In Progress";
    headerUnitsC.textContent = "Units Completed";
    headerGradDate.textContent = "Expected Graduation Date";

    thead.appendChild(headerRow);
    headerRow.appendChild(headerID);
    headerRow.appendChild(headerFN);
    headerRow.appendChild(headerLN);
    headerRow.appendChild(headerMajor);
    headerRow.appendChild(headerDep);
    headerRow.appendChild(headerUnitsIP);
    headerRow.appendChild(headerUnitsC);
    headerRow.appendChild(headerGradDate);

    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < tableInfo.results.length; i++){
        var current = document.createElement("tr");
        var id = document.createElement("td");
        var first_name = document.createElement("td");
        var last_name = document.createElement("td");
        var major = document.createElement("td");
        var department = document.createElement("td");
        var units_in_progress = document.createElement("td");
        var units_completed = document.createElement("td");
        var expected_graduation_date = document.createElement("td");

        id.textContent = tableInfo.results[i].student_id;
        first_name.textContent = tableInfo.results[i].first_name;
        last_name.textContent = tableInfo.results[i].last_name;
        major.textContent = tableInfo.results[i].major;
        department.textContent = tableInfo.results[i].department_code;
        units_in_progress.textContent = tableInfo.results[i].units_in_progress;
        units_completed.textContent = tableInfo.results[i].units_completed;

        var date = tableInfo.results[i].expected_graduation_date;
        date = date.charAt(0)+date.charAt(1)+date.charAt(3)+date.charAt(4)+"-"+date.charAt(5)+date.charAt(7)+"-"+date.charAt(8)+date.charAt(9);
        expected_graduation_date.textContent = date;

        var edit = document.createElement("td");
        var editForm = document.createElement("form");
        var editId = document.createElement("input");
        editForm.action = "/students/update";
        editId.type = "hidden";
        editId.name = "id";
        editId.value = tableInfo.results[i].student_id;
        var editSubmit = document.createElement("input");
        editSubmit.type = "submit";
        editSubmit.value = "Edit";
        editSubmit.className += "edit btn btn-primary";
        edit.appendChild(editForm);
        edit.appendChild(editSubmit);
        editForm.appendChild(editId);
        editForm.appendChild(editSubmit);
        edit.appendChild(editForm);

        current.appendChild(id);
        current.appendChild(first_name);
        current.appendChild(last_name);
        current.appendChild(major);
        current.appendChild(department);
        current.appendChild(units_in_progress);
        current.appendChild(units_completed);
        current.appendChild(expected_graduation_date);
        current.appendChild(edit)
        tbody.appendChild(current);
        table.appendChild(tbody);
    };
    document.getElementById("table").appendChild(table);
    bindButtons();
};