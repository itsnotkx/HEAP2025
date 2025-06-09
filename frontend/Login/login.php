<!DOCTYPE html>
<p1>
<?php
require_once 'users.php';
$userdb=new users;
if (isset($_GET["submitbtn"]))
    {if(isset($_GET["username"])){
        $username=$_GET["username"];
        if(isset($_GET["password"])){//if user inputs both username and password
            $password=$_GET["password"];
            $user=$userdb->getHashedPassword($username);
            if ($user===[]){ //if user does not exist
                echo"User does not exist.";
            }
            else{
                $hashedPassword=$user[1];
                $passwordMatch=password_verify($password,$hashedPassword);
                if($passwordMatch){
                    $_SESSION["username"]=$username;
                    header("Location: homepage.html");
                }
                else{
                    echo"Incorrect Password";
                }

            }
        }  
    }
    else{
        echo"No username entered";
    }
}
?>
</p1>
<body>
    <h1>
        Login
    </h1>
    <p2>
        <form method="get" action="login.php">
        Username:<br>
        <input type="text" name="username"><br>
        Password:<br>
        <input type="password" name="password"><br>
        <input type="submit" name="submitbtn" value="login">
        </form>
    </p2>
    <p3>New user? Register <a href="register.php">here</a>
</body>