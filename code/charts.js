/* ==========================================================================
   BOURSE·DAILY — charts.js
   Hand-written SVG charts (no libraries). Each builder returns an SVG string
   whose classes hook into animations.css (draw-line, candle, vbar, seg...).
   ========================================================================== */
(function () {
  'use strict';
  var BD = (window.BD = window.BD || {});
  var INK = '#14181A', GAIN = '#0F7B4F', LOSS = '#C8372D', MUTE = '#6B6A60';

  // seeded random so the same symbol always draws the same chart
  BD.rng = function (seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  BD.seedOf = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };

  /* ---------- sparkline: a single <path> so it can draw itself ---------- */
  BD.spark = function (seed, up, w, h) {
    w = w || 80; h = h || 24; var r = BD.rng(seed), n = 24, v = 0, a = [], i;
    for (i = 0; i < n; i++) { v += (up ? 0.35 : -0.35) + (r() - .5) * 1.6; a.push(v); }
    var mn = Math.min.apply(0, a), mx = Math.max.apply(0, a), c = up ? GAIN : LOSS;
    var d = a.map(function (y, i) {
      return (i ? 'L' : 'M') + (i * (w - 2) / (n - 1) + 1).toFixed(1) + ',' + (h - 2 - (y - mn) / (mx - mn || 1) * (h - 4)).toFixed(1);
    }).join('');
    return '<svg class="spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + (up ? 'Rising' : 'Falling') + ' trend"><path d="' + d + '" stroke="' + c + '"/></svg>';
  };

  /* ---------- random walk used by the line + candle charts ---------- */
  BD.series = function (seed, n, start, end, vol) {
    var r = BD.rng(seed), a = [], v = 0, i;
    for (i = 0; i < n; i++) { v += (r() - .5) * vol; a.push(v); }
    var last = a[n - 1], drift = (end - start - last) / (n - 1);
    return a.map(function (x, i) { return start + x + drift * i; });
  };

  /* ---------- LINE CHART (area + line + end dot + callout) ----------
     returns { svg, pts } ; pts feed BD.crosshair                                  */
  BD.lineChart = function (o) {
    var W = o.w || 760, H = o.h || 318, pl = 18, pr = 74, pt = 22, pb = 34, a = o.data, n = a.length;
    var mn = Math.min.apply(0, a), mx = Math.max.apply(0, a), pad = (mx - mn) * .12; mn -= pad; mx += pad;
    var X = function (i) { return pl + i * (W - pl - pr) / (n - 1); };
    var Y = function (y) { return pt + (1 - (y - mn) / (mx - mn)) * (H - pt - pb); };
    var g = '', k;
    for (k = 0; k <= 4; k++) {
      var val = mn + (mx - mn) * k / 4, yy = Y(val);
      g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" stroke="#9b9886" stroke-dasharray="2 4"/>' +
        '<text x="' + (W - pr + 10) + '" y="' + (yy + 4) + '" font-size="11" fill="' + MUTE + '" font-family="IBM Plex Mono,DejaVu Sans Mono,monospace">' + BD.fmt(val, 0) + '</text>';
    }
    (o.xlabels || []).forEach(function (t, i, L) {
      var x = pl + i * (W - pl - pr) / (L.length - 1);
      g += '<text x="' + x + '" y="' + (H - 12) + '" font-size="11" fill="' + MUTE + '" text-anchor="' + (i == 0 ? 'start' : i == L.length - 1 ? 'end' : 'middle') + '" font-family="IBM Plex Mono,DejaVu Sans Mono,monospace">' + t + '</text>';
    });
    var pts = a.map(function (y, i) { return X(i).toFixed(1) + ',' + Y(y).toFixed(1); });
    var line = 'M' + pts.join(' L'), area = line + ' L' + X(n - 1) + ',' + Y(mn) + ' L' + X(0) + ',' + Y(mn) + 'Z';
    var lx = X(n - 1), ly = Y(a[n - 1]);
    g += '<path class="fade-after" style="--delay:900ms" d="' + area + '" fill="' + GAIN + '" fill-opacity=".10"/>';
    g += '<path class="draw-line main-line" d="' + line + '" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
    g += '<circle class="end-dot-pulse" cx="' + lx + '" cy="' + ly + '" r="6" fill="' + GAIN + '"/>';
    g += '<circle class="end-dot" cx="' + lx + '" cy="' + ly + '" r="5.5" fill="' + GAIN + '" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<g class="fade-after" style="--delay:1300ms"><rect x="' + (lx + 10) + '" y="' + (ly - 11) + '" width="62" height="22" fill="' + INK + '"/><text x="' + (lx + 41) + '" y="' + (ly + 4) + '" font-size="11.5" fill="#F2EFE6" text-anchor="middle" font-family="IBM Plex Mono,DejaVu Sans Mono,monospace" font-weight="700">' + BD.fmt(a[n - 1], 2) + '</text></g>';
    (o.callouts || []).forEach(function (c) {
      var cx = X(c.i), cy = Y(a[c.i]), dy = (cy > H * .5) ? -1 : 1;
      g += '<g class="fade-after" style="--delay:1500ms"><line x1="' + cx + '" y1="' + (cy + 4 * dy) + '" x2="' + (cx - 30) + '" y2="' + (cy + 40 * dy) + '" stroke="' + LOSS + '" stroke-width="1.4"/><circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + LOSS + '"/>' +
        '<text x="' + (cx - 118) + '" y="' + (cy + (dy > 0 ? 58 : -46)) + '" font-family="Lora,serif" font-style="italic" font-size="14" fill="' + LOSS + '" font-weight="700">' + c.text + '</text></g>';
    });
    var P = a.map(function (y, i) {
      return { x: X(i), y: Y(y), label: o.labelAt ? o.labelAt(i) : '#' + (i + 1), value: BD.fmt(y, 2), change: i ? (y - a[i - 1]) / a[i - 1] * 100 : 0 };
    });
    return { svg: '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="none">' + g + '</svg>', pts: P, W: W, H: H, X: X, Y: Y, line: line };
  };

  /* ---------- CANDLESTICKS + VOLUME ---------- */
  BD.candles = function (o) {
    var W = o.w || 820, H = o.h || 392, pl = 16, pr = 84, pt = 18, pb = 30, vh = 74, n = o.n || 56, r = BD.rng(o.seed || 42), p = o.start || 1010, c = [], i;
    for (i = 0; i < n; i++) {
      var op = p, ch = (r() - .44) * 26 + (i > n * .66 ? 3 : 1.6), cl = op + ch;
      var hi = Math.max(op, cl) + r() * 12, lo = Math.min(op, cl) - r() * 12; p = cl;
      c.push({ o: op, c: cl, h: hi, l: lo, v: .5 + r() * .9 + Math.abs(ch) / 30 });
    }
    var k = (o.end || 1248.6) - c[n - 1].c; c.forEach(function (d, i) { var s = k * i / (n - 1); d.o += s; d.c += s; d.h += s; d.l += s; });
    var mn = Math.min.apply(0, c.map(function (d) { return d.l; })) - 10, mx = Math.max.apply(0, c.map(function (d) { return d.h; })) + 10;
    var ch = H - pt - pb - vh - 10, X = function (i) { return pl + (i + .5) * (W - pl - pr) / n; };
    var Y = function (y) { return pt + (1 - (y - mn) / (mx - mn)) * ch; }, bw = (W - pl - pr) / n * .62, g = '';
    for (var y = Math.ceil(mn / 50) * 50; y < mx; y += 50)
      g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(y) + '" y2="' + Y(y) + '" stroke="#9b9886" stroke-dasharray="2 4"/><text x="' + (W - pr + 10) + '" y="' + (Y(y) + 4) + '" font-size="11" fill="' + MUTE + '" font-family="IBM Plex Mono,DejaVu Sans Mono,monospace">' + BD.fmt(y, 0) + '</text>';
    c.forEach(function (d, i) {
      var up = d.c >= d.o, col = up ? GAIN : LOSS, x = X(i), vv = d.v / 1.9 * vh;
      g += '<g class="candle" style="--i:' + i + '"><line x1="' + x + '" x2="' + x + '" y1="' + Y(d.h) + '" y2="' + Y(d.l) + '" stroke="' + col + '" stroke-width="1.6"/>' +
        '<rect x="' + (x - bw / 2) + '" y="' + Y(Math.max(d.o, d.c)) + '" width="' + bw + '" height="' + Math.max(2, Math.abs(Y(d.o) - Y(d.c))) + '" fill="' + col + '"/></g>';
      g += '<rect class="vbar" style="--i:' + i + '" x="' + (x - bw / 2) + '" y="' + (H - pb - vv) + '" width="' + bw + '" height="' + vv + '" fill="' + col + '" fill-opacity=".42"/>';
    });
    g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + (H - pb) + '" y2="' + (H - pb) + '" stroke="' + INK + '"/>';
    var ly = Y(c[n - 1].c);
    g += '<g class="fade-after" style="--delay:900ms"><line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + ly + '" y2="' + ly + '" stroke="' + INK + '" stroke-dasharray="5 3"/><rect x="' + (W - pr + 4) + '" y="' + (ly - 12) + '" width="74" height="24" fill="' + INK + '"/><text x="' + (W - pr + 41) + '" y="' + (ly + 4) + '" font-size="12" fill="#F2EFE6" text-anchor="middle" font-family="IBM Plex Mono,DejaVu Sans Mono,monospace" font-weight="700">' + BD.fmt(c[n - 1].c, 2) + '</text></g>';
    var pts = c.map(function (d, i) { return { x: X(i), y: Y(d.c), label: 'Candle ' + (i + 1), value: 'C ' + BD.fmt(d.c, 2) + '  V ' + d.v.toFixed(2) + 'L', change: (d.c - d.o) / d.o * 100 }; });
    return { svg: '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="none">' + g + '</svg>', pts: pts, H: H, pb: pb };
  };

  /* ---------- DONUT ---------- */
  BD.donutSvg = function (sectors) {
    var R = 68, cx = 84, cy = 84, C = 2 * Math.PI * R, off = 0, s = '<g transform="rotate(-90 84 84)">', total = sectors.length;
    sectors.forEach(function (x) {
      var len = C * x.pct / 100;
      s += '<circle class="seg" cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + x.color + '" stroke-width="30" data-len="' + len + '" data-c="' + C + '" data-off="' + (-off) + '" style="transform-origin:84px 84px"/>';
      off += len;
    });
    s += '</g><circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 15) + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 15) + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<text id="dn-num" x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-family="Lora,serif" font-weight="700" font-size="22" fill="' + INK + '">' + total + '</text>' +
      '<text id="dn-lbl" x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" font-family="Inter,sans-serif" font-size="9.5" letter-spacing="1.4" font-weight="600" fill="' + MUTE + '">SECTORS</text>';
    return s;
  };
  BD.donutLegend = function (sectors) {
    return sectors.map(function (x) {
      return '<div class="legend-row" data-name="' + x.name + '" data-val="' + x.pct + '%" style="display:flex;align-items:center;gap:9px;padding:5.5px 4px;border-bottom:1px dotted #9b9886"><i style="width:12px;height:12px;background:' + x.color + ';border:1.5px solid ' + INK + ';display:inline-block"></i><span style="flex:1;font-weight:500">' + x.name + '</span><b style="font-family:IBM Plex Mono,DejaVu Sans Mono,monospace;font-size:12.5px">' + x.pct + '%</b></div>';
    }).join('');
  };
})();
