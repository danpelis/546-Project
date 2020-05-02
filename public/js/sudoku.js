const startForm = document.getElementById("start-form");
const staticForm = document.getElementById("static-form");
const defeatForm = document.getElementById("defeat");
const saveForm = document.getElementById("save");
const loadForm = document.getElementById("load");

let startTime = 0;
let endTime = 0;
let difficultyScore = {
    'easy': 1,
    'intermediate': 5,
    'hard': 10
};

<<<<<<< HEAD

function checkScoreBoard(score, username = 'Anon'){
    let mapId = window.location.href.split("/").slice(-1)[0];
    let scoreTable = document.getElementById("highscore-table");
    document.getElementById("username").innerHTML.split(" ").slice(-1)[0].slice(0,-1)
    let newScore = {}
    for (let i = 1; i < 4; i++){
        if (score > scoreTable.childNodes[1].childNodes[(i*2)].cells[2].firstChild.data){
            scoreTable.childNodes[1].childNodes[(i*2)].cells[2].firstChild.data = score;
            scoreTable.childNodes[1].childNodes[(i*2)].cells[1].firstChild.data = username;
            newScore["rank"] = i;
            newScore["name"] = username;
            newScore["score"] = score;

            let requestConfig = {
                method: 'POST',
                url: '/maps/newScore',
                contentType: 'application/json',
                data: JSON.stringify({
                    mapId: mapId,
                    scoreData: newScore
                })
            };
            $.ajax(requestConfig).then(function(responseMessage) {});
            return;
        }

    }
}

=======
>>>>>>> ec06f4114b12b1b783fc3a86cf7ae311f77817ed
if (startForm) {
    startForm.addEventListener("submit", event => {
        let startDate = new Date();
        startTime = startDate.getTime()/1000;
        console.log(`Start Time: ${startTime}`);
        event.preventDefault();
        document.getElementById("static-form").removeAttribute("hidden");
        document.getElementById("game-functions").removeAttribute("hidden");
        document.getElementById("start").style = 'display:none;';
    });
}
if (staticForm) {
    staticForm.addEventListener("submit", event => {
        event.preventDefault();
        let wrong = false;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let element = document.getElementById(`${i}:${j}`);
                let solution = document.getElementById(`s${i}:${j}`);
                if (element.classList.contains("input-cell") && element.value != solution.innerHTML){
                    element.classList.add('incorrect');
                    wrong = true;
                }
                if (element.classList.contains("input-cell") && element.value == solution.innerHTML){
                    element.classList.remove('incorrect');
                }
            }
        }
        if(!wrong){
            let endDate = new Date();
            endTime = endDate.getTime()/1000;
            let difficultyMultiplier = difficultyScore[document.getElementById('difficulty').innerHTML];
            console.log((1000000/(endTime - startTime)));
            let score = Math.round(difficultyMultiplier * (1000000/(endTime - startTime)));
            console.log(score);
<<<<<<< HEAD
            let username;
            try{
                username = document.getElementById("username").innerHTML.split(" ").slice(-1)[0].slice(0,-1)
                checkScoreBoard(score, username);
            } catch (e){
                checkScoreBoard(score);
            }
            alert(`You Win!\nScore: ${score}`);
=======
            alert(`You Win!\nScore: ${score}`);

>>>>>>> ec06f4114b12b1b783fc3a86cf7ae311f77817ed
        }
    });
}

if (defeatForm) {
    defeatForm.addEventListener("submit", event => {
        event.preventDefault();
        document.getElementById("map").style = 'display:none;';
        document.getElementById("game-functions").style = 'display:none;';
        document.getElementById("solution").removeAttribute("hidden");
    });
}

if(saveForm) {
    saveForm.addEventListener("submit", event => {
        event.preventDefault();
        let table = [];
        for(let i = 0; i < 8; i++){
            let row = [];
            for(let j = 0; j < 8; j++){
                let element = document.getElementById(`${i}:${j}`);
                if (element.classList.contains("input-cell")){
                    row.push(element.value);
                }
                else{
                    row.push(element.innerHTML);
                }
            }
            table.push(row);
        }
        
        let mapId = document.getElementById("savedMapId").value;
        let endDate = new Date();
        endTime = endDate.getTime()/1000;
        let time = endTime - startTime;
        console.log(`Saved Game: ID ${mapId} Time ${time} Data ${table}`);
<<<<<<< HEAD
        let requestConfig = {
            method: 'post',
            contentType: "application/json" ,
            data: JSON.stringify({
=======
        return fetch('/user/save',{
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
>>>>>>> ec06f4114b12b1b783fc3a86cf7ae311f77817ed
                time: time,
                mapData: table,
                mapId: mapId
            })
<<<<<<< HEAD
        };
        $.ajax(requestConfig).then(function(responseMessage) {
            return $(responseMessage)
=======
>>>>>>> ec06f4114b12b1b783fc3a86cf7ae311f77817ed
        });
    });
}

if (loadForm) {
    loadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let mapId = document.getElementById("savedMapId").value;
<<<<<<< HEAD
        let requestConfig = {
            method: 'POST',
            url: '/user/load',
            contentType: 'application/json',
            data: JSON.stringify({
                mapId: mapId
            })
        };
        $.ajax(requestConfig).then(function(responseMessage) {
            let loadedData = $(responseMessage)[0]['mapData'];
            let loadedTime = $(responseMessage)[0]['time']; 
            startTime = startTime - loadedTime 
            console.log(startTime)
            for(let i = 0; i < 8; i++){
                for(let j = 0; j < 8; j++){
                    let element = document.getElementById(`${i}:${j}`);
                    let savedCell = loadedData[i][j];
                    if (element.classList.contains("input-cell")){
                        element.value = savedCell;
                    }
                }
            }
        });
=======
        let savedData = await fetch('/user/load',{
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mapId: mapId
            })
        });
        console.log(savedData.json());
        let loadedData = savedData.json().body.mapData;
        console.log(loadedData)
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                let element = document.getElementById(`${i}:${j}`);
                let savedCell = loadedData[i][j];
                if (element.classList.contains("input-cell")){
                    element.value = savedCell;
                }
            }
        }
>>>>>>> ec06f4114b12b1b783fc3a86cf7ae311f77817ed
    });
}