<!-- game.php?roll_num=0&round_num=0 -->

<?php
    include 'scripts.php';
?>

<html>
    <head>
        <title>Yahtzee</title>
        <link rel='stylesheet' href='yahtzee.css'/>
        <style>
        </style>
    </head>

    <body>
        <a href='yahtzee.php'><span class='back'>&lt Go Back</span></a>
        <h1>
            <?=make_head('Pick Your Preferred Rules')?>
        </h1>

        <a href='game.php?roll_num=0&round_num=0'>
            <div class='selector readybox' style='background-color:#e2d6b2'>
                Click Here to Play in Forced Order Mode
            </div>
        </a>

        <a href='instructions.php' ><!-- not final href -->
            <div class='selector helpbox' style='background-color:#e2d6b2'>
                Click Here to Play in Free Choice Mode
            </div>
        </a>    
    </body>
</html>