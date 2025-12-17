<?php
// match.php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

// Mock Potential Matches
$potential_matches = [
    [
        'id' => 2,
        'username' => 'Bob_The_Vibe',
        'age' => 26,
        'pic' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=500', 
        'artists' => 'Tame Impala, The Weeknd',
        'bio' => 'Just here for the music and good times.'
    ],
    // Only showing one card for simplicity in this demo, but logic supports arrays
];
$match = $potential_matches[0];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Match</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <div class="container" style="padding-bottom: 80px; justify-content: center;">
        
        <!-- Card -->
        <div class="match-card" style="background-image: url('<?php echo $match['pic']; ?>');">
            <div class="match-info">
                <h2 style="font-weight: 800; font-size: 2rem;"><?php echo $match['username']; ?>, <?php echo $match['age']; ?></h2>
                <div style="margin: 5px 0; color: var(--neon-cyan); font-size: 0.9rem;">
                    <i class="fa-brands fa-spotify"></i> <?php echo $match['artists']; ?>
                </div>
                <p style="color: #ddd; margin-top: 5px;"><?php echo $match['bio']; ?></p>
            </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; justify-content: center; gap: 30px; margin-top: 30px;">
            <button class="btn" style="background: #222; color: #ff4444; width: 60px; height: 60px; padding: 0; display:flex; align-items:center; justify-content:center; border: 2px solid #ff4444;">
                <i class="fa-solid fa-xmark" style="font-size: 1.5rem;"></i>
            </button>
            <button class="btn" style="background: #222; color: var(--neon-cyan); width: 60px; height: 60px; padding: 0; display:flex; align-items:center; justify-content:center; border: 2px solid var(--neon-cyan);">
                <i class="fa-solid fa-star" style="font-size: 1.5rem;"></i>
            </button>
            <button class="btn" onclick="likeUser()" style="background: var(--neon-pink); color: white; width: 60px; height: 60px; padding: 0; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 20px rgba(255, 0, 204, 0.4);">
                <i class="fa-solid fa-heart" style="font-size: 1.5rem;"></i>
            </button>
        </div>

    </div>

    <!-- Navigation -->
    <nav>
        <a href="match.php" class="active"><i class="fa-solid fa-fire"></i> Match</a>
        <a href="connect.php"><i class="fa-solid fa-mobile-screen-button"></i> Connect</a>
        <a href="profile.php"><i class="fa-regular fa-user"></i> Profile</a>
    </nav>

    <script>
        function likeUser() {
            // Simple visual feedback for demo
            document.querySelector('.match-card').style.transform = 'translateX(100px) rotate(10deg)';
            document.querySelector('.match-card').style.opacity = '0';
            document.querySelector('.match-card').style.transition = 'all 0.5s ease';
            setTimeout(() => {
                alert("It's a Match! (Demo)");
                // Reset for demo
                document.querySelector('.match-card').style.transform = 'none';
                document.querySelector('.match-card').style.opacity = '1';
            }, 500);
        }
    </script>

</body>
</html>
