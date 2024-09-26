document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    let currentSectionIndex = 0;

    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];

    // Обновляем размеры канваса при изменении размера окна
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Настройка Intersection Observer для отслеживания появления секций
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Секция считается видимой, когда 50% ее видно
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

    // Обработчик кнопки "Фейерверк для тебя"
    document.getElementById('fireworks-btn').addEventListener('click', () => {
        startFireworks();
    });

    // Функция запуска фейерверков
    function startFireworks() {
        // Запуск фейерверков в течение 5 секунд
        const interval = setInterval(createFirework, 500); // Интервал запуска фейерверков
        setTimeout(() => {
            clearInterval(interval);
        }, 5000);
    }

    // Создаем фейерверк в случайной позиции
    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Добавляем фейерверк с таймером взрыва через 5 секунд
        const firework = {
            x: x,
            y: y,
            size: Math.random() * 7 + 5, // Увеличен размер фейерверка
            speedX: (Math.random() - 0.5) * 1, // Уменьшена скорость движения до 1
            speedY: (Math.random() - 0.5) * 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            opacity: 1,
            particles: [],
            explodeTime: Date.now() + 5000, // Взрыв через 5 секунд
            exploded: false
        };

        fireworks.push(firework);
    }

    // Функция взрыва фейерверка
    function explodeFirework(firework) {
        const particleCount = 80; // Увеличено количество частиц
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 2 + 1; // Уменьшена скорость частиц
            firework.particles.push({
                x: firework.x,
                y: firework.y,
                size: Math.random() * 4 + 2, // Увеличен размер частиц
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                opacity: 1
            });
        }
    }

    // Отрисовываем и анимируем фейерверки
    function drawFireworks() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Уменьшена непрозрачность для медленного затухания
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        const currentTime = Date.now();

        fireworks.forEach((firework, index) => {
            if (!firework.exploded && currentTime >= firework.explodeTime) {
                explodeFirework(firework);
                firework.exploded = true;
            }

            if (!firework.exploded) {
                // Рисуем основной фейерверк
                ctx.beginPath();
                ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${Math.floor(Math.random() * 360)}, 100%, 50%, ${firework.opacity})`;
                ctx.fill();

                // Обновляем позицию основного фейерверка
                firework.x += firework.speedX;
                firework.y += firework.speedY;

                // Уменьшаем прозрачность
                firework.opacity -= 0.001; // Уменьшена скорость уменьшения прозрачности
            }

            // Обрабатываем частицы после взрыва
            firework.particles.forEach((particle, i) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${Math.floor(Math.random() * 360)}, 100%, 50%, ${particle.opacity})`;
                ctx.fill();

                // Обновляем позицию частиц
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                // Уменьшаем прозрачность и размер
                particle.opacity -= 0.005; // Уменьшена скорость уменьшения прозрачности
                particle.size *= 0.99; // Уменьшена скорость уменьшения размера

                // Удаляем частицу, если она полностью прозрачна или слишком мала
                if (particle.opacity <= 0 || particle.size <= 0.1) {
                    firework.particles.splice(i, 1);
                }
            });

            // Удаляем фейерверк, если он полностью исчез
            if (firework.exploded && firework.particles.length === 0) {
                fireworks.splice(index, 1);
            }
        });

        requestAnimationFrame(drawFireworks);
    }

    // Запуск анимации фейерверков
    drawFireworks();

    // Показать случайное пожелание
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

    // Обработчик кнопки "Показать фотографию"
    document.getElementById('show-photo-btn').addEventListener('click', () => {
        const photoContainer = document.getElementById('photo-container');
        const photo = document.getElementById('beautiful-girl-photo');

        // Массив названий файлов фотографий (обязательно обновите его в соответствии с содержимым папки photos)
        const photos = [
            'beautiful-girl1.jpg',
            'beautiful-girl2.jpg',
            'beautiful-girl3.jpg',
            'beautiful-girl4.jpg',
            'beautiful-girl5.jpg'
            // Добавьте сюда другие фотографии по вашему выбору
        ];

        // Выбор случайной фотографии
        const randomIndex = Math.floor(Math.random() * photos.length);
        photo.src = `photos/${photos[randomIndex]}`;

        // Показать контейнер с фотографией
        photoContainer.classList.remove('hidden');
        photoContainer.classList.add('show');

        // Добавляем градиентный фон и анимацию появления
        photoContainer.style.opacity = 1;
        photoContainer.style.transform = 'scale(1)';

        // Убираем фото через 15 секунд
        setTimeout(() => {
            photoContainer.classList.remove('show');
            photoContainer.classList.add('hidden');
            photoContainer.style.opacity = 0;
            photoContainer.style.transform = 'scale(1.2)';
        }, 15000); // 15000 миллисекунд = 15 секунд
    });

    // Обработчик кнопки "Нажми" в секции "Люблю тебя"
    document.getElementById('show-text-btn').addEventListener('click', () => {
        const loveTextContainer = document.getElementById('love-text');
        const uploadLabel = document.getElementById('upload-label');
        const fileInput = document.getElementById('text-file-input');

        // Показать кнопку загрузки файла
        uploadLabel.classList.remove('hidden');

        // Если уже загружен текст из файла, не загружать text.txt
        if (loveTextContainer.dataset.loaded !== 'file') {
            // Загружаем текст из text.txt с помощью Fetch API
            fetch('text.txt')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке файла');
                    }
                    return response.text();
                })
                .then(data => {
                    // Отображаем загруженный текст
                    loveTextContainer.textContent = data; // Используем textContent для сохранения форматирования
                    loveTextContainer.classList.remove('hidden');
                    loveTextContainer.classList.add('love-text');
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    loveTextContainer.textContent = 'Не удалось загрузить текст.';
                    loveTextContainer.classList.remove('hidden');
                    loveTextContainer.classList.add('love-text');
                });
        }
    });

    // Обработчик загрузки файла
    document.getElementById('text-file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        const loveTextContainer = document.getElementById('love-text');

        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                loveTextContainer.textContent = content;
                loveTextContainer.classList.remove('hidden');
                loveTextContainer.classList.add('love-text');
                loveTextContainer.dataset.loaded = 'file'; // Помечаем, что текст загружен из файла
            };
            reader.onerror = function() {
                console.error('Ошибка при чтении файла');
                loveTextContainer.textContent = 'Не удалось загрузить текст из файла.';
                loveTextContainer.classList.remove('hidden');
                loveTextContainer.classList.add('love-text');
            };
            reader.readAsText(file);
        } else {
            loveTextContainer.textContent = 'Пожалуйста, выберите текстовый файл (.txt).';
            loveTextContainer.classList.remove('hidden');
            loveTextContainer.classList.add('love-text');
        }
    });
});
