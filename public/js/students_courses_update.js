function submit(event){
    if ((document.getElementById('sid').value != "") && 
        (document.getElementById('cid').value != "") &&
        (document.getElementById('grade').value != "")){
        
        var req = new XMLHttpRequest();
        var payload = {task:'insert', sid:null, cid:null, grade:null};
        payload.sid = document.getElementById('sid').value;
        payload.cid = document.getElementById('cid').value;
        payload.grade = document.getElementById('grade').value;

        req.open('POST', 'http://flip3.engr.oregonstate.edu:5550/students_courses/update' , true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(payload));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                alert("Update Successful");
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