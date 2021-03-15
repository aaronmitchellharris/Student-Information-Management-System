function submit(event){
    if ((document.getElementById('sid').value != "") && 
        (document.getElementById('cid').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'insert', sid:null, cid:null};
        payload.sid = document.getElementById('sid').value;
        payload.cid = document.getElementById('cid').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students_courses' , true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                response.results = JSON.parse(response.results);
                buildTable(response);
            }
        });

        document.getElementById('sid').value = "";
        document.getElementById('cid').value = "";

    } else {
        alert("Error: Info Missing");
    };
    event.preventDefault();
    location.reload();
};

function deleteStudentCourse(event){
     
    var req = new XMLHttpRequest();
    var payload = {task:'delete', sid:null, cid:null};
    payload.sid = event.target.previousSibling.value;
    payload.cid = event.target.previousSibling.previousSibling.value;

    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students_courses' , true);
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
    location.reload();
};

function bindButtons(){
    document.getElementById('postSubmit').addEventListener('click', submit);
    var deleteButtons = document.getElementsByClassName('delete');
    for (var i = 0; i < deleteButtons.length; i++){
        deleteButtons[i].addEventListener('click', deleteStudentCourse);
    }
};

function initial(){
    var req = new XMLHttpRequest();
    var payload = {task:'initial'};
    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students_courses' , true);
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
    var headerSid = document.createElement("th");
    var headerCid = document.createElement("th");
    var headerGrade = document.createElement("th");

    headerSid.textContent = "Student ID";
    headerCid.textContent = "Course ID";
    headerGrade.textContent = "Grade";

    thead.appendChild(headerRow);
    headerRow.appendChild(headerSid);
    headerRow.appendChild(headerCid);
    headerRow.appendChild(headerGrade);

    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < tableInfo.results.length; i++){
        var current = document.createElement("tr");
        var sid = document.createElement("td");
        var cid = document.createElement("td");
        var grade = document.createElement("td");

        sid.textContent = tableInfo.results[i].student_id;
        cid.textContent = tableInfo.results[i].course_id;
        grade.textContent = tableInfo.results[i].grade;
        
        var edit = document.createElement("td");
        var editForm = document.createElement("form");
        var editSId = document.createElement("input");
        var editCId = document.createElement("input");
        editForm.action = "/students_courses/update";
        editSId.type = "hidden";
        editSId.name = "sid";
        editSId.value = tableInfo.results[i].student_id;
        editCId.type = "hidden";
        editCId.name = "cid";
        editCId.value = tableInfo.results[i].course_id;
        var editSubmit = document.createElement("input");
        editSubmit.type = "submit";
        editSubmit.value = "Edit";
        editSubmit.className += "edit btn btn-primary";
        edit.appendChild(editForm);
        edit.appendChild(editSubmit);
        editForm.appendChild(editSId);
        editForm.appendChild(editCId);
        editForm.appendChild(editSubmit);
        edit.appendChild(editForm);

        var deleteTd = document.createElement("td");
        var deleteForm = document.createElement("form");
        var deleteId = document.createElement("input");
        var deleteId2 = document.createElement("input");
        deleteId.type = "hidden";
        deleteId2.type = "hidden";
        deleteId.value = tableInfo.results[i].course_id;
        deleteId2.value = tableInfo.results[i].student_id
        var deleteSubmit = document.createElement("input");
        deleteSubmit.type = "submit";
        deleteSubmit.value = "Delete";
        deleteSubmit.className += "delete btn btn-danger";
        deleteForm.appendChild(deleteId);
        deleteForm.appendChild(deleteId2);
        deleteForm.appendChild(deleteSubmit);
        deleteTd.appendChild(deleteForm);

        current.appendChild(sid);
        current.appendChild(cid);
        current.appendChild(grade);
        current.appendChild(edit)
        current.appendChild(deleteTd)
        tbody.appendChild(current);
        table.appendChild(tbody);
    };
    document.getElementById("table").appendChild(table);
    bindButtons();
};