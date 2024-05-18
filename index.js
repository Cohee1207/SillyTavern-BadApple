createButton();

function createButton() {
    const menu = document.getElementById('extensionsMenu');
    const extensionButton = document.createElement('div');
    extensionButton.classList.add('list-group-item', 'flex-container', 'flexGap5');
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-apple-whole');
    const text = document.createElement('span');
    text.innerText = 'Bad Apple';
    extensionButton.appendChild(icon);
    extensionButton.appendChild(text);
    extensionButton.onclick = handleClick;

    async function handleClick() {
        playBadApple();
    }

    if (!menu) {
        console.warn('createButton: menu not found');
        return extensionButton;
    }

    menu.appendChild(extensionButton);
    return extensionButton;
}

function playBadApple() {
    const existingElement = document.getElementById('badAppleVideo');
    if (existingElement instanceof HTMLVideoElement) {
        return existingElement.pause();
    }

    const { getThumbnailUrl, characters } = SillyTavern.getContext();
    if (!characters?.length) {
        toastr.error('No characters found');
        return;
    }

    const videoUrl = '/scripts/extensions/third-party/SillyTavern-BadApple/bad_apple.mp4';
    const video = document.createElement('video');
    video.src = videoUrl;
    video.id = 'badAppleVideo';
    video.autoplay = true;
    video.muted = false;
    video.controls = false;
    video.playsInline = true;
    video.width = window.innerWidth;
    video.height = window.innerHeight;
    document.body.classList.add('badApple');

    const cover = document.createElement('div');
    cover.classList.add('badAppleCover');
    document.body.appendChild(cover);

    const canvas = new OffscreenCanvas(window.innerWidth, window.innerHeight);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = video.width;
    canvas.height = video.height;

    const imageRows = [];
    const divisor = 50;
    const pixelSize = Math.ceil(Math.max(window.innerWidth, window.innerHeight) / divisor);
    const rows = Math.ceil(window.innerHeight / pixelSize);
    const cols = Math.ceil(window.innerWidth / pixelSize);
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    const shuffledCharacters = shuffle(characters.slice());
    for (let row = 0; row < rows; row++) {
        const rowArray = [];
        for (let col = 0; col < cols; col++) {
            const character = shuffledCharacters.pop();
            const image = new Image(pixelSize, pixelSize);
            image.style.top = `${row * pixelSize}px`;
            image.style.left = `${col * pixelSize}px`;
            image.classList.add('badAppleThumbnail');
            document.body.appendChild(image);
            image.src = getThumbnailUrl('avatar', character.avatar);
            rowArray.push(image);

            // Shuffle again if we've used all characters
            if (shuffledCharacters.length === 0) {
                shuffledCharacters.push(...shuffle(characters.slice()));
            }
        }
        imageRows.push(rowArray);
    }

    const update = () => {
        ctx.drawImage(video, 0, 0, video.width, video.height);
        const imageData = ctx.getImageData(0, 0, video.width, video.height);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Get average color in region
                let r = 0;
                let g = 0;
                let b = 0;

                const startRow = row * pixelSize;
                const startCol = col * pixelSize;
                const endRow = Math.min(startRow + pixelSize, video.height);
                const endCol = Math.min(startCol + pixelSize, video.width);
                const numPixels = (endRow - startRow) * (endCol - startCol);
                for (let y = startRow; y < endRow; y++) {
                    for (let x = startCol; x < endCol; x++) {
                        const index = (y * video.width + x) * 4;
                        r += imageData.data[index];
                        g += imageData.data[index + 1];
                        b += imageData.data[index + 2];
                    }
                }

                // Convert to grayscale
                const avg = Math.floor((r + g + b) / (3 * numPixels));

                // Set opacity based on grayscale value
                const opacity = avg / 255;
                imageRows[row][col].style.opacity = `${opacity}`;
            }
        }

        if (!video.ended && !video.paused) {
            requestAnimationFrame(update);
        }
    };

    const resizeHandler = () => {
        video.width = window.innerWidth;
        video.height = window.innerHeight;
        canvas.width = video.width;
        canvas.height = video.height;
    };
    const keyDownHandler = (event) => {
        if (event.key === 'Escape') {
            video.pause();
        }
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('touchstart', keyDownHandler);

    const onEnded = () => {
        document.body.removeChild(cover);
        document.body.removeChild(video);
        document.querySelectorAll('.badAppleThumbnail').forEach((element) => {
            document.body.removeChild(element);
        });
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('keydown', keyDownHandler);
        window.removeEventListener('touchstart', keyDownHandler);
        document.body.classList.remove('badApple');
    };
    video.addEventListener('pause', onEnded);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', () => requestAnimationFrame(update));
    document.body.appendChild(video);
}
