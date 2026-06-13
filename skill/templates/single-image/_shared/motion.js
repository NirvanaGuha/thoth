/*
 * Thoth motion library — reusable, seek-deterministic reveal primitives.
 *
 * render.js injects this into the page (after gsap) before calling a template's
 * window.__thothAnim.build(gsap). Each primitive takes (gsap, tl, selector, at, opts)
 * and appends tweens to the timeline `tl` at absolute time `at` (seconds), returning tl.
 *
 * Determinism rules (so frame-by-frame seek capture is exact):
 *   - Set the START state explicitly (gsap.set) then tween TO the resting state.
 *     The element's CSS resting state is the FINAL/visible state, so static PNG
 *     renders (which never call build()) look correct with no JS.
 *   - Number / text values are driven by onUpdate. render.js seeks with
 *     suppressEvents=false so these callbacks fire while scrubbing.
 *
 * Primitives:
 *   fadeUp      fade + rise (the universal reveal); supports stagger
 *   countUp     number rolls 0 -> target, preserving prefix/suffix/decimals/commas
 *   rowReveal   list items / table rows slide in from the side, staggered
 *   layerReveal concentric / stacked layers pop in one at a time (inner-out)
 *   barGrow     bars grow from their baseline (chart fill), staggered
 *   colorWave   cells sweep from muted grey to their own colour (grid fill)
 *   drawOn      SVG paths/connectors draw themselves (stroke-dashoffset)
 */
(function () {
  function toEls(sel) {
    if (typeof sel === 'string') return Array.prototype.slice.call(document.querySelectorAll(sel));
    if (sel && sel.length != null) return Array.prototype.slice.call(sel);
    return sel ? [sel] : [];
  }

  // "73%" -> {prefix:"",value:73,suffix:"%",decimals:0,comma:false}
  // "$1,300" -> {prefix:"$",value:1300,suffix:"",decimals:0,comma:true}
  // "15.2B" -> {prefix:"",value:15.2,suffix:"B",decimals:1,comma:false}
  function parseNumber(s) {
    var m = String(s).trim().match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
    if (!m) return { ok: false };
    var num = m[2], clean = num.replace(/,/g, '');
    return {
      ok: true,
      prefix: m[1] || '',
      suffix: m[3] || '',
      value: parseFloat(clean),
      decimals: clean.indexOf('.') >= 0 ? clean.split('.')[1].length : 0,
      comma: num.indexOf(',') >= 0
    };
  }
  function fmtNumber(v, p) {
    var n = p.decimals > 0 ? v.toFixed(p.decimals) : String(Math.round(v));
    if (p.comma) {
      var parts = n.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      n = parts.join('.');
    }
    return p.prefix + n + p.suffix;
  }

  var M = {
    parseNumber: parseNumber,
    fmtNumber: fmtNumber,

    fadeUp: function (gsap, tl, sel, at, o) {
      o = o || {};
      gsap.set(sel, { autoAlpha: 0, y: o.y != null ? o.y : 28 });
      tl.to(sel, {
        autoAlpha: 1, y: 0,
        duration: o.duration || 0.6, ease: o.ease || 'power3.out',
        stagger: o.stagger || 0
      }, at);
      return tl;
    },

    countUp: function (gsap, tl, sel, at, o) {
      o = o || {};
      var el = document.querySelector(sel);
      if (!el) return tl;
      var p = parseNumber(o.value != null ? String(o.value) : el.textContent);
      if (!p.ok) return M.fadeUp(gsap, tl, sel, at, o);   // non-numeric -> plain reveal
      el.textContent = fmtNumber(0, p);
      if (o.reveal !== false) {
        gsap.set(sel, {
          autoAlpha: 0,
          y: o.y != null ? o.y : 36,
          scale: o.scale != null ? o.scale : 0.92,
          transformOrigin: o.origin || 'left center'
        });
        tl.to(sel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }, at);
      }
      var proxy = { v: 0 };
      tl.to(proxy, {
        v: p.value, duration: o.duration || 1.9, ease: o.ease || 'power2.out',
        onUpdate: function () { el.textContent = fmtNumber(proxy.v, p); }
      }, at);
      return tl;
    },

    rowReveal: function (gsap, tl, sel, at, o) {
      o = o || {};
      gsap.set(sel, { autoAlpha: 0, x: o.x != null ? o.x : -28 });
      tl.to(sel, {
        autoAlpha: 1, x: 0,
        duration: o.duration || 0.45, ease: o.ease || 'power3.out',
        stagger: o.stagger != null ? o.stagger : 0.12
      }, at);
      return tl;
    },

    layerReveal: function (gsap, tl, sel, at, o) {
      o = o || {};
      var els = toEls(sel);
      gsap.set(els, {
        autoAlpha: 0,
        scale: o.scaleFrom != null ? o.scaleFrom : 0.6,
        transformOrigin: o.origin || '50% 50%'
      });
      tl.to(els, {
        autoAlpha: 1, scale: 1,
        duration: o.duration || 0.5, ease: o.ease || 'back.out(1.4)',
        stagger: o.stagger != null ? o.stagger : 0.14
      }, at);
      return tl;
    },

    barGrow: function (gsap, tl, sel, at, o) {
      o = o || {};
      gsap.set(sel, { scaleY: 0, transformOrigin: o.origin || '50% 100%' });
      tl.to(sel, {
        scaleY: 1,
        duration: o.duration || 0.7, ease: o.ease || 'power2.out',
        stagger: o.stagger != null ? o.stagger : 0.1
      }, at);
      return tl;
    },

    // Animate each element FROM a muted grey to its own CSS background colour.
    colorWave: function (gsap, tl, sel, at, o) {
      o = o || {};
      tl.from(sel, {
        backgroundColor: o.grey || '#E9E9EE',
        opacity: o.from != null ? o.from : 0.5,
        duration: o.duration || 0.5, ease: o.ease || 'power2.out',
        stagger: o.stagger != null ? o.stagger : 0.07
      }, at);
      return tl;
    },

    drawOn: function (gsap, tl, sel, at, o) {
      o = o || {};
      var els = toEls(sel);
      els.forEach(function (el) {
        var len = el.getTotalLength ? el.getTotalLength() : 100;
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
      });
      tl.to(els, {
        strokeDashoffset: 0,
        duration: o.duration || 0.8, ease: o.ease || 'power1.inOut',
        stagger: o.stagger != null ? o.stagger : 0.1
      }, at);
      return tl;
    }
  };

  window.__thothMotion = M;
})();
