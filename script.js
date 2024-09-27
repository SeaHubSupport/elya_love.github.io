document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    document.getElementById('fireworks-btn').addEventListener('click', () => {
        startFireworks();
    });

    function startFireworks() {
        const interval = setInterval(createFirework, 500);
        setTimeout(() => {
            clearInterval(interval);
        }, 5000);
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height;

        const firework = {
            x: x,
            y: y,
            targetY: Math.random() * (canvas.height / 2),
            speed: Math.random() * 3 + 2,
            particles: [],
            exploded: false,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            shape: Math.random() < 0.2 ? 'heart' : 'circle' 
        };

        fireworks.push(firework);
    }

    function explodeFirework(firework) {
        const particleCount = 100; 
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;
            const color = firework.shape === 'heart' ? '#ff69b4' : `hsl(${Math.random() * 360}, 100%, 50%)`;

            firework.particles.push({
                x: firework.x,
                y: firework.y,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                alpha: 1,
                color: color,
                shape: firework.shape
            });
        }
    }

    function drawFireworks() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        fireworks.forEach((firework, index) => {
            if (!firework.exploded) {
                firework.y -= firework.speed;
                ctx.beginPath();
                ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2); 
                ctx.fillStyle = firework.color;
                ctx.fill();

                if (firework.y <= firework.targetY) {
                    firework.exploded = true;
                    explodeFirework(firework);
                }
            } else {
                firework.particles.forEach((particle, i) => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.alpha -= 0.015;

                    ctx.save();
                    ctx.globalAlpha = particle.alpha;

                    if (particle.shape === 'heart') {
                        drawHeart(ctx, particle.x, particle.y, 5, particle.color);
                    } else {
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = particle.color;
                        ctx.fill();
                    }

                    ctx.restore();

                    if (particle.alpha <= 0) {
                        firework.particles.splice(i, 1);
                    }
                });

                if (firework.particles.length === 0) {
                    fireworks.splice(index, 1);
                }
            }
        });

        requestAnimationFrame(drawFireworks);
    }

    function drawHeart(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
        ctx.fill();
    }

    drawFireworks();

    function launchConfetti() {
        var defaults = {
            origin: { y: 0.7 }
        };

        function fire() {
            confetti(Object.assign({}, defaults, {
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            }));
        }

        setInterval(fire, 250);
    }

    launchConfetti();

    document.getElementById('reveal-wish').addEventListener('click', () => {
        const wishes = [
            'Желаю тебе море радости и веселья!',
            'Пусть каждый миг сегодня будет волшебным!',
            'Заслуживаешь только самого лучшего!',
            'Наслаждайся этим днем в полной мере!',
            'Пусть все мечты сбываются!',
            'Улыбайся чаще и будь счастлив!',
            'Пусть счастье никогда не покидает тебя!',
            'Здоровья, любви и успехов во всем!'
        ];
        const randomIndex = Math.floor(Math.random() * wishes.length);
        document.getElementById('wish-message').textContent = wishes[randomIndex];
    });

    document.getElementById('show-photo-btn').addEventListener('click', () => {
        const photoContainer = document.getElementById('photo-container');
        const photos = [];
        for (let i = 1; i <= 10; i++) {
            photos.push(`beautiful-girl${i}.jpg`);
        }

        photoContainer.classList.remove('hidden');

        while (photoContainer.firstChild) {
            photoContainer.removeChild(photoContainer.firstChild);
        }

        const photosCopy = [...photos];

        const selectedPhotos = [];

        for (let i = 0; i < 2; i++) {
            const randomIndex = Math.floor(Math.random() * photosCopy.length);
            const imgSrc = `photos/${photosCopy[randomIndex]}`;

            selectedPhotos.push(imgSrc);

            photosCopy.splice(randomIndex, 1);
        }

        selectedPhotos.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;

            photoContainer.appendChild(img);

            img.onload = () => {
                img.classList.add('show');
            };

            img.onerror = () => {
                console.error('Ошибка загрузки изображения:', imgSrc);
                photoContainer.removeChild(img);
            };
        });

        setTimeout(() => {
            const imgs = photoContainer.querySelectorAll('img');
            imgs.forEach(img => {
                img.classList.remove('show');
                img.style.animation = 'fadeOut 0.5s forwards';

                img.addEventListener('animationend', () => {
                    if (img.parentNode) {
                        img.parentNode.removeChild(img);
                    }

                    if (photoContainer.children.length === 0) {
                        photoContainer.classList.add('hidden');
                    }
                });
            });
        }, 15000); 
    });

    document.getElementById('telegram-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const message = document.getElementById('telegram-message').value;

        const botToken = '7639575021:AAF30uTVCIj8wTshGcHQfoHRAxlkLHAG8G8';
        const chatId = '6031384080';

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const data = {
            chat_id: chatId,
            text: message
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                document.getElementById('telegram-response').textContent = 'Ваше пожелание отправлено!';
                document.getElementById('telegram-message').value = '';
            } else {
                document.getElementById('telegram-response').textContent = 'Ошибка отправки сообщения.';
                console.error('Ошибка Telegram API:', data);
            }
        })
        .catch(error => {
            document.getElementById('telegram-response').textContent = 'Ошибка отправки сообщения.';
            console.error('Ошибка сети:', error);
        });
    });
});
