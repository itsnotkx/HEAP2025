<?php

require_once 'ConnectionManager.php';


/**
 * This class provides user-related functions
 */ 
class users {


public function getUser($username) {

$connMgr=new connectionManager();
$conn=$connMgr->connect();

$sql="select username from user
WHERE username=:username"; //fetch any username that is the same as this username
$stmt=$conn->prepare($sql);
$stmt->bindParam(':username', $username, PDO::PARAM_STR);

$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
	      
While ($row=$stmt->fetch()){
return true; //returns boolean true if this username exists in the database
}

$stmt=null;
$conn=null;

        return false;//returns false otherwise
    }

public function getUsers() {

$connMgr=new connectionManager();
$conn=$connMgr->connect();

$sql="select category_name from category order by category_name ASC";
$stmt=$conn->prepare($sql);

$stmt->execute();
$stmt->setFetchMode(PDO::FETCH_ASSOC);
	        $categories = [];
While ($row=$stmt->fetch()){
$category[]=$row['category_name'];
}

$stmt=null;
$conn=null;

        return $categories;
    }

    public function newUser($username,$password){
        $conn = new ConnectionManager();
            $hashed=password_hash($password, PASSWORD_DEFAULT); //hashes the password passed in
            $pdo = $conn->connect();
            $sql = "insert into user (username, pass) values (:username,:password)";
            $stmt = $pdo->prepare($sql);

            $stmt->bindParam(":username",$username,PDO::PARAM_STR);
            $stmt->bindParam(":password",$hashed,PDO::PARAM_STR);

            $success=$stmt->execute(); //this returns a boolean based on whether the addition was successful
            
            $stmt = null;
            $pdo = null;
            return $success;
    }

    public function getHashedPassword($username){//this function returns a user's hashed password
        $connMgr=new connectionManager();
        $conn=$connMgr->connect();

        $sql="select * from user
        WHERE username=:username"; //fetch any username that is the same as this username
        $stmt=$conn->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);

        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        
        $user=[];
        While ($row=$stmt->fetch()){
        $user[]=$row['username'];
        $user[]=$row['pass'];//returns an array where first item is username and second item is password
        }

        $stmt=null;
        $conn=null;

                return $user;//empty array if user does not exist
            }
            }