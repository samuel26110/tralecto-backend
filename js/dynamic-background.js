/**
 * Tralecto - Cyber Oceanic Interactive Engine
 * Canvas animado ultraligero a 60fps con temática marina tech:
 * - Rayos de luz subacuática (Caustics)
 * - Burbujas bioluminiscentes reactivas al cursor
 * - Ondas y estelas interactivas
 * - Tiburones cibernéticos vectoriales en capas de profundidad con movimiento sinusoidal orgánico
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initOceanCanvas);

    function initOceanCanvas() {
        const bgContainer = document.getElementById('dynamic-bg');
        if (!bgContainer) return;

        // Limpiar canvas previos si existieran
        bgContainer.innerHTML = '';

        const canvas = document.createElement('canvas');
        canvas.id = 'ocean-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        bgContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let dpr = window.devicePixelRatio || 1;

        // Estado del mouse interactivo
        const mouse = {
            x: -1000,
            y: -1000,
            targetX: -1000,
            targetY: -1000,
            radius: 140,
            isHovered: false
        };

        function resize() {
            width = bgContainer.offsetWidth;
            height = bgContainer.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        resize();
        window.addEventListener('resize', resize);

        // Escuchar interacción del usuario en la ventana / hero
        window.addEventListener('mousemove', (e) => {
            const rect = bgContainer.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.isHovered = (e.clientY <= rect.bottom && e.clientY >= rect.top);
        });

        window.addEventListener('mouseleave', () => {
            mouse.isHovered = false;
            mouse.x = -1000;
            mouse.y = -1000;
        });

        // ----------------------------------------------------
        // 1. BURBUJAS Y PARTÍCULAS BIOLUMINISCENTES
        // ----------------------------------------------------
        class Bubble {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + Math.random() * 50;
                this.radius = Math.random() * 2.8 + 1.2;
                this.baseVy = -(Math.random() * 0.8 + 0.4);
                this.vy = this.baseVy;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.wobbleSpeed = Math.random() * 0.03 + 0.01;
                this.wobbleAmp = Math.random() * 1.5 + 0.5;
                this.time = Math.random() * 100;
                this.alpha = Math.random() * 0.5 + 0.2;
                // Colores cyan / aguamarina / azul eléctrico
                this.hue = Math.random() > 0.4 ? '0, 229, 255' : '40, 167, 69';
            }

            update() {
                this.time += this.wobbleSpeed;
                this.y += this.vy;
                this.x += this.vx + Math.sin(this.time) * (this.wobbleAmp * 0.2);

                // Reacción al mouse (burbujas se apartan suavemente)
                if (mouse.isHovered) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius && dist > 0) {
                        const force = (1 - dist / mouse.radius) * 2;
                        this.x += (dx / dist) * force;
                        this.y += (dy / dist) * force - 0.5;
                    }
                }

                if (this.y < -30 || this.x < -30 || this.x > width + 30) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.hue}, ${this.alpha})`;
                ctx.shadowColor = `rgba(${this.hue}, 0.8)`;
                ctx.shadowBlur = 6;
                ctx.fill();

                // Brillo especular blanco en la burbuja
                ctx.beginPath();
                ctx.arc(this.x - this.radius * 0.35, this.y - this.radius * 0.35, this.radius * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.9})`;
                ctx.fill();
                ctx.restore();
            }
        }

        // ----------------------------------------------------
        // 2. TIBURÓN CIBERNÉTICO VECTORIAL (Mascota Tralecto)
        // ----------------------------------------------------
        class CyberShark {
            constructor(layer = 1) {
                this.layer = layer; // 0 = fondo (lejos, borroso), 1 = medio, 2 = primer plano
                this.reset(true);
            }

            reset(initial = false) {
                this.direction = Math.random() > 0.5 ? 1 : -1; // 1 = derecha, -1 = izquierda
                this.scale = (this.layer === 0 ? 0.35 : (this.layer === 1 ? 0.65 : 1.0)) * (0.8 + Math.random() * 0.3);
                
                this.length = 150 * this.scale;
                this.width = 45 * this.scale;

                this.x = initial 
                    ? Math.random() * width 
                    : (this.direction === 1 ? -this.length - 100 : width + this.length + 100);

                // Profundidad en el hero
                const minY = 60;
                const maxY = Math.max(height - 80, minY + 100);
                this.y = minY + Math.random() * (maxY - minY);

                this.targetY = this.y;
                this.baseSpeed = (this.layer === 0 ? 0.9 : (this.layer === 1 ? 1.5 : 2.1)) * (0.9 + Math.random() * 0.3);
                this.speed = this.baseSpeed;
                
                this.tailAngle = 0;
                this.tailSpeed = 0.065 * (this.speed / 1.5);
                this.swimCycle = Math.random() * Math.PI * 2;

                // Opacidad según capa de profundidad
                this.opacity = this.layer === 0 ? 0.35 : (this.layer === 1 ? 0.65 : 0.95);
            }

            update() {
                this.swimCycle += this.tailSpeed;
                this.tailAngle = Math.sin(this.swimCycle) * 0.35; // Oscilación sinusoidal de la cola

                this.x += this.speed * this.direction;

                // Ondulación vertical suave al nadar
                this.y += Math.sin(this.swimCycle * 0.5) * 0.4;

                // Evasión o reacción al mouse si se acerca
                if (mouse.isHovered) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const alertRadius = 180 * this.scale;
                    
                    if (dist < alertRadius) {
                        // El tiburón acelera y se sumerge ligeramente
                        this.speed = this.baseSpeed * 1.8;
                        this.y += (dy > 0 ? 1 : -1) * 0.9;
                    } else {
                        this.speed = this.speed * 0.98 + this.baseSpeed * 0.02;
                    }
                } else {
                    this.speed = this.speed * 0.98 + this.baseSpeed * 0.02;
                }

                // Si sale de pantalla, reaparece
                if (this.direction === 1 && this.x > width + this.length + 150) {
                    this.reset();
                } else if (this.direction === -1 && this.x < -this.length - 150) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.direction * this.scale, this.scale);

                // Inclinación según movimiento vertical y oscilación
                const tilt = Math.sin(this.swimCycle * 0.5) * 0.04;
                ctx.rotate(tilt);

                ctx.globalAlpha = this.opacity;

                // 1. Silueta / Cuerpo de tiburón aerodinámico
                ctx.beginPath();
                ctx.moveTo(80, 0); // Hocico puntiagudo
                // Espalda con curvatura hidrodinámica
                ctx.quadraticCurveTo(35, -28, -25, -20);
                // Hacia la cola
                ctx.quadraticCurveTo(-70, -12, -90, -4);
                // Pedúnculo caudal articulado
                const tailX = -125 + Math.sin(this.tailAngle) * 8;
                const tailYTop = -28 + Math.sin(this.tailAngle) * 12;
                const tailYBottom = 20 + Math.sin(this.tailAngle) * 12;
                // Aleta Caudal (Cola superior más larga)
                ctx.lineTo(tailX - 10, tailYTop);
                ctx.quadraticCurveTo(tailX + 5, 0, tailX - 5, tailYBottom);
                // Vientre hacia adelante
                ctx.lineTo(-85, 6);
                ctx.quadraticCurveTo(-35, 24, 20, 16);
                // Mandíbula hacia el hocico
                ctx.quadraticCurveTo(60, 12, 80, 0);
                ctx.closePath();

                // Relleno de degradado azul abisal a azul acero
                const bodyGrad = ctx.createLinearGradient(0, -30, 0, 30);
                bodyGrad.addColorStop(0, '#0a3663');
                bodyGrad.addColorStop(0.5, '#134e86');
                bodyGrad.addColorStop(1, '#689dc7');
                ctx.fillStyle = bodyGrad;
                ctx.fill();

                // 2. Aleta Dorsal icónica
                ctx.beginPath();
                ctx.moveTo(5, -24);
                ctx.quadraticCurveTo(-15, -60, -32, -58);
                ctx.quadraticCurveTo(-24, -35, -35, -18);
                ctx.fillStyle = '#082f57';
                ctx.fill();

                // 3. Aleta Pectoral frontal
                ctx.beginPath();
                ctx.moveTo(35, 6);
                ctx.quadraticCurveTo(5, 38, -15, 48);
                ctx.quadraticCurveTo(5, 24, 15, 12);
                ctx.fillStyle = '#062648';
                ctx.fill();

                // 4. Brillo Neón Tecnológico (Línea cibernética lateral)
                ctx.beginPath();
                ctx.moveTo(55, -2);
                ctx.quadraticCurveTo(10, -5, -65, -3);
                ctx.lineTo(-90, 0);
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 2.2;
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 10;
                ctx.stroke();

                // 5. Ojo tecnológico con visor LED cyan
                ctx.beginPath();
                ctx.arc(58, -6, 2.8, 0, Math.PI * 2);
                ctx.fillStyle = '#00f2fe';
                ctx.shadowColor = '#00f2fe';
                ctx.shadowBlur = 8;
                ctx.fill();

                // 6. Branquias sutiles
                ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
                ctx.lineWidth = 1.2;
                ctx.shadowBlur = 0;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(25 - i * 5, -8);
                    ctx.lineTo(23 - i * 5, 8);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        // ----------------------------------------------------
        // 3. RAYOS DE LUZ SUBACUÁTICA (LIGHT CAUSTICS)
        // ----------------------------------------------------
        class SunRay {
            constructor() {
                this.x = Math.random() * width;
                this.width = Math.random() * 90 + 40;
                this.tilt = (Math.random() - 0.5) * 0.4 - 0.2;
                this.speed = Math.random() * 0.005 + 0.002;
                this.time = Math.random() * 10;
                this.baseAlpha = Math.random() * 0.07 + 0.03;
            }

            update() {
                this.time += this.speed;
            }

            draw() {
                const alpha = this.baseAlpha + Math.sin(this.time) * 0.02;
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(this.x, 0);
                ctx.lineTo(this.x + this.width, 0);
                ctx.lineTo(this.x + this.width + height * this.tilt, height);
                ctx.lineTo(this.x + height * this.tilt, height);
                ctx.closePath();

                const rayGrad = ctx.createLinearGradient(this.x, 0, this.x, height);
                rayGrad.addColorStop(0, `rgba(0, 229, 255, ${alpha * 1.8})`);
                rayGrad.addColorStop(0.6, `rgba(2, 136, 209, ${alpha * 0.8})`);
                rayGrad.addColorStop(1, 'rgba(4, 69, 138, 0)');
                ctx.fillStyle = rayGrad;
                ctx.fill();
                ctx.restore();
            }
        }

        // Crear elementos
        const bubbles = [];
        const numBubbles = Math.min(Math.floor(window.innerWidth / 22), 55);
        for (let i = 0; i < numBubbles; i++) {
            bubbles.push(new Bubble());
        }

        const rays = [];
        for (let i = 0; i < 5; i++) {
            rays.push(new SunRay());
        }

        // Crear flota de tiburones en 3 profundidades
        const sharks = [
            new CyberShark(0), // Lejano
            new CyberShark(1), // Medio
            new CyberShark(2)  // Primer plano
        ];

        // ----------------------------------------------------
        // BUCLE PRINCIPAL DE ANIMACIÓN A 60 FPS
        // ----------------------------------------------------
        let animationFrameId;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // 1. Dibujar rayos de luz
            rays.forEach(ray => {
                ray.update();
                ray.draw();
            });

            // 2. Tiburón de fondo
            sharks[0].update();
            sharks[0].draw();

            // 3. Burbujas
            bubbles.forEach(b => {
                b.update();
                b.draw();
            });

            // 4. Tiburones medio y frontal
            sharks[1].update();
            sharks[1].draw();

            sharks[2].update();
            sharks[2].draw();

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Limpieza si se desmonta
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrameId);
        });
    }
})();