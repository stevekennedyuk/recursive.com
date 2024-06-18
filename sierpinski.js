window.onload = function() {
  const sierpinskiCanvas = document.getElementById('sierpinskiCanvas');
  const ctx = sierpinskiCanvas.getContext('2d');
  const iterationsInput = document.getElementById('iterationsInput');
  const drawButton = document.getElementById('drawButton');

  let drawEventListener;

  attachDrawEventListener();

  function attachDrawEventListener() {
    // Remove any previously attached event listener
    if (drawEventListener) {
      drawButton.removeEventListener('click', drawEventListener);
    }

    // Attach a new event listener
    drawEventListener = drawSierpinskiTriangle.bind(null);
    drawButton.addEventListener('click', drawEventListener);
  }

  function drawSierpinskiTriangle() {
    const iterations = parseInt(iterationsInput.value);
    if (isNaN(iterations) || iterations < 0) {
      alert('Please enter a valid, non-negative number of iterations.');
      return;
    }

    ctx.clearRect(0, 0, sierpinskiCanvas.width, sierpinskiCanvas.height);
    drawTriangle(300, 50, 50, 550, 550, 550, iterations);
    attachDrawEventListener(); // Reattach the event listener after drawing
  }

  function drawTriangle(x1, y1, x2, y2, x3, y3, iterations) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();

    if (iterations > 0) {
      const x12 = (x1 + x2) / 2;
      const y12 = (y1 + y2) / 2;
      const x23 = (x2 + x3) / 2;
      const y23 = (y2 + y3) / 2;
      const x31 = (x3 + x1) / 2;
      const y31 = (y3 + y1) / 2;

      drawTriangle(x1, y1, x12, y12, x31, y31, iterations - 1);
      drawTriangle(x12, y12, x2, y2, x23, y23, iterations - 1);
      drawTriangle(x31, y31, x23, y23, x3, y3, iterations - 1);
    }
  }
};
