const canvas = document.getElementById('fractal-canvas');
const ctx = canvas.getContext('2d');
const containerWidth = document.getElementById('fractal-container').offsetWidth;
canvas.width = containerWidth;
canvas.height = containerWidth / 1.6; // 16:10 aspect ratio

let zoom = 1;
let centerX = 0;
let centerY = 0;

let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panOffsetX = 0;
let panOffsetY = 0;

function drawMandelbrot() {
    const maxIterations = 100;
    const escapeRadius = 4;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    const xMin = centerX - 2 / zoom;
    const xMax = centerX + 2 / zoom;
    const yMin = centerY - 2 / zoom * (height / width);
    const yMax = centerY + 2 / zoom * (height / width);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const cx = xMin + (xMax - xMin) * x / width;
            const cy = yMin + (yMax - yMin) * y / height;

            let zx = 0;
            let zy = 0;
            let iterations = 0;

            while (iterations < maxIterations && zx * zx + zy * zy < escapeRadius * escapeRadius) {
                const xtemp = zx * zx - zy * zy + cx;
                zy = 2 * zx * zy + cy;
                zx = xtemp;
                iterations++;
            }

            const pixelIndex = (y * width + x) * 4;

            if (iterations === maxIterations) {
                imageData.data[pixelIndex] = 0;
                imageData.data[pixelIndex + 1] = 0;
                imageData.data[pixelIndex + 2] = 0;
                imageData.data[pixelIndex + 3] = 255;
            } else {
                const hue = iterations / maxIterations * 360;
                const saturation = 100;
                const lightness = 50;

                const rgb = hslToRgb(hue, saturation, lightness);

                imageData.data[pixelIndex] = rgb.r;
                imageData.data[pixelIndex + 1] = rgb.g;
                imageData.data[pixelIndex + 2] = rgb.b;
                imageData.data[pixelIndex + 3] = 255;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;

    let r, g, b;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

function zoomIn(event) {
    const zoomFactor = 0.5;
    const prevZoom = zoom;
    zoom *= zoomFactor;
    const zoomX = (event.offsetX / canvas.width - 0.5) * (1 - 1 / zoomFactor);
    const zoomY = (event.offsetY / canvas.height - 0.5) * (1 - 1 / zoomFactor);
    centerX += zoomX / prevZoom;
    centerY += zoomY / prevZoom;
    drawMandelbrot();
}

function zoomOut(event) {
    const zoomFactor = 0.5;
    const prevZoom = zoom;
    zoom /= zoomFactor;
    const zoomX = (event.offsetX / canvas.width - 0.5) * (1 - zoomFactor);
    const zoomY = (event.offsetY / canvas.height - 0.5) * (1 - zoomFactor);
    centerX -= zoomX / prevZoom;
    centerY -= zoomY / prevZoom;
    drawMandelbrot();
}

function startPan(event) {
    isPanning = true;
    panStartX = event.offsetX;
    panStartY = event.offsetY;
}

function pan(event) {
    if (isPanning) {
        panOffsetX = (event.offsetX - panStartX) / (canvas.width * zoom);
        panOffsetY = (event.offsetY - panStartY) / (canvas.height * zoom);
        centerX += panOffsetX;
        centerY += panOffsetY;
        drawMandelbrot();
    }
}

function endPan() {
    isPanning = false;
    panOffsetX = 0;
    panOffsetY = 0;
}

canvas.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.shiftKey) {
        zoomOut(event);
    } else {
        zoomIn(event);
    }
});

canvas.addEventListener('mousedown', startPan);
canvas.addEventListener('mousemove', pan);
canvas.addEventListener('mouseup', endPan);
canvas.addEventListener('mouseleave', endPan);
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
        zoomOut(event);
    } else {
        zoomIn(event);
    }
});

drawMandelbrot();
