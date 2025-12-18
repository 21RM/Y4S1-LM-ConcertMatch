<?php
// archive.php
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
    <title>Archive</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* ... existing styles ... */
        body {
            overflow: hidden; 
            background: #0a0a0a; 
            color: white;
            margin: 0;
            padding: 0;
            user-select: none;
        }
        
        .viewport {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            perspective: 800px; 
            overflow: hidden;
            cursor: grab;
        }
        .viewport:active {
            cursor: grabbing;
        }

        .world {
            position: absolute;
            top: 50%;
            left: 50%;
            transform-style: preserve-3d;
            will-change: transform;
        }

        /* Default Desktop Vars */
        :root {
            --item-width: 300px;
            --item-height: 200px;
            --side-dist: 250px; /* How far left/right */
        }

        .road-item {
            position: absolute;
            width: var(--item-width); 
            height: var(--item-height);
            background-size: cover;
            background-position: center;
            border: 4px solid white;
            transform-origin: center center;
            /* Center the default pos so transforms work from center */
            top: calc(var(--item-height) * -0.5); 
            left: calc(var(--item-width) * -0.5);
            box-shadow: 0 10px 30px black;
            
            /* Dynamic Transform using Props */
            transform: translate3d(var(--x-pos), 0, var(--z-pos)) rotateY(var(--rot-y));
        }

        .item-left {
            --x-pos: calc(var(--side-dist) * -1);
            --rot-y: 15deg;
        }
        .item-right {
            --x-pos: var(--side-dist);
            --rot-y: -15deg;
        }

        .date-label {
            position: absolute;
            color: var(--text-muted);
            font-size: 2rem;
            font-weight: bold;
            top: 100%; /* Below image */
            margin-top: 10px;
            left: 0;
            width: 100%;
            text-align: center;
        }

        .back-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: bold;
            border: 1px solid #333;
            backdrop-filter: blur(5px);
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
            :root {
                --item-width: 160px;  /* Smaller icons */
                --item-height: 110px;
                --side-dist: 100px;   /* Closer together */
            }
            .date-label {
                font-size: 1.2rem;
            }
            .road-item {
                border-width: 2px;
            }
        }
        
        .ground {
            position: absolute;
            top: 200px; 
            left: -1000%;
            width: 2000%;
            height: 2000%;
            background: linear-gradient(90deg, #111 1px, transparent 1px), linear-gradient(180deg, #111 1px, transparent 1px);
            background-size: 50px 50px;
            transform: rotateX(90deg);
            opacity: 0.3;
            pointer-events: none;
        }
    </style>
</head>
<body>

    <a href="profile.php" class="back-btn">← Back</a>

    <div class="viewport" id="viewport">
        <div class="world" id="world">
            <div class="ground"></div>

            <?php
            // Generate items along the Z-axis
            for ($i = 0; $i < 40; $i++) {
                $z_dist = -$i * 400; 
                
                // Determine class for side
                $side_class = ($i % 2 == 0) ? 'item-left' : 'item-right';
                
                $img = "https://picsum.photos/300/200?random=$i";
                
                // Output using CSS variables for Z only, X/Rot controlled by class
                echo "<div class='road-item $side_class' style='--z-pos: {$z_dist}px; background-image: url($img);'>";
                    echo "<div class='date-label'>May " . (20 + $i) . "</div>";
                echo "</div>";
            }
            ?>
        </div>
    </div>

    <script>
        const viewport = document.getElementById('viewport');
        const world = document.getElementById('world');
        
        let zPos = 0;     // Current camera Z position (we move world towards us, so +Z moves forward)
        let targetZ = 0;
        let isDragging = false;
        let lastY = 0;
        
        // Input Handling
        function startDrag(y) {
            isDragging = true;
            lastY = y;
            viewport.style.cursor = 'grabbing';
        }
        
        function moveDrag(y) {
            if (!isDragging) return;
            const delta = y - lastY;
            lastY = y;
            
            // Drag Down (positive) = Move Forward (positive Z translation of world)
            // Drag Up (negative) = Move Backward
            targetZ += delta * 4; // Sensitivity
        }
        
        function endDrag() {
            isDragging = false;
            viewport.style.cursor = 'grab';
        }

        // Mouse
        viewport.addEventListener('mousedown', e => startDrag(e.clientY));
        window.addEventListener('mousemove', e => moveDrag(e.clientY));
        window.addEventListener('mouseup', endDrag);

        // Touch
        viewport.addEventListener('touchstart', e => startDrag(e.touches[0].clientY));
        window.addEventListener('touchmove', e => moveDrag(e.touches[0].clientY));
        window.addEventListener('touchend', endDrag);

        // Animation Loop
        function animate() {
            // Smooth math
            zPos += (targetZ - zPos) * 0.1;
            
            // Limit backward movement? optional.
            if (targetZ < 0) targetZ = 0;

            // Apply transform
            // We translate the world along Z. 
            // Also apply a slight bobbing? Maybe later.
            world.style.transform = `translateZ(${zPos}px)`;

            requestAnimationFrame(animate);
        }
        animate();
    </script>

</body>
</html>
