document.addEventListener('DOMContentLoaded', function() {
    
    // ------------------------------------
    // 1. LÓGICA DE INTERACTIVIDAD DE PROCESO (MODIFICADA PARA IDIOMA)
    // ------------------------------------

    const processNodes = document.querySelectorAll('.process-node');
    const detailCard = document.getElementById('process-detail');

    // NOTA: El contenido por defecto (defaultTitle, defaultDetail) se maneja ahora
    // dentro de script.js mediante la función window.updateProcessDetailCardDefault()
    // para asegurar que siempre se muestre traducido.

    processNodes.forEach(node => {
        // Manejar el clic para cambiar el contenido de la tarjeta
        node.addEventListener('click', function() {
            // Remover la clase 'active' de todos los nodos
            processNodes.forEach(n => n.classList.remove('active'));
            // Añadir la clase 'active' al nodo actual
            this.classList.add('active');

            // Obtener las CLAVES DE TRADUCCIÓN del nodo (data-key-title, data-key-detail)
            const titleKey = this.getAttribute('data-key-title');
            const detailKey = this.getAttribute('data-key-detail');
            const iconClass = this.getAttribute('data-icon');

            // Obtener el TEXTO TRADUCIDO usando la función global de script.js
            // La función window.getTranslation debe estar definida en script.js
            const title = window.getTranslation(titleKey);
            const detail = window.getTranslation(detailKey);

            // Crear el nuevo contenido
            const newTitle = `<i class="${iconClass}" style="color: var(--primary-color); margin-right: 10px;"></i>${title}`;
            const newDetail = `<p>${detail}</p>`;

            // Aplicar transición de opacidad
            detailCard.style.opacity = '0';
            setTimeout(() => {
                // Actualizamos el HTML completo de la tarjeta
                detailCard.innerHTML = `<h3>${newTitle}</h3>${newDetail}`;
                detailCard.style.opacity = '1';
            }, 300); // Se aumenta la duración para transiciones más suaves
        });
    });


    // ------------------------------------
    // 2. LÓGICA DE FONDO INTERACTIVO DE PUNTOS (SIN MODIFICACIONES)
    // ------------------------------------

    const bgCanvas = document.getElementById('interactive-background');
    // Si el canvas no existe (ej: estamos en index.html), salimos
    if (!bgCanvas) return; 

    const ctx = bgCanvas.getContext('2d');
    
    // Parámetros
    const numParticles = 40;
    const maxVelocity = 0.15;
    const connectionDistance = 150; 
    const particles = [];
    
    let canvasWidth, canvasHeight;

    // Función para redimensionar el canvas
    function resizeCanvas() {
        // Usamos el tamaño de la ventana completa
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        bgCanvas.width = canvasWidth;
        bgCanvas.height = canvasHeight;
    }

    // Definición de Partículas
    class Particle {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.vx = (Math.random() - 0.5) * maxVelocity; 
            this.vy = (Math.random() - 0.5) * maxVelocity;
            this.radius = Math.random() * 2 + 1; // Radio de 1 a 3
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebotar en los bordes
            if (this.x < 0 || this.x > canvasWidth) {
                this.vx *= -1;
            }
            if (this.y < 0 || this.y > canvasHeight) {
                this.vy *= -1;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Inicializar partículas
    function initParticles() {
        particles.length = 0; // Limpiar array
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Dibujar líneas entre partículas cercanas
    function connectParticles() {
        for (let i = 0; i < numParticles; i++) {
            for (let j = i + 1; j < numParticles; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const distanceX = p1.x - p2.x;
                const distanceY = p1.y - p2.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance); 
                    
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
                    ctx.lineWidth = 1;
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Bucle Principal de Animación
    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        connectParticles();
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    
    // Inicialización y escucha de eventos
    resizeCanvas();
    initParticles();
    animate();
    window.addEventListener('resize', () => {
        resizeCanvas();
        // Al redimensionar, volvemos a inicializar las partículas en nuevas posiciones
        initParticles(); 
    });

});