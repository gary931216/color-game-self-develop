


window.onload = function() {
    let start = document.querySelector(".start");
    let timer_div = document.querySelector(".timer");
    let score_div = document.querySelector(".score");
    let game_space = document.querySelector(".game-space");

    let heightscore_div = document.querySelector(".heightest-score");
    
    let myStroage = window.localStorage;
    let date = new Date();
    console.dir(date);
    
    if(myStroage.getItem(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`)){
       console.log("a"); 
    }else{
        console.log("b");
        myStroage.setItem(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,"[]");
    }
    
    getTodayHighestScore(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,myStroage, heightscore_div);
    
    console.log(start);
    let game_state = 0;
    start.addEventListener("click", function(){
        if(!game_state){
            let commentary = document.querySelector(".commentary");
            commentary.classList.add("starting");
            game_state = 1;
            
            //生成遊戲區塊
            let score = 0;
            let div_number = 2;
            let color = random_color()
            let change_color = 0.6;
            creat_game_div(score,score_div,div_number, game_space, change_color, color,1);
            score_div.innerHTML = `${score}分`

            // 處理計時器
            let timer = 10; //遊戲時間
            timer_div.innerHTML = `${timer}秒`
            let interval = setInterval(function(){
                if(timer > 0){
                    timer -= 1;
                    timer_div.innerHTML = `${timer}秒`
                }else {
                    game_state = 0;
                    creat_game_div(score,score_div,div_number, game_space, change_color, color, 0, myStroage, date); 


                    
                    let end_score_div = document.querySelector(".end_score");
                    score = end_score_div.innerHTML;
                    score = score.replace("分", "");
                    score = Number(score);

                    //更新本日最高分
                    let myJson = myStroage.getItem(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`);
                    let scoreObject = JSON.parse(myJson);
                    if(scoreObject.length == 0){
                        scoreObject[0] = score;
                        myJson = JSON.stringify(scoreObject);
                        myStroage.setItem(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`, myJson)
                    }else if(score > Number(scoreObject[0])){
                        scoreObject[0] = score;
                        myJson = JSON.stringify(scoreObject);
                        myStroage.setItem(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`, myJson)
                    }
                    
                    getTodayHighestScore(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,myStroage, heightscore_div)
                    commentary.classList.remove("starting");
                    clearInterval(interval);
                }
            },1000)
        }
    })
}

function creat_game_div(score,score_div,div_number, game_space, change_color, color,game_state, myStroage, date){
    console.log(score);
    if(game_state){
        console.log("start");
        game_space.innerHTML = "";
        let answer = getRandomInt(Math.pow(div_number,2));
        console.log(color);
        for (let i = 0; i < Math.pow(div_number,2); i++) {
            if(i == answer){
                game_space.innerHTML += `
                <div class="true" style="
                    width: calc(calc(100% / ${div_number}) - 5px);
                    height: calc(calc(100% / ${div_number}) - 5px);
                    background-color: ${color};
                    opacity: ${change_color};
                    border-radius: 10px;">
                </div>
                `
            }else{
                game_space.innerHTML += `
                <div class="fake" style="
                    width: calc(calc(100% / ${div_number}) - 5px);
                    height: calc(calc(100% / ${div_number}) - 5px);
                    background-color: ${color};
                    border-radius: 10px;">
        
                </div>
                `
            }
        }
        document.querySelectorAll(".fake").forEach((element)=>{
            element.addEventListener("click",function(){
                let color = random_color();
                creat_game_div(score,score_div,div_number, game_space, change_color, color,1);
            })
        })
        document.querySelector(".true").addEventListener("click", function(){
            score += 1;
            score_div.innerHTML = `${score}分`;
            if((Math.floor(score / 3) + 2) > div_number && div_number <= 5){
                div_number = (Math.floor(score / 3) + 2); 
            }else if((Math.floor(score / 3) + 2) > 5){
                change_color = 0.9;
            }
            let color = random_color();

            // 最終分數
            let end_score_div = document.querySelector(".end_score");
            end_score_div.innerHTML = `${score}分`;
            
            
            

            creat_game_div(score,score_div,div_number, game_space, change_color, color,1);
        })
    }else{
        console.log("stop");
        game_space.innerHTML = "";
        console.log(score);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max); 
}

function random_color() {
    let red = getRandomInt(255);
    let blue = getRandomInt(255);
    let green = getRandomInt(255);

    let color = `rgb(${red}, ${green}, ${blue})`;

    
    return color;
}


function getTodayHighestScore(date, myStroage, heightscore_div){
    let myJson = myStroage.getItem(date);
    let scoreObject = JSON.parse(myJson);
    let heightscore_word = "";
    console.log(scoreObject);
    if(scoreObject.length == 0){
        heightscore_word = "尚未遊玩"
    }else {
        heightscore_word = `${scoreObject[0]}分`;
    }
    heightscore_div.innerHTML = heightscore_word;
}