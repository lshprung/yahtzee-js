<?php
    //////////GLOBAL VARIABLES/
    global $dice_arr;
    $dice_arr = [];
    for($i=1; $i<=6; $i++){
        array_push($dice_arr, $i . ".png");
    }
    ///////////////////////////
    function dice_rand(){
        $dice_arr = $GLOBALS['dice_arr'];
        $e = random_int(0, 5);
        return $dice_arr[$e];
    }

    print dice_rand();

?>