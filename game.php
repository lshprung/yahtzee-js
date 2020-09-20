<?php
    include 'scripts.php';
?>

<html>
    <head>
        <title>Yahtzee</title>
        <link rel="stylesheet" href="yahtzee.css">
    </head>

    <body>
        <a href='mode_select.php'><span class='back'>&lt Go Back</span></a>
        <h1 class='shifted_head'>
            <?=make_head('Yahtzee')?>
        </h1>

        <?=check_end()?>

        <form>
            <div class='top_pad'></div>
            <div class=dice_display>
            <?=display_dice()?>
            </div>
            <span id='submit_line' <?php if($_GET["score21"]) print "style=display:none;" ?>>
                <span id='roll_count' <?= roll_num() ?>>
                    Roll #<?= $_GET["roll_num"] ?>
                </span>
                <input id=roll_display type="submit" value="Roll!" 
                <?=show_roll()?>>
                <input id='submit' type="submit" value="Submit">
            </span>
            <?=next_level()?>
            <?=calc_score()?>
        </form>

        <h2>Scoreboard</h2>
        <div id='full_scoreboard'>
            <?=create_scoreboard()?>
        </div>
    </body>
</html>