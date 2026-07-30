(function() {
    // Cuenta regresiva hacia la boda (19 de septiembre de 2026, 1:00 pm hora CDMX)
    const weddingDate = new Date('2026-09-19T13:00:00-06:00').getTime();
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function updateCountdown() {
        const now = Date.now();
        const diff = weddingDate - now;

        if (diff <= 0) {
            cdDays.textContent = '00';
            cdHours.textContent = '00';
            cdMinutes.textContent = '00';
            cdSeconds.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        cdDays.textContent = pad(days);
        cdHours.textContent = pad(hours);
        cdMinutes.textContent = pad(minutes);
        cdSeconds.textContent = pad(seconds);
    }

    if (cdDays) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelopeFlapTop = document.getElementById('envelopeFlapTop');
    const letter = document.getElementById('letter');
    const stamp = document.getElementById('stamp');
    const instruction = document.getElementById('instruction');
    const resetBtn = document.getElementById('resetBtn');
    const particlesContainer = document.getElementById('particlesContainer');
    
    let isOpen = false;
    
    // Función para crear partículas decorativas
    function createParticles() {
        const emojis = ['✨', '🌟', '💫', '🎉', '🎊', '💌', '❤️', '💛', '🎀', '💍', '💒', '🥂'];
        const containerRect = envelopeWrapper.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.left = (centerX + (Math.random() - 0.5) * 250) + 'px';
            particle.style.top = (centerY + (Math.random() - 0.5) * 150) + 'px';
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
            particle.style.setProperty('--ty', (Math.random() * -250 - 50) + 'px');
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            particlesContainer.appendChild(particle);
            
            // Forzar reflow y añadir clase animate
            void particle.offsetWidth;
            particle.classList.add('animate');
            
            // Eliminar partícula después de la animación
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
    
    // Función para abrir el sobre
    function openEnvelope() {
        if (isOpen) return;
        isOpen = true;
        
        // Rotar la solapa frontal hacia arriba (abrir como un sobre real)
        envelopeFlapTop.style.transform = 'translateX(-50%) rotateX(-180deg)';
        
        // Ocultar el sello gradualmente
        stamp.style.opacity = '0';
        stamp.style.transform = 'rotate(3deg) translateY(-15px)';
        
        // Mover el sobre hacia abajo para dar espacio a la carta
        envelopeWrapper.classList.add('opened');
        
        // Mostrar la carta después de un pequeño retraso
        setTimeout(() => {
            letter.classList.add('visible');
            // Hacer scroll suave hasta la carta si es necesario
            setTimeout(() => {
                letter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }, 500);
        
        // Crear partículas
        setTimeout(() => {
            createParticles();
        }, 400);
        
        // Cambiar instrucción
        instruction.textContent = '✨ ¡Sobre abierto! Te esperamos ✨';
        instruction.style.animation = 'none';
    }
    
    // Función para cerrar el sobre
    function closeEnvelope() {
        if (!isOpen) return;
        isOpen = false;
        
        // Volver la solapa a su posición original
        envelopeFlapTop.style.transform = 'translateX(-50%) rotateX(0deg)';
        
        // Mostrar sello
        stamp.style.opacity = '1';
        stamp.style.transform = 'rotate(3deg) translateY(0)';
        
        // Ocultar carta
        letter.classList.remove('visible');
        
        // Restaurar posición del sobre
        envelopeWrapper.classList.remove('opened');
        
        // Restaurar instrucción
        instruction.textContent = '👆 Haz clic en la solapa del sobre para abrirlo';
        instruction.style.animation = 'pulse 2s infinite';
        
        // Hacer scroll de vuelta al sobre
        setTimeout(() => {
            envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
    
    // Event listener para la solapa frontal
    envelopeFlapTop.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!isOpen) {
            openEnvelope();
        } else {
            closeEnvelope();
        }
    });
    
    // También permitir clic en el cuerpo del sobre
    envelopeWrapper.addEventListener('click', function(e) {
        if (e.target === envelopeFlapTop) return;
        if (!isOpen) {
            openEnvelope();
        } else {
            closeEnvelope();
        }
    });
    
    // Botón de reset
    resetBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeEnvelope();
        // Pequeña animación adicional
        envelopeWrapper.style.transform = 'scale(0.95)';
        setTimeout(() => {
            envelopeWrapper.style.transform = '';
        }, 200);
    });
    
    // Prevenir que el clic en la carta cierre el sobre accidentalmente
    letter.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Inicializar: asegurarse de que está cerrado
    closeEnvelope();
})();