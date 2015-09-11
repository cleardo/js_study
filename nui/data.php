<?php

$scroll = <<<EOQ
[{"id":"000000000","name":"\u6d4b\u8bd50"},{"id":"000000001","name":"\u6d4b\u8bd51"},{"id":"000000002","name":"\u6d4b\u8bd52"},{"id":"000000003","name":"\u6d4b\u8bd53"},{"id":"000000004","name":"\u6d4b\u8bd54"},{"id":"000000005","name":"\u6d4b\u8bd55"},{"id":"000000006","name":"\u6d4b\u8bd56"},{"id":"000000007","name":"\u6d4b\u8bd57"}]
EOQ;

$scroll2 = <<<EOQ
{"rows":[{"id":"000000000","name":"\u6d4b\u8bd50"},{"id":"000000001","name":"\u6d4b\u8bd51"},{"id":"000000002","name":"\u6d4b\u8bd52"},{"id":"000000003","name":"\u6d4b\u8bd53"},{"id":"000000004","name":"\u6d4b\u8bd54"},{"id":"000000005","name":"\u6d4b\u8bd55"},{"id":"000000006","name":"\u6d4b\u8bd56"},{"id":"000000007","name":"\u6d4b\u8bd57"}],"ttl":8,"_t":1366612338}
EOQ;

//print_r(json_decode($scroll));
echo $scroll;
