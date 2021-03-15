function submit(event){
    if ((document.getElementById('id').value != "") &&
        (document.getElementById('fname').value != "") && 
        (document.getElementById('lname').value != "") &&
        (document.getElementById('egdate').value != "") &&
        (document.getElementById('unitsProgress').value != "") &&
        (document.getElementById('unitsCompleted').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'update', id:null, fname:null, lname:null, egdate:null, department:null, major:null, unitsCompleted:null, unitsProgress:null};
        payload.id = document.getElementById('id').value;
        payload.fname = document.getElementById('fname').value;
        payload.lname = document.getElementById('lname').value;
        payload.egdate = document.getElementById('egdate').value;
        payload.department = document.getElementById('department').value;
        payload.major = document.getElementById('major').value;
        payload.unitsCompleted = document.getElementById('unitsCompleted').value;
        payload.unitsProgress = document.getElementById('unitsProgress').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students/update' , true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                alert("Update Successful")
            }
        });

    } else {
        alert("Error: Info Missing");
    };
    event.preventDefault();
};

function bindButtons(){
    document.getElementById('postUpdate').addEventListener('click', submit);
};

bindButtons();