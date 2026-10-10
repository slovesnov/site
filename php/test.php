<?php

include('../config.php');
connect();

$result = $mysqli->query("SELECT name,code FROM code where name='cube1'") or die('error line' . __LINE__ . $mysqli->error);
$c = 1;
$users = [];
while ($row = $result->fetch_row()) {
    $a=json_decode($row[1]);
    if(is_array($a) && count($a)==1){
        echo $row[0]."<br>";
    }
}

$a="package main;

import java.math.BigInteger;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

class Cube {

  public static void main(String[] arg) {
    final int init[][] = { { 1, 12, 114, 1068, 10011 }, { 1, 18, 243 } };
    final int q[][] = { { 2, 8, 12, 8 }, { 18, 12 } };
    final BigInteger g = new BigInteger(\"43252003274489856000\");
    BigInteger l[], sum, la, psum;
    int in[], i, layer, metric;

    DecimalFormatSymbols symbols = new DecimalFormatSymbols();
    symbols.setGroupingSeparator(',');
    DecimalFormat df = new DecimalFormat();
    df.setGroupingSize(6);
    df.setDecimalFormatSymbols(symbols);

    for (metric = 0; metric < 2; metric++) {
      in = init[metric];
      l = new BigInteger[in.length];
      System.out.println(metric == 0 ? \"qtm\" : \"htm\");
      for (sum = new BigInteger(\"0\"), layer = 0;; layer++) {
        if (layer < l.length) {
          la = l[layer] = new BigInteger(in[layer] + \"\");
        } else {
          la = new BigInteger(\"0\");
          for (i = 1; i < l.length; i++) {
            la = la.add(l[i].multiply(new BigInteger(q[metric][i - 1] + \"\")));
          }
          for (i = 1; i < l.length - 1; i++) {
            l[i] = l[i + 1];
          }
          l[l.length - 1] = la;
        }
        psum = sum.add(la);
        if (psum.compareTo(g) == 1) {
          System.out.printf(\"layer %2d left %s\\n\", layer - 1, df.format(g.subtract(sum)));
          break;
        } else {
          sum = psum;
          System.out.printf(\"layer %2d %24s total %24s\\n\", layer, df.format(la), df.format(sum));
        }

      }

    }

  }

}";
$s=$mysqli->real_escape_string(json_encode($a));
//$result = $mysqli->query("update code set code='$s' where name='cube1'") or die('error line' . __LINE__ . $mysqli->error);
