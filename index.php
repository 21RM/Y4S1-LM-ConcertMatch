<?php
// index.php
session_start();
// Simulating login for demo
if (isset($_GET['login'])) {
    $_SESSION['user_id'] = 1; // Default to user 1
    header('Location: profile.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ConcertMatch - Find Your Crowd</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <div class="container" style="justify-content: center; align-items: center; text-align: center; height: 100vh;">
        <h1 class="title-gradient" style="font-size: 3.5rem; margin-bottom: 20px;">Concert<br>Match.</h1>
        <p style="color: var(--text-muted); margin-bottom: 40px; font-size: 1.2rem;">
            Find your concert buddy.<br>Match vibes.<br>Mosh together.
        </p>

        <a href="?login=true" class="btn btn-primary">
            <i class="fa-brands fa-spotify"></i> Login with Spotify
        </a>
        
        <div style="margin-top: 30px;">
            <p style="font-size: 0.9rem; color: #555;">Don't have Spotify?</p>
            <a href="?login=true" style="color: var(--neon-cyan); text-decoration: none;">Continue as Guest</a>
        </div>
    </div>

</body>
</html>
