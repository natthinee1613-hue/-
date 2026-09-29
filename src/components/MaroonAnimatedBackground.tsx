import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  alphaSpeed: number;
  color: string;
  glow: number;
}

export const MaroonAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle Palette: Gold, Ruby, Amber, Crimson, Rose Stardust
    const colors = [
      '251, 191, 36',   // Bright Gold
      '245, 158, 11',   // Amber Gold
      '244, 63, 94',    // Ruby Rose
      '225, 29, 72',    // Crimson
      '254, 205, 211',  // Soft Star Pearl
    ];

    const particleCount = Math.min(48, Math.floor(width / 30));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const maxAlpha = Math.random() * 0.5 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.15, // Drift upward smoothly
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        alphaSpeed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: Math.random() * 12 + 6,
      });
    }

    let time = 0;
    let mouseX = width * 0.5;
    let mouseY = height * 0.5;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', handleMouseMove);

    // Draw Police 8-pointed star watermark
    const drawPoliceStar = (cx: number, cy: number, outerR: number, innerR: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      const points = 8;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / points;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner decorative ring
      ctx.beginPath();
      ctx.arc(0, 0, innerR * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 63, 94, ${alpha * 0.8})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer delicate ray ticks
      for (let i = 0; i < points; i++) {
        const angle = (i * Math.PI) / (points / 2);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * (outerR + 2), Math.sin(angle) * (outerR + 2));
        ctx.lineTo(Math.cos(angle) * (outerR + 10), Math.sin(angle) * (outerR + 10));
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = () => {
      time += 0.012;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic Luminous Ribbon Waves in rich maroon / crimson
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.45 + w * 0.18);
        const freq = 0.0028 + w * 0.001;
        const speed = time * (0.8 + w * 0.4);
        const amp = 22 + w * 14;

        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 8) {
          const y = baseHeight + Math.sin(x * freq + speed) * amp + Math.cos(x * freq * 0.6 - speed * 0.5) * (amp * 0.5);
          if (x === 0) {
            ctx.lineTo(0, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        // Wave gradient
        const waveGrad = ctx.createLinearGradient(0, baseHeight - 40, width, height);
        if (w === 0) {
          waveGrad.addColorStop(0, 'rgba(159, 18, 57, 0.22)'); // Deep rose/ruby
          waveGrad.addColorStop(0.5, 'rgba(190, 24, 93, 0.16)');
          waveGrad.addColorStop(1, 'rgba(136, 19, 55, 0.05)');
        } else if (w === 1) {
          waveGrad.addColorStop(0, 'rgba(217, 119, 6, 0.12)');  // Warm amber gold edge
          waveGrad.addColorStop(0.6, 'rgba(159, 18, 57, 0.14)');
          waveGrad.addColorStop(1, 'rgba(112, 17, 36, 0.04)');
        } else {
          waveGrad.addColorStop(0, 'rgba(225, 29, 72, 0.15)'); // Crimson ribbon
          waveGrad.addColorStop(1, 'rgba(76, 5, 25, 0.0)');
        }

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Delicate luminous crest line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const y = baseHeight + Math.sin(x * freq + speed) * amp + Math.cos(x * freq * 0.6 - speed * 0.5) * (amp * 0.5);
          if (x === 0) ctx.moveTo(0, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w === 1 
          ? `rgba(251, 191, 36, ${0.15 + Math.sin(time + w) * 0.08})`
          : `rgba(244, 63, 94, ${0.18 + Math.cos(time + w) * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Rotating Police Emblem Starburst Watermarks
      // Left watermark (subtle, behind agency kicker/emblem)
      drawPoliceStar(
        width * 0.12, 
        height * 0.52, 
        75, 
        38, 
        time * 0.1, 
        0.08 + Math.sin(time * 0.5) * 0.02
      );

      // Right watermark (larger, soft luxury watermark)
      drawPoliceStar(
        width * 0.88, 
        height * 0.48, 
        110, 
        55, 
        -time * 0.08, 
        0.06 + Math.cos(time * 0.4) * 0.02
      );

      // Center-right secondary geometric star
      drawPoliceStar(
        width * 0.62, 
        height * 0.75, 
        50, 
        24, 
        time * 0.15, 
        0.05
      );

      // 3. Interactive / Ambient Mouse Radial Glow
      const glowGrad = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, Math.max(160, width * 0.3)
      );
      glowGrad.addColorStop(0, 'rgba(251, 113, 133, 0.18)'); // soft rose-gold aura
      glowGrad.addColorStop(0.4, 'rgba(225, 29, 72, 0.08)');
      glowGrad.addColorStop(1, 'rgba(136, 19, 55, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Floating Animated Stardust Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Twinkle alpha
        p.alpha += p.alphaSpeed;
        if (p.alpha >= p.maxAlpha || p.alpha <= 0.05) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = p.glow;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      parent?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* Base Deep Maroon Gradient (สีเลือดหมูราชสำนัก/ตำรวจ) */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#2a0408] via-[#480a12] via-45% to-[#1e0205]"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 20% 40%, rgba(136, 19, 55, 0.45) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 85% 30%, rgba(190, 24, 93, 0.3) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 50% 90%, rgba(180, 83, 9, 0.25) 0%, transparent 60%),
            linear-gradient(135deg, #230307 0%, #3e0710 25%, #590c17 50%, #3f0810 75%, #1d0205 100%)
          `
        }}
      />

      {/* Decorative Thai Royal Police Geometric Lattice Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] mix-blend-color-dodge"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(251, 191, 36, 0.3) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(251, 191, 36, 0.3) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(251, 191, 36, 0.3) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(251, 191, 36, 0.3) 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      {/* High-Performance Canvas for Dynamic Particle Waves & Shimmer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
      />

      {/* Top and Bottom Royal Golden Filigree Lines with Soft Glow */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 via-50% to-transparent shadow-[0_1px_8px_rgba(251,191,36,0.6)]" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 via-50% to-transparent shadow-[0_-1px_6px_rgba(251,191,36,0.5)]" />

      {/* Subtle Vignette Scrim at Edges for Maximum Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/35 pointer-events-none" />
    </div>
  );
};
