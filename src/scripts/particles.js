function initializeFireAnimation() {
    const canvas = document.getElementById("fire-canvas");
    if (!canvas) return; // Exit if canvas not found
    
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match container
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Fire animation class
    class FireAnimation {
        constructor() {
            this.particles = [];
            this.paletteBase = [
                { r: 245, g: 167, b: 66 }, // Gold
                { r: 232, g: 90, b: 25 }, // Orange
                { r: 255, g: 62, b: 0 }, // Bright red-orange
                { r: 191, g: 34, b: 34 }, // Deep red
                { r: 80, g: 20, b: 70 }, // Purple shadow
            ];

            this.palette = [...this.paletteBase];
            this.time = 0;
            this.lastUpdateTime = 0;

            // Initialize particles
            this.createParticles();

            // Start the animation
            this.animate();
        }

        createParticles() {
            const particleCount = Math.floor(
                (canvas.width * canvas.height) / 3000,
            );

            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height + Math.random() * 100,
                    size: 5 + Math.random() * 25,
                    opacity: 0.1 + Math.random() * 0.5,
                    speedX: (Math.random() - 0.5) * 1.5,
                    speedY: -1.5 - Math.random() * 3,
                    colorIndex: Math.floor(
                        Math.random() * this.palette.length,
                    ),
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    sway: 0.3 + Math.random() * 0.5,
                    swaySpeed: 0.005 + Math.random() * 0.01,
                    swayOffset: Math.random() * Math.PI * 2,
                    lifespan: 100 + Math.random() * 200,
                });
            }
        }

        animate(currentTime = 0) {
            const deltaTime = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update time
            this.time += 0.01;

            // Shift color palette slightly over time
            this.updatePalette();

            // Draw and update particles
            this.updateParticles(deltaTime);

            // Add new particles if needed
            if (this.particles.length < 100) {
                this.createParticles();
            }

            // Continue animation
            requestAnimationFrame(this.animate.bind(this));
        }

        updatePalette() {
            // Subtly shift colors over time for a dynamic effect
            this.palette = this.paletteBase.map((color, index) => {
                const t = this.time + index * 0.5;
                const variation = 20;

                return {
                    r: Math.min(
                        255,
                        Math.max(0, color.r + Math.sin(t) * variation),
                    ),
                    g: Math.min(
                        255,
                        Math.max(0, color.g + Math.sin(t + 1) * variation),
                    ),
                    b: Math.min(
                        255,
                        Math.max(0, color.b + Math.sin(t + 2) * variation),
                    ),
                };
            });
        }

        updateParticles(deltaTime) {
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                // Apply movement
                p.x +=
                    p.speedX +
                    Math.sin(this.time * p.swaySpeed + p.swayOffset) *
                    p.sway;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;
                p.lifespan -= 1;

                // Gradually reduce size and opacity as particle rises
                const lifeFactor = p.lifespan / 300;
                const currentSize = p.size * lifeFactor;
                const currentOpacity = p.opacity * lifeFactor;

                // Draw particle as a brushstroke-like shape
                if (p.lifespan > 0) {
                    this.drawBrushstroke(
                        p.x,
                        p.y,
                        currentSize,
                        p.rotation,
                        this.palette[p.colorIndex],
                        currentOpacity,
                    );
                }

                // Reset particles that have faded out
                if (p.lifespan <= 0 || p.y < -100) {
                    this.particles[i] = {
                        x: Math.random() * canvas.width,
                        y: canvas.height + Math.random() * 50,
                        size: 5 + Math.random() * 25,
                        opacity: 0.1 + Math.random() * 0.5,
                        speedX: (Math.random() - 0.5) * 1.5,
                        speedY: -1.5 - Math.random() * 3,
                        colorIndex: Math.floor(
                            Math.random() * this.palette.length,
                        ),
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.02,
                        sway: 0.3 + Math.random() * 0.5,
                        swaySpeed: 0.005 + Math.random() * 0.01,
                        swayOffset: Math.random() * Math.PI * 2,
                        lifespan: 100 + Math.random() * 200,
                    };
                }
            }
        }

        drawBrushstroke(x, y, size, rotation, color, opacity) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);

            // Create a gradient for more realistic looking flame
            const gradient = ctx.createLinearGradient(0, -size, 0, size);
            gradient.addColorStop(
                0,
                `rgba(${color.r}, ${color.g}, ${color.b}, 0)`,
            );
            gradient.addColorStop(
                0.5,
                `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`,
            );
            gradient.addColorStop(
                1,
                `rgba(${color.r}, ${color.g}, ${color.b}, 0)`,
            );

            ctx.fillStyle = gradient;

            // Draw a curved brushstroke shape
            ctx.beginPath();
            ctx.moveTo(-size / 3, -size);
            ctx.quadraticCurveTo(size / 2, 0, -size / 3, size);
            ctx.quadraticCurveTo(size / 2, 0, size / 3, -size / 2);
            ctx.closePath();
            ctx.fill();

            // Add some smaller accent strokes for texture
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.7})`;
            ctx.beginPath();
            ctx.ellipse(size / 6, 0, size / 4, size / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    // Initialize the fire animation
    new FireAnimation();
}

// Initialize on page load and after view transitions
document.addEventListener("DOMContentLoaded", initializeFireAnimation);
document.addEventListener("astro:page-load", initializeFireAnimation);