<?php

$scroll2 = <<<EOQ
[{"title":"","name":"term_kind_id","val":"","all":"所有","list":[{"term_kind_id":"513ec2b5367328e6","unit_id":"0123456789123456","name":"法学类","pid":"","sort":0,"status":1},{"term_kind_id":"513ec42f071af65f","unit_id":"0123456789123456","name":"文学类","pid":"","sort":229,"status":1},{"term_kind_id":"513ed49616df290c","unit_id":"0123456789123456","name":"医学类","pid":"","sort":224,"status":1}]}]
EOQ;

$scroll = <<<EOQ
[{"title":"","name":"term_kind_id","val":"","all":"","list":[{"term_kind_id":"", "name":"所有"},{"term_kind_id":"513ec2b5367328e6","unit_id":"0123456789123456","name":"法学类","pid":"","sort":0,"status":1},{"term_kind_id":"513ec42f071af65f","unit_id":"0123456789123456","name":"文学类","pid":"","sort":229,"status":1},{"term_kind_id":"513ed49616df290c","unit_id":"0123456789123456","name":"医学类","pid":"","sort":224,"status":1}]}]
EOQ;

 //print_r(json_decode($scroll));
 switch (json_last_error()) {
        case JSON_ERROR_NONE:
            //echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
    }
echo $scroll;
