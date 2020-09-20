var onOff = [0,0,0,0,0,0,0,0,0,0,0,0,0] ,
	dice = {

	    vals:[0,0,0,0,0],
	    holds:[0,0,0,0,0],
	
	    hold_func:function(n){
	        dice.holds[n] = !dice.holds[n];
			document.getElementById(`hold${n}`).innerHTML= (dice.holds[n]? "<div class='HOLD'>HOLD</div>":'&nbsp;')
			console.log(dice.holds);
	    },
	    rand:function(){
	   	    return Math.ceil(Math.random()*6);
	    },
	    render_dice:function(dont_shuffle){ 
	        let out = '';
	        for(let i = 0; i < 5; i++){
	            dice.vals[i] = dice.holds[i] || dont_shuffle ? dice.vals[i] : dice.rand();
	            out += 
	            `<span class='dice_box'>
	                <button class='dice_click' onclick='dice.hold_func(${i})'>
	                    <img class='dice_pics' src='${dice.vals[i]}.png' />
					</button>
					<div id='hold${i}'>` + (dice.holds[i]? "<div class='HOLD'>HOLD</div>":'&nbsp;') + `</div>
				</span>`;
	        }
	        document.getElementsByClassName('dice_display')[0].innerHTML = out;
		}
	}

function write_round(start, len){
	dice.render_dice();
	var rl_arr=[
		'Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 
		'3 of a Kind',	'4 of a Kind', 'Full House', 'Small Straight', 
		'Large Straight', 'Yahtzee', 'Chance'
	],
	r_array = [
		`Roll for ones. 
		You score the sum of each 'one' after your third roll.`,
		
		`Roll for twos. 
		You score the sum of each 'two' after your third roll, 
		where each two is worth two points.`,
		
		`Roll for threes. 
		You score the sum of each 'three' after your third roll, 
		where each three is worth three points.`,
		
		`Roll for fours. 
		You score the sum of each 'four' after your third roll, 
		where each four is worth four points.`,
		
		`Roll for fives. 
		You score the sum of each 'five' after your third roll, 
		where each five is worth five points.`,
		
		`Roll for sixes. 
		You score the sum of each 'six' after your third roll, 
		where each six is worth six points.`,
	
		`Roll to get three of the same dice. 
		If you have 3 of a kind at the end of your third roll, 
		you score the sum of all dice. Otherwise no points are earned.`,
		
		`Roll to get four of the same dice. 
		If you have 4 of a kind at the end of your third roll, 
		you score the sum of all dice. Otherwise no points are earned.`,
		
		`Roll to get three of one number dice and two of another (ex. 2 2 5 2 5). 
		If a full house is achieved at the end of your third roll, 
		you score 25 points. Otherwise no points are earned.`,
	
		`Roll to get a sequence of four dice (ex. 5 2 4 3 3). 
		If a small straight is achieved at the end of your third roll, 
		you score 30 points. Otherwise no points are earned.`,
		
		`Roll to get a sequence of five dice (ex. 1 4 2 5 3). 
		If a large straight is achieved at the end of your third roll, 
		you score 40 points. Otherwise no points are earned.`,
		
		`Roll to get all five of the same dice. 
		If you have a yahtzee at the end of your third roll, 
		you score 50 points and get the opportunity at the end of the game to score another Yahtzee, 
		called Yahtzee Bonus. If a Yahtzee Bonus is earned, you will score 100 points`,
		
		`Roll for high numbers. 
		At the end of your third roll, you will score the sum of your dice.`
	];
    let out = '';
    for(var i = start; i < len+start; i++){
        out += `<div class=round_line id='round` + i + 
        `' onclick=rule_show(` + i + `)><round>` + rl_arr[i] + 
        `</round><span class='dropdown'>v</span></div>
        <div class='rule_show' style=display:none>` + r_array[i] + 
        `</div>`;
    }
    return out;
}

function make_head(header){
    return `<img class='small_dice' src='${dice.rand()}.png'> ${header} <img class='small_dice' src='${dice.rand()}.png'>`;
}


document.getElementById('round_list').innerHTML = write_round(0, 6);
document.getElementById('round_list2').innerHTML = write_round(6, 7);
document.getElementsByClassName('shifted_head')[0].innerHTML = make_head("How to Play Yahtzee");

function rule_show(occ) {
    document.getElementsByClassName('rule_show')[occ].style.display=(onOff[occ]?'none':'block');
    onOff[occ]=!onOff[occ];
}
/*setInterval(()=>{
	document.querySelectorAll('.small_dice').forEach( i => { i.src=dice.rand() } )
},4250); */

/*
javascript is very new; it got some kick ass short hand and tricks no other language got yet. for example, the " "  or ' ' or ` `
setTimeout( function(){} , 250) <-- what function to call after 250 miliSeconds
setTimeout( ()=>{} , 250) <-- instead of "function()" you can type "()=>"

function (a,b) { return a+b }
(a,b)=>a+b  <-- auto return the function body if it is NOT serrounding with a curly ; similar to the ( logic ? return-when-true : return-when-false )


*/