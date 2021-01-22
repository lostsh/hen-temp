
function main(dataFilePath){
    var p = document.createElement("p");
    p.textContent = "["+dataFilePath+"]<br>"+readFile(dataFilePath);

    const graph = document.querySelector("#graph");
    graph.appendChild(p);
}


/**
 * Read file return content
 * @apram file path
 * @return row file content
 */
function readFile(fPath){
    var file = new XMLHttpRequest();
    var content;
    file.open("GET", fPath, false);
    file.send(null);
    if(file.readyState === 4){
      content = file.responseText;
    }
    return content;
  }