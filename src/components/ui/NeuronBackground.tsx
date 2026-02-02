'use client';

import { useEffect, useRef } from 'react';

export function NeuronBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const rectRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true }); // Optimize for transparency
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 80; // Reduced mobile count
        const connectionDistance = 150;
        const connectionDistanceSq = connectionDistance * connectionDistance;
        const mouseRadius = 200;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3; // Slower, smoother speed
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 1;
                this.color = '#3b82f6';
            }

            update(width: number, height: number, mouseX: number, mouseY: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < mouseRadius * mouseRadius) {
                    const distance = Math.sqrt(distSq);
                    const force = (mouseRadius - distance) / mouseRadius; // 0 to 1

                    // Gentler repulsion calculation
                    if (distance > 0) {
                        const directionX = dx / distance;
                        const directionY = dy / distance;
                        this.x -= directionX * force * 2; // Reduced repulsion force
                        this.y -= directionY * force * 2;
                    }
                }

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const updateRect = () => {
            if (canvas) {
                const r = canvas.getBoundingClientRect();
                rectRef.current = { left: r.left, top: r.top };
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
        };

        const handleResize = () => {
            updateRect();
            init();
        };

        const animate = () => {
            // Robust check: if canvas is gone, stop logic but don't crash
            if (!canvasRef.current) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((p) => {
                p.update(canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y);
                p.draw(ctx);
            });

            // Draw connections optimized
            // We can draw all lines in one path if they share style, but opacity varies.
            // Opacity bucketing is a good optimization.

            ctx.lineWidth = 1;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistanceSq) {
                        const alpha = 1 - (distSq / connectionDistanceSq);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.5})`; // Max opacity 0.5
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            // fast read from cached rect
            mouseRef.current = {
                x: e.clientX - rectRef.current.left,
                y: e.clientY - rectRef.current.top
            };
        };

        const handleScroll = () => {
            updateRect(); // Update positions on scroll (sticky headers etc might shift layout)
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll); // Recalculate rect on scroll

        // Initial setup
        updateRect();
        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
}
