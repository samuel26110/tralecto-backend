document.addEventListener('DOMContentLoaded', function() {
    const bgContainer = document.getElementById('dynamic-bg');
    if (!bgContainer) return;

    // 1. Crear y configurar el Canvas
    const canvas = document.createElement('canvas');
    bgContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Parámetros de la animación
    const numParticles = 100;
    const maxVelocity = 0.9;
    const connectionDistance = 120; // Distancia máxima para dibujar una línea (en píxeles)
    const particles = [];
    
    let containerWidth, containerHeight;

    // Función para redimensionar el canvas y el contenedor (importante para la responsividad)
    function resizeCanvas() {
        containerWidth = bgContainer.offsetWidth;
        containerHeight = bgContainer.offsetHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
    }

    // Inicializar y escuchar el evento resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    // 2. Definición de Partículas
    class Particle {
        constructor() {
            // Posición inicial aleatoria
            this.x = Math.random() * containerWidth;
            this.y = Math.random() * containerHeight;
            
            // Velocidad aleatoria
            this.vx = (Math.random() - 0.5) * maxVelocity; 
            this.vy = (Math.random() - 0.5) * maxVelocity;

            // Radio de la partícula (debe coincidir con el estilo en CSS)
            this.radius = 2.5; 
        }

        // Dibuja el círculo de la partícula en el canvas
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(227, 228, 208, 0.8)';
            ctx.fill();
        }
        
        // Actualiza la posición y aplica rebote
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebote en los bordes
            if (this.x > containerWidth || this.x < 0) this.vx *= -1;
            if (this.y > containerHeight || this.y < 0) this.vy *= -1;
        }
    }
    
    // Llenar el arreglo de partículas
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
    
    // 3. Lógica de Conexión (El núcleo del nuevo efecto)
    function connectParticles() {
        // Doble bucle para comparar cada partícula con todas las demás
        for (let i = 0; i < numParticles; i++) {
            for (let j = i; j < numParticles; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                // Calcular la distancia entre las dos partículas (Teorema de Pitágoras)
                const distanceX = p1.x - p2.x;
                const distanceY = p1.y - p2.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // Si están cerca, dibujar una línea
                if (distance < connectionDistance) {
                    
                    // Calcular la opacidad de la línea: más cerca = más opaca
                    const opacity = 1 - (distance / connectionDistance); 
                    
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`; // Color blanco con opacidad reducida
                    ctx.lineWidth = 1;
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 4. Bucle Principal de Animación
    function animate() {
        // Limpiar el canvas en cada fotograma
        ctx.clearRect(0, 0, containerWidth, containerHeight);

        connectParticles();
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    
    // Iniciar la animación
    animate();
});