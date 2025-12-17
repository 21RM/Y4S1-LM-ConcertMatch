<?php
// connect.php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connect Devices</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <style>
        .status-text {
            text-align: center;
            margin-top: 20px;
            font-size: 1.2rem;
            color: var(--neon-cyan);
            min-height: 30px;
        }
    </style>
</head>
<body>

    <div class="container" style="justify-content: center; align-items: center; padding-bottom: 80px;">
        
        <h2 class="title-gradient" style="margin-bottom: 40px;">Proximity Match</h2>

        <div class="connect-ring active" id="ring">
            <i class="fa-solid fa-signal" style="font-size: 3rem; color: rgba(255,255,255,0.5);"></i>
        </div>

        <div class="status-text" id="status">
            Searching for nearby vibes...
        </div>
        
        <p style="text-align: center; color: #666; font-size: 0.9rem; margin-top: 10px; max-width: 300px;">
            Bring your phones close together to verify your connection.
        </p>

        <!-- Hidden simulation button for demo purposes -->
        <button onclick="simulateConnection()" class="btn btn-outline" style="margin-top: 50px; border-color: #333; color: #555; font-size: 0.8rem;">
            (Simulate NFC Tap)
        </button>

        <div id="success-msg" style="display: none; text-align: center; margin-top: 30px;">
            <h3 style="color: var(--neon-pink); font-size: 2rem;">Connected!</h3>
            <p>Vibes synced with <b>Bob_The_Vibe</b></p>
            <div style="font-size: 3rem; margin-top: 20px;">🎉</div>
        </div>

    </div>

    <!-- Navigation -->
    <nav>
        <a href="match.php"><i class="fa-solid fa-fire"></i> Match</a>
        <a href="connect.php" class="active"><i class="fa-solid fa-mobile-screen-button"></i> Connect</a>
        <a href="profile.php"><i class="fa-regular fa-user"></i> Profile</a>
    </nav>

    <script>
        function simulateConnection() {
            const ring = document.getElementById('ring');
            const status = document.getElementById('status');
            const successMsg = document.getElementById('success-msg');
            
            // Speed up pulse
            ring.style.animationDuration = '0.5s';
            status.innerHTML = "Device detected...";
            status.style.color = "var(--neon-pink)";

            setTimeout(() => {
                ring.style.borderColor = "var(--neon-pink)";
                ring.innerHTML = '<i class="fa-solid fa-check" style="font-size: 3rem; color: var(--neon-pink);"></i>';
                ring.style.animation = 'none';
                ring.style.boxShadow = '0 0 50px var(--neon-pink)';
                
                status.style.display = 'none';
                successMsg.style.display = 'block';
                successMsg.style.animation = 'float 3s ease-in-out infinite';

                // Confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff00cc', '#00ffff', '#bd00ff']
                });

            }, 1000);
        }
    </script>

</body>
</html>
