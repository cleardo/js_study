<?php

$scroll = <<<EOQ
 {"rows":[{"km_id":"527356e0abe4a1c7","name":"税法","code":"7806","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0b02084a5","name":"证券投资分析","code":"7808","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0b42518be","name":"信托与租赁","code":"7842","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0b8b5c451","name":"地方政府学","code":"7869","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0bd06fa1b","name":"学前教育史","code":"7882","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0c234eaed","name":"中国法律思想史","code":"8837","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0c6220cff","name":"婴幼儿营养与保育","code":"8841","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0ca483a28","name":"幼儿文学","code":"8842","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0ce22048d","name":"个人理财","code":"8869","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"},{"km_id":"527356e0d20d1202","name":"财会法规与职业道德","code":"8908","unit_id":"0123456789123456","status":"1","del":"0","cash":"0.0"}],"_t":1383561530}
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
