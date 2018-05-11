var addBtn = document.getElementById('btnAddToDo');
var list = document.getElementById("ToDoListTasks");

/*Performs a GET request to get all tasks stored in the DB.
Calls addToList to update the tasks displayed.*/
function updateList(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "tasks/");
    /*Preparing request body */
    xhr.addEventListener("load", addToList)
    xhr.send();

}


/**
This function is invoked after a manual POST request is made. It is used to
take the description of the task from the response body, and append it to the
to do list.
**/
function addToList(){

/*Clear the list to avoid duplication*/
while (list.firstChild) {
    while(list.firstChild.firstChild){
        list.firstChild.removeChild(list.firstChild.firstChild);
    }
    list.removeChild(list.firstChild);
}

/*Receive request body*/
    var data = this.response;
    var dataArray = JSON.parse(data);
/*Iterate through each task and append it to the list.*/
    for(var i = 0; i < dataArray.length; i++){
        var listItem = document.createElement("li");

        var checkValue = dataArray[i]['completed'];
        //add checkbox first so it floats left
        var check = document.createElement('input');
        if(!checkValue){
            check.className = "btncontainer";
        }
        else{
            check.className = "containerAfterClick";
        }
        check.type = "button";
        listItem.appendChild(check);


/*Event listener for marking a task complete*/
            check.addEventListener("click", function(){
                var xhr = new XMLHttpRequest();
                var id = this.parentElement.id;
                var URL = "tasks/complete/" + id;
                    xhr.open("PUT", URL);
                    /*Preparing request body */
                    xhr.addEventListener("load", updateList)
                    xhr.send();

        });

/*Place text in a span so a user is also able to click on
text to mark a task as complete*/
        var textBox = document.createElement("span");
        textBox.textContent = dataArray[i]['description'];
        textBox.setAttribute('class', "listText");
        textBox.addEventListener("click", function(){
            if(!this.isContentEditable){

                var xhr = new XMLHttpRequest();
                var id = this.parentElement.id;
                var URL = "tasks/complete/" + id;
                    xhr.open("PUT", URL);
                    /*Preparing request body */
                    xhr.addEventListener("load", updateList)
                    xhr.send();
            }
            else{
                this.setAttribute('class', "noPointer");
            }
                });
        listItem.appendChild(textBox);
        //listItem.innerHTML = dataArray[i]['description'];
        //listItem.class = "listInnerText";

        listItem.id = dataArray[i]['id'];
    /*Create a button to delete a task*/
        var delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "btnDeleteTask";
            delBtn.innerHTML = "delete";

    /*Add delete functionality*/
        delBtn.addEventListener("click", function(){

    /*Get id of list item and append into URL for request*/
            var id = this.parentElement.id;
            var xhr = new XMLHttpRequest();
            var URL = "tasks/" + id;
                xhr.open("DELETE", URL);
                /*Preparing request body */
                xhr.addEventListener("load", updateList);
                xhr.send();


            });

    /*Append delete button to the list item*/
        listItem.appendChild(delBtn);

    /*This is just for looks. Has no functionality.*/
            var sp = document.createElement("span");
                sp.innerHTML = "|";
                sp.className = "separator";

    /*Append separator to list item.*/
            listItem.appendChild(sp);

    /*Create a button to edit a task*/
            var edBtn = document.createElement("button");
                edBtn.type = "button";
                edBtn.className = "btnEditTask";
                edBtn.innerHTML = "edit";

    /*Add edit functionality*/
            edBtn.addEventListener("click", function(){


        /*Make the text editable and put cursor onto text */
                var ch = this.previousSibling.previousSibling.previousSibling;
                    ch.contentEditable = "true";
                    window.setTimeout(function () {
                       ch.focus();
                    }, 0);

                    ch.addEventListener("keyup", function(event) {
        /*Stop editing after enter is pressed*/
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        this.contentEditable = "false";
        /*Get new content and append into AJAX request*/
                        var txt = this.innerHTML;
        /*Sometimes the "enter" press adds a br, even though preventDefault is the first
        statement. */
                        txt = txt.replace("<br>", "");


                        document.getElementById("txbNewToDo").focus();
                        var data = {};
                        data['description'] = txt;
                        /*Get id of list item and append into URL for request*/
                    var id = this.parentElement.id;
                    var xhr = new XMLHttpRequest();


                    var URL = "tasks/" + id;
                        xhr.open("PUT", URL);
                        /*Preparing request body */
                        xhr.addEventListener("load", updateList);
                        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                        xhr.send(JSON.stringify(data));
                        return false;

                    }


                });
                ch.addEventListener("blur", function(event) {
                    /*Stop editing after mouse is moved*/

                    event.preventDefault();
                    this.contentEditable = "false";
                    /*Get new content and append into AJAX request*/
                    var txt = this.textContent;

                    document.getElementById("txbNewToDo").focus();
                    var data = {};
                    data['description'] = txt;
                    var id = this.parentElement.id;
                    var xhr = new XMLHttpRequest();


                    var URL = "tasks/" + id;
                        xhr.open("PUT", URL);
                        /*Preparing request body */
                        xhr.addEventListener("load", updateList);
                        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    xhr.send(JSON.stringify(data));
                    return false;




                            });
        });

    /*Append edit button to the list item.*/
                listItem.appendChild(edBtn);

        list.appendChild(listItem);
    }
}

/*Adds click event listener to the "ADD" button to add a task
to the list. Invokes an AJAX request.*/

addBtn.addEventListener("click", function(){


        var xhr = new XMLHttpRequest();
        xhr.open("POST", "tasks/");
        /*Preparing request body */
        var txt = document.getElementById('txbNewToDo');
        var body = txt.value;
        var data = {};
        data['description'] = body;

        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.addEventListener("load", updateList);
        /*Do not allow user to add empty value*/
        if(body != ""){
             xhr.send(JSON.stringify(data));
        }
        /*Clears the input box of previous task.*/
        document.getElementById('txbNewToDo').value = "";


});
/*Adds keyboard event listener to the input text box to add a task
to the list when enter is pressed. Invokes an AJAX request.*/
 var inputTextBox = document.getElementById('txbNewToDo');

inputTextBox.addEventListener("keyup", function(){

    if (event.keyCode === 13) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "tasks/");
        /*Preparing request body */

        var body = this.value;
        var data = {};
        data['description'] = body;

        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.addEventListener("load", updateList);
        /*Do not allow user to add empty value*/
        if(body != ""){
             xhr.send(JSON.stringify(data));
        }
        /*Clears the input box of previous task.*/
        document.getElementById('txbNewToDo').value = "";
    }

});