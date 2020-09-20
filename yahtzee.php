<?php
    include 'scripts.php';
?>

<html>
    <head>
        <title>Yahtzee</title>
        <link rel='stylesheet' href='yahtzee.css'/>
    </head>

    <body>
        <h1>
            <?=make_head('Welcome to Yahtzee')?>
        </h1>

        <a href='mode_select.php'>
            <div class='selector readybox'>
                Click Here if You Already Know How to Play
            </div>
        </a>

        <a href='instructions.php'>
            <div class='selector helpbox'>
                Click Here to Learn How to Play
            </div>
        </a>    
    </body>
</html>