function generate(username) {
    if(!username) username = "Map";
    let map = [];
    for(let i=1;i<=9;i++){
        let row = [];
        for(let j=1;j<=9;j++){
            row.push(0);
        }
        map.push(row);
    }

    let postFixName = Math.round(Math.random()*1000)+"";

    let res = {
        mapName: username+"::"+postFixName,
        mapData: deepCopy(map),
        solution:deepCopy(map),
        difficulty: "easy",
        scoreData: [
            {
                rank: 1,
                user: '-',
                score: 0
            },
            {
                rank: 2,
                user: '-',
                score: 0
            },
            {
                rank: 3,
                user: '-',
                score: 0
            },
        ]
    }

    // get the solution firstly
    let flag = false;
    while(!flag){
        map = [];
        for(let i=1;i<=9;i++){
            let row = [];
            for(let j=1;j<=9;j++){
                row.push(0);
            }
            map.push(row);
        }
        let mid = [];
        let nums = [1,2,3,4,5,6,7,8,9]
        for(let i=1;i<=9;i++){
            let temp = Math.floor(Math.random()*(nums.length));
            mid.push(nums[temp]);
            nums.splice(temp, 1);
        }
        for(let i=0;i<9;i++){
            map[i][0] = mid[i];
        }

        flag = solveSudoku(map);
    }
    res.solution = deepCopy(map);

    //and then get the difficulty
    let difficulty = Math.floor(Math.random()*3);
    let difficultyChoice = ["easy", "medium", "hard"];
    res.difficulty = difficultyChoice[difficulty];

    //and then the map
    map[1][1] = null;
    difficulty = (3+difficulty)*10;
    for(let i=0;i<difficulty;i++){
        map[Math.floor(Math.random()*9)][Math.floor(Math.random()*9)] = null;
    }
    res.mapData = deepCopy(map);

    return res;
}

function isValid(map){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            for(let k=j+1;k<9;k++){
                //for repeat on col or row
                if(map[i][j]==map[i][k] || map[j][i] == map[k][i]) return false;
            }
        }
    }

    //for the  3*3 blocks
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            let temp =[];
            for(let a=0;a<3;a++){
                for(let b=0;b<3;b++){
                    if(temp.includes(map[i+a][j+b])) return false;
                    temp.push(map[i+a][j+b]);
                }
            }
        }
    }
}

function deepCopy(map){
    let res = [];
    for(let i=0;i<map.length;i++){
        let temp= [];
        for(let j=0;j<map[i].length;j++){
            temp.push(map[j][i]);
        }
        res.push(temp);
    }
    return res;
}

function getArr(c, r){
    let res = [];
    for(let i=0;i<c;i++){
        let temp = [0,0,0,0,0,0,0,0,0,0];
        res.push(temp);
    }
    return res;
}

function solveSudoku(board) {
    let histr = getArr(9, 10);
    let histc = getArr(9, 10);
    let histb = getArr(9, 10);

    for(let i = 0; i < 9; i++)
        for(let j = 0; j < 9; j++)
            if(board[i][j]!=0)
            {
                let v = board[i][j];
                histr[i][v]++;
                histc[j][v]++;
                histb[Math.floor(i/3)*3+Math.floor(j/3)][v]++;
            }
    let res = DFS(board, 0, 0, histr, histc, histb);
    return res;
}
    
function DFS( board,  i,  j,  histr,  histc,  histb)
{
    if(i == 8 && j == 8)
    {
        if(board[i][j]!=0){                
            return true;
        }
        else
        {
            for(let v = 1; v <= 9; v++)
            {
                if(histr[i][v] == 0 && histc[j][v] == 0 && histb[Math.floor(i/3)*3+Math.floor(j/3)][v] == 0)
                {
                    board[i][j] = v;
                    return true;
                }
            }
            return false;
        }
    }
    if(j == 9 )
    {
        return DFS(board, i+1, 8, histr, histc, histb);
    }
    if(j <0 )
    {
        return DFS(board, i+1, 0, histr, histc, histb);
    }
    if(board[i][j]!=0)
    {
        if(i%2==0){
            return DFS(board, i, j+1, histr, histc, histb);
        }            
        else {            
            return DFS(board, i, j-1, histr, histc, histb);
        }
    }
    for(let v = 1; v <= 9; v++)
    {
        if(histr[i][v] == 1 || histc[j][v] == 1 || histb[Math.floor(i/3)*3+Math.floor(j/3)][v] == 1) continue;
        board[i][j] = v;
        histr[i][v]++;
        histc[j][v]++;
        histb[Math.floor(i/3)*3+Math.floor(j/3)][v]++;
       
        if(i%2==0){ 
            if(DFS(board, i, j+1, histr, histc, histb))
                return true;
        }            
        else {            
            if(DFS(board, i, j-1, histr, histc, histb)) 
                return true;
        }
        histr[i][v]--;
        histc[j][v]--;
        histb[Math.floor(i/3)*3+Math.floor(j/3)][v]--;
        board[i][j] = 0;
    }
    return false;
}


let map = generate();
// console.log(map);

module.exports = {generate};
