<?php
class ConnectionManager {

  public function connect() {
    $servername = "localhost";
    $username = "root";
    $password = "";  
    $dbname = "userbase";
    
    return new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);     
  }
 
}
?>