<?php
    session_start();
    include 'scripts.php';
    if(!isset($_SESSION['dice'])) $_SESSION['dice']=[0,0,0,0,0];
?>

<html>
    <head>
        <title>Instructions</title>
        <link rel='stylesheet' href='yahtzee.css'/>
    </head>

    <body>
        <?php
        if(isset($_GET['dice']) && isset($_GET['val'])) {
            $i = intval($_GET['dice']);
            $v = intval($_GET['val']);
            if($i>0 && $i<6 && $v>0 && $v<7) {
                $_SESSION['dice'][$i-1]=$v;
                print"set it up.... $i  $v<br>\n";
            } else print"out of range $i  $v<br>\n";
        } else print"Missing GET inputs<br>\n";
    
        ?>
        
        I remember you... you have this setup:<?=json_encode($_SESSION['dice'])?><br>

        <a href='yahtzee.php'><span class='back'>&lt Go Back</span></a>
        <h1 class='shifted_head'></h1> <!--code injected via 'make_head()'-->

        <h2>In Yahtzee, you play with 5 Dice as seen below:</h2>
        
            <div class=dice_display></div> <!--code injected via 'dice.render()'-->

            <h2>You get 3 chances to roll every round. Try the roll button below:</h2>

        
            <div id='roll_display'>Roll</div>
        
        <h2>Click on one of the Dice above to Hold it if you don't want to roll it again.<br/>
            Doing so will display a <strong>hold</strong> icon below the die. Try it!</h2>

        <h2>Every round, you will attempt to get different combinations with the dice. <br/>
            Below are all the combinatinos from each round. <br/>
            Click on one to see what it means.
        </h2>
        
        <div id='round_list'></div>

        <div id='round_list2'></div>

        <script type="text/javascript" src="instructions.js"></script>

    </body>
</html>