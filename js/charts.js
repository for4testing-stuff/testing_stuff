/* ==========================================================================
   BOURSE·DAILY — js/charts.js
   Pure Vanilla Canvas / SVG Chart generator
   ========================================================================== */

(function() {
  function drawSparkline(canvas, data, isUp) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    if (!data || data.length < 2) return;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    ctx.beginPath();
    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * (width - 4) + 2;
      const y = height - 2 - ((val - min) / range) * (height - 6);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = isUp ? '#0F7B4F' : '#C8372D';
    ctx.lineWidth = 1.75;
    ctx.stroke();
  }

  function drawMainChart(canvas, data, isUp, timeFrame = '1M') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    if (!data || data.length < 2) return;

    const padTop = 20;
    const padBottom = 30;
    const padLeft = 10;
    const padRight = 50;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(155, 152, 134, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      // Price label on right
      const val = max - (range / 4) * i;
      ctx.fillStyle = '#6B6A60';
      ctx.font = '10px IBM Plex Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(val.toFixed(2), width - padRight + 8, y + 3);
    }
    ctx.setLineDash([]);

    // Gradient fill under curve
    const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    const colorHex = isUp ? '15, 123, 79' : '200, 55, 45';
    gradient.addColorStop(0, `rgba(${colorHex}, 0.22)`);
    gradient.addColorStop(1, `rgba(${colorHex}, 0.00)`);

    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padLeft + (i / (data.length - 1)) * chartW;
      const y = padTop + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    // Close path for fill
    ctx.lineTo(padLeft + chartW, padTop + chartH);
    ctx.lineTo(padLeft, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padLeft + (i / (data.length - 1)) * chartW;
      const y = padTop + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = isUp ? '#0F7B4F' : '#C8372D';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Latest price point marker
    const lastX = padLeft + chartW;
    const lastVal = data[data.length - 1];
    const lastY = padTop + chartH - ((lastVal - min) / range) * chartH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = isUp ? '#0F7B4F' : '#C8372D';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#F2EFE6';
    ctx.stroke();
  }

  window.BourseCharts = {
    drawSparkline,
    drawMainChart
  };
})();
