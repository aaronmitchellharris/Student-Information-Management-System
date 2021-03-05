function submit(event){
    if ((document.getElementById('code').value != "") && 
        (document.getElementById('name').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'insert', department:null, name:null, department:null};
        payload.name = document.getElementById('name').value;
        payload.department = document.getElementById('code').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/departments' , true);
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
        document.getElementById('code').value = "";

    } else {
        console.log("Error: Info Missing");
    };
    event.preventDefault();
};

function bindButtons(){
    document.getElementById('postSubmit').addEventListener('click', submit);
};

function initial(){
    var req = new XMLHttpRequest();
    var payload = {task:'initial'};
    req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/departments' , true);
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
    var headerIcount = document.createElement("th");
    var headerCcount = document.createElement("th");

    headerID.textContent = "CODE";
    headerName.textContent = "Name";
    headerIcount.textContent = "Instructor Count";
    headerCcount.textContent = "Course Count";

    thead.appendChild(headerRow);
    headerRow.appendChild(headerID);
    headerRow.appendChild(headerName);
    headerRow.appendChild(headerIcount);
    headerRow.appendChild(headerCcount);

    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < tableInfo.results.length; i++){
        var current = document.createElement("tr");
        var id = document.createElement("td");
        var name = document.createElement("td");
        var icount = document.createElement("td");
        var ccount = document.createElement("td");

        id.textContent = tableInfo.results[i].department_code;
        name.textContent = tableInfo.results[i].name;
        icount.textContent = tableInfo.results[i].instructor_count;
        ccount.textContent = tableInfo.results[i].course_count;

        current.appendChild(id);
        current.appendChild(name);
        current.appendChild(icount);
        current.appendChild(ccount);
        tbody.appendChild(current);
        table.appendChild(tbody);
    };
    document.getElementById("table").appendChild(table);
    bindButtons();
};