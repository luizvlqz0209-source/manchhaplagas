const canvas = document.getElementById('nebulaCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = { x: null, y: null, radius: 120 };

// Adaptar tamaño al canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

window.addEventListener('resize', resizeCanvas);

// Captura de movimiento (Ratón y Táctil)
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

window.addEventListener('touchend', () => {
  mouse.x = null;
  mouse.y = null;
});

// Clase Partícula (Micro-nebulización)
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5; // Tamaño fino
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = (Math.random() - 0.5) * 0.6; // Velocidad flotante
    this.vy = (Math.random() - 0.5) * 0.6;
    
    // Paleta de colores: Rojo corporativo y tonos blanco/grisáceo para vapor
    const colors = [
      'rgba(230, 57, 70, ',   /* Red Bright */
      'rgba(195, 28, 28, ',   /* Red Dark */
      'rgba(245, 244, 241, ', /* White */
      'rgba(138, 136, 134, '  /* Gray */
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.4 + 0.1; // Opacidad suave
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.colorBase + this.alpha + ')';
    ctx.fill();
  }

  update() {
    // Movimiento natural
    this.x += this.vx;
    this.y += this.vy;

    // Rebote en bordes
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Interacción con cursor (Efecto Repelente / Limpieza)
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        let force = (mouse.radius - distance) / mouse.radius;
        let angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 5;
        this.y -= Math.sin(angle) * force * 5;
      }
    }

    this.draw();
  }
}

function initParticles() {
  particles = [];
  // Ajusta la densidad según el tamaño de la pantalla
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  requestAnimationFrame(animate);
}

// Inicialización
resizeCanvas();
animate();