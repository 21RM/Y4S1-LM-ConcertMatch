<?php
// profile.php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

// Mock Data (In real app, fetch from DB)
$user = [
    'username' => 'Alice_Rocker',
    'profile_pic' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    'bio' => 'Live for the mosh pit. Looking for concert buddies!',
    'top_artists' => ['Metallica', 'Iron Maiden', 'Paramore'],
    'top_genres' => ['Metal', 'Rock', 'Punk'],
    'media' => [
        ['type' => 'video', 'thumb' => 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=200', 'caption' => 'Download Festival 2023'],
        ['type' => 'image', 'thumb' => 'https://images.unsplash.com/photo-1459749411177-3c27a31874b0?auto=format&fit=crop&q=80&w=200', 'caption' => 'First row!'],
    ]
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <div class="container" style="padding-bottom: 80px;">
        <div class="profile-header">
            <img src="<?php echo $user['profile_pic']; ?>" alt="Profile" class="profile-pic">
            <h2 class="title-gradient"><?php echo $user['username']; ?></h2>
            <p style="color: var(--text-muted);"><?php echo $user['bio']; ?></p>
        </div>

        <div class="card">
            <h3 style="color: var(--neon-cyan); margin-bottom: 10px;"><i class="fa-brands fa-spotify"></i> Top Artists</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <?php foreach ($user['top_artists'] as $artist): ?>
                    <span style="background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                        <?php echo $artist; ?>
                    </span>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="card">
            <h3 style="color: var(--neon-pink); margin-bottom: 10px;"><i class="fa-solid fa-music"></i> Vibes</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <?php foreach ($user['top_genres'] as $genre): ?>
                    <span style="border: 1px solid var(--neon-pink); color: var(--neon-pink); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                        <?php echo $genre; ?>
                    </span>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="card" style="text-align: center; margin-top: 20px; cursor: pointer;" onclick="window.location='archive.php'">
            <h3 style="color: var(--neon-purple); margin-bottom: 15px;"><i class="fa-solid fa-box-archive"></i> Concert Archive</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">View your timeline of gigs ➜</p>
        </div>
    </div>

    <!-- Navigation -->
    <nav>
        <a href="match.php"><i class="fa-solid fa-fire"></i> Match</a>
        <a href="connect.php"><i class="fa-solid fa-mobile-screen-button"></i> Connect</a>
        <a href="profile.php" class="active"><i class="fa-regular fa-user"></i> Profile</a>
    </nav>

</body>
</html>
