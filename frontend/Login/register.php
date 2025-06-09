<!DOCTYPE HTML>
<body>

<p1>
<?php
require_once 'users.php';

$users=new users();
//initialize
$username="";
$password1="";
$password2="";
$check=[];

if(isset($_GET["register"]))
    {if (isset($_GET["username"])){//checks that user has entered a username
    $username=$_GET["username"];
    $check[]=1;
    $userExists=$users->getUser($username);
    if($userExists){
        echo"
        Username already taken. Please choose another username.
        ";//error message if $username already exists in the database
    }
    else{
        $check[]=2;
    }
}

else{//no username error message
    echo"
    No username entered. Please enter a username and try again.<br>
    ";
}

if (isset($_GET["password1"])){//checks that user has entered a password
    $password1=$_GET["password1"];
    $check[]=3;
    if(isset($_GET["password2"])){//checks that the user has re-entered password
        $password2=$_GET["password2"];
        if($password1===$password2){//checks that both passwords match
            $check[]=4;
        }
        else{
            echo"Passwords do not match.<br>";
        }
    }
    else{
        echo"Please re-enter your password!<br>";
    }
}
else{
    echo"Please enter a password!<br>";
}


if($check===[1,2,3,4]){
    $success=$users->newUser($username,$password1); //success is a boolean on whether user creation worked or not
    if ($success){
        echo"Account created successfully!";
        echo"
        <form action='login.php'>
        <input type='submit'value='Return to Login'>
        </form>";
    }
    else{
        echo"An error occurred. Please try again.";
    }
    }
}
?>
<p1>

    <?php
    echo"
        <form method='get' action='register.php'>
        Username:<br>
        <input type='text' name='username' value='$username'><br>
        Password:<br>
        <input type='password' name='password1' value='$password1'><br>
        Re-enter Password:<br>
        <input type='password' name='password2' value='$password2'><br>
        <input type='submit' name='register' value='register'>";
        ?>
    </form>
</body>
