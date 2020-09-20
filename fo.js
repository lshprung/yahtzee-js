var dice = {

    scoring:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    vals:[0,0,0,0,0],
    holds:[0,0,0,0,0],
    roll:-1,
    round:0,
    fhoak:0, //for use in determining full house
    finish:false, //will be true when the game is over

    submit_round:function(){
        dice.roll = 3;
    },

    hold_func:function(n){ //called when a dice is clicked on
        dice.holds[n] = !dice.holds[n];
        document.getElementById(`hold${n}`).innerHTML= (dice.holds[n]? "<div class='HOLD'>HOLD</div>":'&nbsp;')
    },
    rand:function(){ //picks a random dice value
        return Math.ceil(Math.random()*6);
    },

    oak: function(num_of_kind, repeat = 0){ //determines x of a kind scoring (including yahtzee)
        let ret = 0,
            count;
        for(let n = 1; n <= 6; n++){ //each possible dice value is checked
            if(n !== repeat){
                count = 0;
                for(let i = 0; i < 5; i++){ //how many of this val do I have? lets look at each dice...
                    if(dice.vals[i] == n) count++;
                }
            }
            if(count >= num_of_kind) {
                dice.fhoak = n;
                for(let i = 0; i < 5; i++){
                    ret += dice.vals[i];
                }
            }
        }
        return ret;
    },

    full_house: function(){ //determines full house scoring (using x of a kind and dice.fhoak)
        return (dice.oak(3) ? (dice.oak(2, dice.fhoak) ? 25:0) : 0);
    },

    straight: function(size){ //determines small and large straight scoring
        let str = '';
        let count;
        let p = 0;
        for(let val in dice.vals){ // 26345
            str += dice.vals[val];
        }
        for(let a = size; a <= 6; a++){  // 4 : 4,5,6
            count = 0;
            for(let b = 1+(a-size); b <= a; b++){
                if(str.includes(b)){
                    count++;
                }
            }
            if(count >= size){
                p = 30+(size-4)*10;
                break;   
            }
        }
        return p;
    },

    chance:function(){ //determines chance scoring
        let sum = 0;
        //dice.vals.forEach(x => { sum+=x});
        for(let val in dice.vals){
            sum += dice.vals[val];
        }
        return sum;
    },

    final_scoring:function(){ //called when dice.finish is set to true to determine the final score values
        prepare_score(20, dice.scoring[8]);
        for(let s = 9; s <= 15; s++){
            dice.scoring[19] += dice.scoring[s];
        }
        dice.scoring[19] += dice.scoring[17];
        prepare_score(21, dice.scoring[19]);
        dice.scoring[20] = dice.scoring[8]+dice.scoring[19];
        prepare_score(22, dice.scoring[20]);
        dice.finish = true;
    },

    render_dice:function(dont_shuffle){ //main function called each time roll or submit is clicked on
        //(dice.roll == -1 || dice.roll == 3 ? document.getElementById('submit').setAttribute('style', 'opacity:0') : document.getElementById('submit').setAttribute('style', 'opacity:1'));
        document.getElementById('submit').setAttribute('style', 'opacity:'+(dice.roll == -1 || dice.roll == 3 ?'0':'1'));
        document.getElementById('roll_display').innerText = (dice.roll == 2 ?  'Submit' : 'Roll!');
        
        if(dice.roll == 3){
            
            if(dice.round < 6){ //determine scores each upper round
                for(let d = 0; d < 5; d++){
                    if(dice.vals[d] == dice.round + 1){
                        dice.scoring[dice.round] += dice.vals[d];
                    }
                }
                prepare_score((dice.round+2), dice.scoring[dice.round]);
            }

            if(dice.round == 5){ //determines final upper score
                for(let d = 0; d < 6; d++){
                    dice.scoring[6] += dice.scoring[d];
                }
                prepare_score(8, dice.scoring[6]);
                dice.scoring[7] = (dice.scoring[6] >= 63 ? 35 : 0);
                prepare_score(9, dice.scoring[7]);
                dice.scoring[8] = dice.scoring[6] + dice.scoring[7];
                prepare_score(10, (dice.scoring[8]));
            }

            if(dice.round >= 6 && dice.round < 13){ //determines scores for each lower round
                let calc=0;
                switch(dice.round){
                    case  6: calc = dice.oak(3);            break;
                    case  7: calc = dice.oak(4);            break;
                    case  8: calc = dice.full_house();      break;
                    case  9: calc = dice.straight(4);       break;
                    case 10: calc = dice.straight(5);       break;
                    case 11: calc = (dice.oak(5) ? 50:0);   break;
                    case 12: calc = dice.chance();          break;
                }
                dice.scoring[dice.round+3] = calc;
                prepare_score((dice.round+5), dice.scoring[dice.round+3]);
            }

            if(dice.round == 12 && !dice.scoring[14]){ //if yahtzee was not met, get final scores and end the game
                dice.final_scoring();
            }

            if(dice.round == 13){ //if yahtzee WAS met, play the yahtzee bonus round and then get final scores and end the game
                dice.scoring[16] = (dice.oak(5) ? '&#10003' : '&#10007');
                dice.scoring[17] = (dice.oak(5) ? 100 : 0);
                prepare_score(18, dice.scoring[16]);
                prepare_score(19, dice.scoring[17]);
                dice.final_scoring();
            }

            for(let i = 0; i < 5; i++){ //reset holds at the start of each round
                dice.holds[i] = 0;
            }
        }

        update();
        let out = '';
        for(let i = 0; i < 5; i++){
            dice.vals[i] = dice.holds[i] || dont_shuffle ? dice.vals[i] : dice.rand();
            out += 
            `<span class='dice_box'>
                <button class='dice_click' onclick='dice.hold_func(${i})'>
                    <img class='dice_pics' src='${dice.vals[i]}.png' style='opacity:
                    ` + (dice.roll ? "1":"0") + `'/>
                </button>
                <div id='hold${i}'>` + (dice.holds[i]? "<div class='HOLD'>HOLD</div>":'&nbsp;') + `</div>
            </span>`;
        }
        if(!dice.finish){ //renders the main playfield
            document.getElementsByClassName('dice_display')[0].innerHTML = out;
            document.getElementById('roll_count').innerHTML = "Roll " + (dice.roll ? `#${dice.roll}` : 'the dice!');
            if(dice.round < 13) {document.getElementById('notice').innerHTML = roll_for()};
            if(dice.round >= 13 && dice.scoring[14]) {document.getElementById('notice').innerHTML ="<h2 id='reminder'>You are rolling for: <span>Yahtzee Bonus</span></h2>"};
            document.getElementById('roll_count').style.marginLeft = (dice.roll ? '120px' : '67.5px');
            //console.log(dice.scoring);
        }
        else{ //renders the game over screen if dice.finish is true
            document.getElementById('notice').setAttribute('style', 'display:none');
            document.getElementsByClassName('dice_display')[0].setAttribute('style', 'display:none');
            document.getElementById('submit_line').setAttribute('style', 'display:none');
            document.getElementsByClassName('top_pad')[0].innerHTML = 
            `<span id='game_over'>
                <div id='Thanks'>Thanks for Playing!</div>
                <div id='final_score'>Your Final Score: ${dice.scoring[20]}</div>
                <a class='end_select' id='play_again' href='game.html'>
                Click Here to Play Again
                </a>
                <a class='end_select' id='go_back' href='mode_select.html'>
                Click Here to Go Back
                </a>
            </span>`;
        }
    }
}

function make_head(header){ //creates the header
    return `<img class='small_dice' src='${dice.rand()}.png'> ${header} <img class='small_dice' src='${dice.rand()}.png'>`;
}

function roll_for(){ 
    let arr = ['Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
    '3 of a Kind', '4 of a Kind', 'Full House', 
    'Small Straight', 'Large Straight', 'YAHTZEE', 'Chance'];
    return `<h2 id='reminder'>You are rolling for: <span>${arr[dice.round]}</span></h2>`;
}

function update(){ //increments dice.roll each time in dice.render
    if(dice.roll < 3){
        dice.roll++
    }
    else {
        dice.roll = 0;
        dice.round++;
    }
}

function render_scoreboard(){ //script to create the scoreboard layout
    let round_val = 
    ['UPPER SECTION', 'Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'TOTAL SCORE', 'BONUS', 'TOTAL',
    '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YAHTZEE', 'Chance',
    'YAHTZEE BONUS &#10003s', 'YAHTZEE BONUS scoring', 'TOTAL UPPER', 'TOTAL LOWER', 'GRAND TOTAL'];
    let out = '';

    for(let a=1; a <= 2; a++){
        if(a == 2){
            out += "<div id='LOWER'>LOWER SECTION</div> \n";
        }
        out += `<div id='score_section${a}'> \n`;
        
        for(let i=1; i <= (8+a*2); i++){
            out += `<div class='grid_container gc${a}' id='grid_element` + (i + (a-1)*10) + "'><span>"+
            round_val[(i-1)+(a-1)*10] + "</span></div> \n";
        }
        out += '</div>';
    }
    return out;
}

function prepare_score(place, value){ //when called, updates a specific score
    return document.getElementById(`grid_element${place}`).insertAdjacentHTML('beforeend', `<span class='score_val'>${value}</span>`)
}

document.getElementsByClassName('shifted_head')[0].innerHTML = make_head("Now Playing: Forced Order Mode");
dice.render_dice();
document.getElementById('full_scoreboard').innerHTML = render_scoreboard();