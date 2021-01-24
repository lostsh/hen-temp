function table(filePath){
    var allDatas = parse(readFile("data.csv"));
    var page = urlGetPage().page;

    if(page > allDatas.length/10) page = 0;//if page is too big
    if(page == 0){ //search for last page start index
        page = (allDatas.length-10)/10;
    }else{
        page--;
    }

    var dataToDisplay = [];
    for(var i=(page*10); i<(page*10)+10; i++){
        dataToDisplay.push(allDatas[i]);
    }

    drawTable(dataToDisplay);
    drawNavArrows(0, allDatas.length/10);
}

/**
 * Return the page from the url
 * like https://.../index.html#page=X : return X
 * If page not found return 0
 */
function urlGetPage(){
    var params = {
        'page' : 0
    };
    var pageUrl = window.location.href;
    if(pageUrl.indexOf("#page=") > 0){
        if(pageUrl.indexOf("#", pageUrl.indexOf("#")+1) > 0){
            params.page = parseInt(pageUrl.substr(pageUrl.indexOf("#page=")+6, pageUrl.indexOf("#", pageUrl.indexOf("#page=")+6)));
        }else if(pageUrl.indexOf("#")+6 < pageUrl.length){
            params.page = parseInt(pageUrl.substr(pageUrl.indexOf("#page=")+6, pageUrl.length));
        } 
        if(isNaN(params.page) || params.page < 0) params.page = 0;
    }
    return params;
}

function drawTable(data){
    var table = document.createElement("table");
    table.border = "1";

    data.forEach(line => {
        var row = document.createElement("tr");
        line.forEach(value => {
            var td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    const parent = document.querySelector('#tableContainer');
    parent.appendChild(table);
}

function drawNavArrows(min, max){
    var left = document.createElement("a");
    left.href = "#page="+(urlGetPage().page-1);
    left.textContent  = "<=";
    left.onclick = refresh;
    var right = document.createElement("a");
    right.href = "#page="+(urlGetPage().page+1);
    right.textContent  = "=>";
    right.onclick = refresh;

    const parent = document.querySelector('#navContainer');
    if(urlGetPage().page-1 >= min) parent.appendChild(left);
    if(urlGetPage().page+1 <= max) parent.appendChild(right);
}

// DO NOT WORK YETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
function refresh(){// DO NOT WORK YETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
    // DO NOT WORK YETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
    console.clear();
    //window.location.href = window.location.href;
    //window.location.assign(window.location.href);
    //location.href = window.location.href;
    //window.location.reload(true);
}
// DO NOT WORK YETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

/**
 * Read file return content
 * @apram file path
 * @return row file content
 */
function readFile(fPath) {
    var file = new XMLHttpRequest();
    var content;
    file.open("GET", fPath, false);
    file.send(null);
    if (file.readyState === 4) {
        content = file.responseText;
    }
    return content;
}

/**
 * Get row data, renturn array
 * each line is an array
 * @param {*} rowData 
 */
function parse(rowData){
    var data = [];
    rowData.split('\n').forEach(line=>{
        line = line.split(',');
        if(line.length >= 2 && !isNaN(parseInt(line[2]))){
            data.push([line[0], line[1], parseInt(line[2])]);
        }
    });
    return data;
}