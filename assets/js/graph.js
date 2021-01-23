
function main(dataFilePath){
    var data = readFile(dataFilePath);
    graphMaker(data);
}


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

function graphMaker(datas, graphId="graph"){
    var pathStr = pathForGraph(parseData(datas));

    var graph = document.querySelector("#"+graphId);
    graph.style.backgroundColor = "grey";
    graph.style.width = "100vw";
    graph.style.height = "500px";
    graph.style.clipPath = "polygon("+pathStr+")";
    
    //var p = document.createElement("p");
    //p.textContent = datas;
    //graph.appendChild(p);
}

/**
 * Use parsed data, return Clip Path polygon
 * To make a graph
 * @param {*} data Parsed values
 */
function pathForGraph(data){
    var pathStr = "0 100%, ";
    
    data.forEach(function(coord){
        pathStr+=coord;
    });

    pathStr+=" 100% 100%, 0 100%";
    return pathStr;
}

/**
 * Parse Row datas from csv file
 * @param {*} data row csv data
 */
function parseData(data){
    var coords = []; // coord array to return
    
    var MINTMP = -20;
    var MAXTMP = 50;

    var datasLines = data.split('\n');
    /* exploitable data ignore the last '\n' */
    var dataLength = datasLines.length-1;

    console.log("[*] Number of exploitable values: "+dataLength+"\n");
    
    for(var i=0;i<dataLength;i++){
        var line = datasLines[i].split(',');

        if(line != "" && line.length >= 3 && i>0)
        {
            var x = map(i, 0, dataLength, 0, 100);

            /* Map to have value between 0 and 100 */
            var y = map(line[2], MINTMP, MAXTMP, 0, 100);

            /* Because of the graph is reversed, the 0 is on the to
             * to reverse it, substract it from the max, so from 100
             */
            var yBar = 100-y;

            /* coords array form ["10% 34%, ", "10% 12%, "] */
            coords.push(x+'% '+yBar+'%, ');
        }

        console.log("--> "+line+"\n");
        console.log(line);
    }

    /*
    datasLines.forEach(function(line){
        console.log(line.split(','));
    });*/

    return coords;
}

function map(value, minSrc, maxSrc, minDest, maxDest){
    if( value < minSrc || value > maxSrc) return 0;
    return (value*maxDest)/maxSrc;
}

/**
 * Create a div with absolute position
 * @param {*} parent parent node
 * @param {*} x abciss
 * @param {*} y ordonnate
 * @param {*} value Text title isplay on hover
 */
function createPoint(parent, x, y, value="point"){

    var ptContainer = document.createElement("div");
    ptContainer.style.position = "absolute";
    ptContainer.style.width = "auto";
    ptContainer.style.height = "auto";
    ptContainer.style.padding = "2px";
    ptContainer.style.borderRadius = "100%";
    ptContainer.style.top = ((x-1)+"px");
    ptContainer.style.left = (y-1)+"px";
    ptContainer.backgroundColor = "red";
    ptContainer.style.border = "1px solid black";
    ptContainer.className = "pointContainer";
    ptContainer.title = value;

    var point = document.createElement("div");
    //point.style.position = "absolute";
    point.style.width = "2px"
    point.style.height = "2px";
    point.style.borderRadius = "100%";
    //point.style.backgroundColor = "black";
    point.style.border = "1px solid black";
    //point.style.top = ((x-2.5)+"px");
    //point.style.left = (y-2.5)+"px";

    ptContainer.appendChild(point);

    parent.appendChild(ptContainer);
}