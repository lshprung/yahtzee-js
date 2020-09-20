<?php

    //error_reporting(E_ERROR); 
    //////////GLOBAL VARIABLES/
    ///////////////////////////
    function dice_rand(){
        return random_int(1, 6) . ".png";
    }

    function make_head($text){
        return "<img class='small_dice' src=" . dice_rand() . 
            "/> $text <img class='small_dice' src=" . dice_rand() . "/>";
    }

    function display_dice_practice(){
        $out = '';
        for($i=1; $i<=5; $i++){
            $see = "";
            $shuffle = dice_rand();
            if(isset($_GET["dice$i"]) && isset($_GET["held$i"]) && $_GET["dice$i"] == 'on'){ // isset(): exists? , empty() not set or the value is falsey like 0 or empty string
                $see = 'checked';
                $shuffle = $_GET["held$i"];
            }
            $out .= 
                "<span class='dice_box'>
                    <label for='dice$i'><img src='$shuffle' /></label>
                    <input id='dice$i' name='dice$i' type='checkbox' $see />
                    <input type='hidden' name='held$i' value='$shuffle' />
                    <div id='HOLD'>HOLD</div>
                </span>
            \n";

        }

        return $out;
    }

    

    function display_dice(){
        $out='';
        if(!$_GET["score21"]){
            for($i=1; $i<=5; $i++){
                $see = "";
                $shuffle = dice_rand();
                $show = "";
                $Aces = "";
                if($_GET["dice$i"] == 'on'){
                    $see = 'checked';
                    $shuffle = $_GET["held$i"];
                }
                if(empty($_GET["roll_num"])) {
                    $see = "";
                    $show = "style=opacity:0;";
                }

                $out .= 
                    "<span class='dice_box'>
                        <label for='dice$i'><img class='dice_pics' src=$shuffle $show/></label>
                        <input id='dice$i' name='dice$i' type='checkbox' $see/>
                        <input type='hidden' name='held$i' value='$shuffle'/>
                        <div class='HOLD'>HOLD</div>
                    </span>
                \n";
            }
        }

        else {
            $out .= 
            "<span id='game_over'>
                <div id='Thanks'>Thanks for Playing!</div>
                <div id='final_score'>Your Final Score: " . $_GET['score21'] . "</div>
                <a class='end_select' id='play_again' href='game.php?roll_num=0&round_num=0'>
                Click Here to Play Again
                </a>
                <a class='end_select' id='go_back' href='mode_select.php'>
                Click Here to Go Back
                </a>
            </span>";
        }

        return $out;
    }

    function roll_num(){
        return (empty($_GET["roll_num"])?"style=color:orange;":"");
    }

    function show_roll(){
        return (isset($_GET["roll_num"]) && $_GET["roll_num"] == 3 ? "style=opacity:0":"");
    }

    function next_level(){
        $roll = $_GET["roll_num"]+1;
        $round = $_GET["round_num"];

        if($roll > 3){
            $roll = 0;
            $round = $_GET["round_num"]+1;
        }
        return
            "<input type='hidden' name='roll_num' value='$roll'/>\n" .
            "<input type='hidden' name='round_num' value='$round'/>";
    }

    function total_upper(){
        $ret = 0;
        for($i = 1; $i <= 6; $i++){
            (is_numeric($_GET["score$i"])?$ret += $_GET["score$i"]:0);
        }
        return $ret;
    }

    function bonus_bool(){
        return (isset($_GET["score7"]) && $_GET["score7"] >= 63 ? 35:0);
    }

    function oak($num_of_kind,&$dice_number){
        $ret=0;
        for($n = 1; $n <= 6; $n++) if ($n!=$dice_number) { //  n is the dice number I am chekcing, like "5"
            $count = 0;
            for($i = 1; $i <= 5; $i++){ //  how many "5"s I have
                if($_GET["held$i"] == "$n.png") $count++;
            }
            if($count >= $num_of_kind) { 
                $dice_number = $n; 
                $n=99; 
            }
        }
        if($n>20){
            for($i = 1; $i <= 5; $i++) $ret += substr($_GET["held$i"], 0, 1);
        }
        return $ret;
    }

    function is_full_house(){
        $dn=0;
        if (oak(3,$dn)){
            if(oak(2,$dn)) return 25;
        }
        return 0;
    }

    function straight($size){
        $str = "";
        $count = 0;
        $p = 0;
        for($i = 1; $i <= 5; $i++){
            $str .= substr($_GET["held$i"], 0, 1);
        }
        for($a = 4+($size-4); $a <= 6; $a++){
            $count = 0;
            for($b = $a-3-($size-4); $b <= $a; $b++){
                if((strpos($str, (string)$b)) !== False) $count++;
            }
            if($count >= $size){
                $p = 30+(($size-4)*10);
                break;
            }
        }
        return $p;
    }

    function Chance(){
        $sum = 0;
        for($i = 1; $i <= 5; $i++){
            (is_numeric(substr($_GET["held$i"], 0, 1))?
            $sum += substr($_GET["held$i"], 0, 1):0);
        }
        return $sum;
    }

    function Yahtzee(){
        $x3 = 10;
        return ((oak(5,$x3)) ? 50:0);
    }

    function y_bonus(){
        return (Yahtzee() > 0 ? "✓":"test");
    }

    function total_lower(){
        $ret = 0;
        for($i = 10; $i <= 18; $i++){
            (is_numeric($_GET["score$i"])?$ret += $_GET["score$i"]:0);
        }
        return $ret;
    }

    function calc_score(){
        $score = "";
        ////array for scoring procedures////
        $x1 = 0;
        $x2 = 9;
        $cont = 0;
        $scoring_array = 
        [oak(3,$x1), oak(4,$x2), is_full_house(), 
        straight(4), straight(5), Yahtzee(), Chance()];

        if($_GET["score15"]){
            $cont++;
        }

        $points = [];
        for($a = 1; $a <= 21+$cont; $a++){
            $points[$a] = $_GET["score$a"];
            if($a <= 6) {
                if(($_GET["roll_num"] == 0) && ($_GET["round_num"] == $a)){
                    $points[$a] = 0;
                    for($i = 1; $i <= 5; $i++){
                        if($_GET["held$i"] == "$a.png") $points[$a] += $a;
                    }
                }
            }

            elseif($_GET["round_num"] > 13){
                if($cont && ($_GET["roll_num"] == 0)){
                    $points[17] = y_bonus();
                    $points[18] = Yahtzee()*2;
                }
            }

            if($_GET["round_num"] >= 13+$cont){
                $points[19] = $points[9];
                $points[20] = total_lower();
                $points[21] = $points[9] + $points[20];
            }


            if($a > 9 && $a < 17){
                if(($_GET["roll_num"] == 0) && ($_GET["round_num"] == $a-3)){
                    $points[$a] = $scoring_array[$a-10];
                }
            }

            elseif($_GET["round_num"] >= 6){
                $points[7] = total_upper();
                $points[8] = bonus_bool();
                $points[9] = total_upper() + bonus_bool();
            }

            
            $score .= "<input type='hidden' name='score$a' value=$points[$a]>\n";
            $_GET["score$a"]=$points[$a];
        }
        return $score;
    }

    function create_scoreboard(){
        $round_val = 
        ['UPPER SECTION', 'Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'TOTAL SCORE', 'BONUS', 'TOTAL',
        '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YAHTZEE', 'Chance',
        'YAHTZEE BONUS ✓s', 'YAHTZEE BONUS scoring', 'TOTAL UPPER', 'TOTAL LOWER', 'GRAND TOTAL'];
        $out = '';
        $score_val = [];
        $score_val[0] = "";
        $score_val[1] = "";
        for($i=1; $i <= 21; $i++){
            $score_val[$i+1] = $_GET["score$i"];
        }

        for($a=1; $a <= 2; $a++){
            if($a == 2){
                $out .= "<div id='LOWER'>LOWER SECTION</div> \n";
            }
            $out .= "<div id='score_section$a'> \n";
            
            for($i=1; $i <= 8+$a*2; $i++){
                $out .= "<div class='grid_container gc$a' id='grid_element" . ($i + ($a-1)*10) . "'>" . 
                $round_val[($i-1)+($a-1)*10];
                if($a == 1) $out .= "<span id='score_val'>" . $score_val[$i] . "</span>";
                else $out .= "<span id='score_val'>" . $score_val[$i+10] . "</span>";
                $out .= "</div> \n";
            }
            $out .= '</div>';
        }
        return $out;
    }

    function determine_reminder(){
        $r = $_GET["round_num"];
        $round_val = 
        ['Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
        '3 of a Kind', '4 of a Kind', 'Full House', 
        'Small Straight', 'Large Straight', 'YAHTZEE', 'Chance'];
        if($_GET["score15"]) array_push($round_val, 'YAHTZEE Bonus');
        return strtoupper($round_val[$r]);
    }

    function check_end(){
        $out = '';
        if(!$_GET["score21"]){
            $out .= 
            "<h2 id='reminder'>You are rolling for: <span>" . determine_reminder() . "</span></h2>";
        }
        return $out;
    }

?>