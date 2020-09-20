var dice = {

    // game ends when round = 13 (assuming yahtzee is not achieved)
    scoring:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    scoring_set: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    vals:[0,0,0,0,0],
    holds:[0,0,0,0,0],
    roll:-1,
    round:0,
    fhoak:0, //for use in determining full house - keep
    finish:false, //will be true when the game is over - keep

    hold_func:function(n){ //called when a dice is clicked on - keep
        dice.holds[n] = !dice.holds[n];
        document.getElementById(`hold${n}`).innerHTML= (dice.holds[n]? "<div class='HOLD'>HOLD</div>":'&nbsp;')
    },
    rand:function(){ //picks a random dice value - keep
        return Math.ceil(Math.random()*6);
    },

    oak: function(num_of_kind, repeat = 0){ //determines x of a kind scoring (including yahtzee) -keep
        let ret = 0;
        let count;
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

    full_house: function(){ //determines full house scoring (using x of a kind and dice.fhoak) - keep
        return (dice.oak(3) ? (dice.oak(2, dice.fhoak) ? 25:0) : 0);
    },

    straight: function(size){ //determines small and large straight scoring - keep
        let str = '';
        let count;
        let p = 0;
        for(let val in dice.vals){
            str += dice.vals[val];
        }
        for(let a = size; a <= 6; a++){
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

    chance:function(){ //determines chance scoring - keep
        let sum = 0;
        for(let val in dice.vals){
            sum += dice.vals[val];
        }
        return sum;
    },

    final_scoring:function(){ //called when dice.finish is set to true to determine the final score values - keep, toChange 
        for(let d = 0; d < 6; d++){
            dice.scoring[6] += dice.scoring[d];
        }

        dice.scoring[7] = (dice.scoring[6] >= 63 ? 35 : 0);
        dice.scoring[8] = dice.scoring[6] + dice.scoring[7];

        if(dice.scoring[16] == '&#10003'){
            dice.scoring[17] = 100;
        }
        if(dice.scoring[16] == '&#10007'){
            dice.scoring[17] = 0;
        }

        dice.scoring[18] = dice.scoring[8];
        for(let d = 9; d < 16; d++){
            dice.scoring[19] += dice.scoring[d];
        }
        dice.scoring[19] += dice.scoring[17]
        dice.scoring[20] = dice.scoring[18] + dice.scoring[19];

        dice.finish = true;
    },

    score:function(element){
        dice.roll = 3;

        let calc_arr = [dice.oak(3), dice.oak(4), dice.full_house(), dice.straight(4), dice.straight(5), (dice.oak(5) ? 50:0), dice.chance(), (dice.oak(5) ? '&#10003':'&#10007')];

        dice.scoring_set[element-2] = true;
        if(element <= 7){ //determine scores each upper round
            for(let d = 0; d < 5; d++){
                if(dice.vals[d] == element - 1){
                    dice.scoring[element-2] += dice.vals[d];
                }
            }
        }

        if(element > 7){ //determines scores for each lower round
            dice.scoring[element-2] = calc_arr[element-11];
        }

        if(dice.round == (12 + dice.scoring[14]/50)){
            dice.final_scoring();
        }
        
        for(let d = 0; d < 5; d++){ //reset holds at the start of each round
            dice.holds[d] = 0;
        }
    },

    render_dice:function(dont_shuffle){ //main function called each time roll or submit is clicked on -keep, toChange

        (dice.roll == 2 ? document.getElementById('roll_display_free').style.display = 'none' : document.getElementById('roll_display_free').style.display = 'unset');

        update(); //keep
        let out = '';
        for(let i = 0; i < 5; i++){ //keep
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

        document.getElementById('full_scoreboard').innerHTML = render_scoreboard(); //keep

        if(!dice.finish){ //renders the main playfield - keep
            document.getElementsByClassName('dice_display')[0].innerHTML = out;
            document.getElementById('roll_count').innerHTML = "Roll " + (dice.roll ? `#${dice.roll}` : 'the dice!');
            document.getElementById('roll_count').style.marginLeft = (dice.roll ? '120px' : '67.5px');
            //console.log(dice.scoring);
        }
        else{ //renders the game over screen if dice.finish is true - keep
            document.getElementById('grid_element8').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[6]}</span>`);
            document.getElementById('grid_element9').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[7]}</span>`);
            document.getElementById('grid_element10').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[8]}</span>`);
            document.getElementById('grid_element19').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[17]}</span>`);
            document.getElementById('grid_element20').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[18]}</span>`);
            document.getElementById('grid_element21').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[19]}</span>`);
            document.getElementById('grid_element22').insertAdjacentHTML('beforeend', `<span class='score_val'>${dice.scoring[20]}</span>`);
            document.getElementsByClassName('dice_display')[0].setAttribute('style', 'display:none');
            document.getElementById('submit_line').setAttribute('style', 'display:none');
            document.getElementsByClassName('top_pad_free')[0].innerHTML = 
            `<span id='game_over'>
                <div id='Thanks'>Thanks for Playing!</div>
                <div id='final_score'>Your Final Score: ${dice.scoring[20]}</div>
                <a class='end_select' id='play_again' href='free.html'>
                Click Here to Play Again
                </a>
                <a class='end_select' id='go_back' href='mode_select.html'>
                Click Here to Go Back
                </a>
            </span>`;
        }
    }
}

function make_head(header){ //creates the header - keep
    return `<img class='small_dice' src='${dice.rand()}.png'> ${header} <img class='small_dice' src='${dice.rand()}.png'>`;
}

function update(){ //increments dice.roll each time in dice.render - keep, toChange
    if(dice.roll < 3){
        dice.roll++
    }
    else {
        dice.roll = 0;
        dice.round++;
    }
    console.log(dice.round);
}

function render_scoreboard(){ //script to create the scoreboard layout - keep
    let round_val = 
    ['UPPER SECTION', 'Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'TOTAL SCORE', 'BONUS', 'TOTAL',
    '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YAHTZEE', 'Chance',
    'YAHTZEE BONUS &#10003s', 'YAHTZEE BONUS scoring', 'TOTAL UPPER', 'TOTAL LOWER', 'GRAND TOTAL'];
    let clickables = [2,3,4,5,6,7,11,12,13,14,15,16,17];
    if(dice.scoring[14] > 0){
        clickables.push(18);
    }
    let out = '';

    for(let a=1; a <= 2; a++){
        if(a == 2){
            out += "<div id='LOWER'>LOWER SECTION</div> \n";
        }
        out += `<div id='score_section${a}'> \n`;
        
        for(let i=1; i <= (8+a*2); i++){
            out += `<div id='grid_element${(i + (a-1)*10)}' class='grid_container gc${a} `; //onclick will trigger dice.score. The onclick should only be written to scorable sections (i.e Aces,  not UPPER SECTION). dice.score will take in a value and will function similar to the dice.roll == 3 if statement
            out += ((clickables.includes(i + (a-1)*10)) && (dice.roll !== 0) && (!dice.scoring_set[(i + (a-1)*10) - 2]) ? `clickable' onclick='dice.score(${(i + (a-1)*10)});dice.render_dice()';` : "'"); //todo: render scoreboard on every submission
            out += `>${round_val[(i-1)+(a-1)*10]}`;
            out += (dice.scoring_set[(i + (a-1)*10) - 2] ? `<span class='score_val'>${dice.scoring[(i + (a-1)*10) - 2]}</span>` : '') + `</div> \n`;
        }
        out += '</div>';
    }
    return out;
}

document.getElementsByClassName('shifted_head')[0].innerHTML = make_head("Now Playing: Free Mode"); //keep
dice.render_dice(); //keep
document.getElementById('full_scoreboard').innerHTML = render_scoreboard(); //keep