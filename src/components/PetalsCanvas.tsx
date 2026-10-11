import React, { useEffect, useRef } from 'react';
import { useAnniversary } from '../context/AnniversaryContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'petal' | 'heart';
}

export const PetalsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isPetalsActive } = useAnniversary();

  useEffect(() => {
    if (!isPetalsActive) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of particles proportional to screen width
    const particleCount = Math.min(28, Math.floor(width / 45));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedX: (Math.random() - 0.5) * 0.8 + 0.3,
        speedY: Math.random() * 1.2 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.45 + 0.2,
        type: Math.random() > 0.4 ? 'petal' : 'heart',
      });
    }

    const drawPetal = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.fillStyle = `rgba(244, 114, 182, ${opacity})`; // Soft rose pink
      ctx.ellipse(0, 0, size * 0.7, size * 1.3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawHeart = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.fillStyle = `rgba(225, 29, 72, ${opacity * 0.9})`; // Romantic rose-red
      const hSize = size * 0.7;
      ctx.moveTo(0, -hSize * 0.3);
      ctx.bezierCurveTo(-hSize * 0.6, -hSize * 0.9, -hSize * 1.2, -hSize * 0.2, 0, hSize * 0.9);
      ctx.bezierCurveTo(hSize * 1.2, -hSize * 0.2, hSize * 0.6, -hSize * 0.9, 0, -hSize * 0.3);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around horizontally & vertically
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        if (p.type === 'petal') {
          drawPetal(p.x, p.y, p.size, p.rotation, p.opacity);
        } else {
          drawHeart(p.x, p.y, p.size, p.rotation, p.opacity);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPetalsActive]);

  if (!isPetalsActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-70"
      aria-hidden="true"
    />
  );
};
