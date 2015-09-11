<?php

$scroll2 = <<<EOQ
[{"title":"","name":"term_kind_id","val":"","all":"所有","list":[{"term_kind_id":"513ec2b5367328e6","unit_id":"0123456789123456","name":"法学类","pid":"","sort":0,"status":1},{"term_kind_id":"513ec42f071af65f","unit_id":"0123456789123456","name":"文学类","pid":"","sort":229,"status":1},{"term_kind_id":"513ed49616df290c","unit_id":"0123456789123456","name":"医学类","pid":"","sort":224,"status":1}]}]
EOQ;

$scroll = <<<EOQ
{"rows":[{"tech_id":"0000000000123456","name":"管理员","idcard":"012345678912345678","email":"","mobile":"","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"admin"},{"tech_id":"52735943edafa589","name":"jnb","idcard":"350121199901010001","email":"250286@91.com","mobile":"13696856985","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"250286"},{"tech_id":"5273597ed0b0184f","name":"yh","idcard":"350123199001010001","email":"900423@126.com","mobile":"13696236536","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"900423"},{"tech_id":"527359bd3889d93e","name":"lzh","idcard":"350201198701010001","email":"871101@91.com","mobile":"13696325896","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"871101"},{"tech_id":"52735a0282954253","name":"lwh","idcard":"350123199000000000","email":"255055@126.com","mobile":"13696856932","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"255055"},{"tech_id":"52735a369222c7f7","name":"刘锦华","idcard":"350122199900000000","email":"271511@91.com","mobile":"13625236189","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"271511"},{"tech_id":"52736f70cf615602","name":"林志宏","idcard":"350600198608202516","email":"cleardo@yeah.net","mobile":"13720824854","forbid":"0","pic":"","sex":"m","jxd_id":"","unit_id":"0123456789123456","kd_id":"","uaccount":"lzhyj"}],"ttl":"-1","_t":1383561123}
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
