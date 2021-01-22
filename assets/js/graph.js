
function main(dataFilePath){
    var p = document.createElement("p");
    p.textContent = "coucou je suis le futur graphique !<br> ["+dataFilePath+"]<br>"+readFile(dataFilePath);

    document.querySelector("#graph").appendChild(p);
}


/**
 * Read file return content
 * @apram file path
 * @return row file content
 */
function readFile(fille){
    var file = new XMLHttpRequest();
    var content;
    file.open("GET", fille, false);
    if(file.readyState === 4){
      content = file.responseText;
    }
    return content;
  }