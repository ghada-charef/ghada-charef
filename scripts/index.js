 
    // ── PARTICLES ──────────────────────────────────────────────────────────────
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H, dots = [], mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randomDot() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5
      };
    }

    function initDots() {
      dots = [];
      const count = Math.floor((W * H) / 12000);
      for (let i = 0; i < count; i++) dots.push(randomDot());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,0.5)';
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dx = d.x - d2.x, dy = d.y - d2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - dist/120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        const mdx = mouse.x - d.x, mdy = mouse.y - d.y;
        const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
        if (mdist < 150) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(191,90,242,${0.3 * (1 - mdist/150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      requestAnimationFrame(drawParticles);
    }

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', () => { resize(); initDots(); });
    resize(); initDots(); drawParticles();

    // ── CODE ANIMATION ────────────────────────────────────────────────────────
    const lines = [
  '<span class="c-purple">const</span> <span class="c-cyan">developer</span> = {',
  '  name: <span class="c-green">"Ghada Charef"</span>,',
  '  role: <span class="c-green">"Senior PHP Symfony Developer"</span>,',
  '  experience: <span class="c-green">"10+ years"</span>,',
  '  stack: [<span class="c-green">"PHP"</span>, <span class="c-green">"Symfony"</span>, <span class="c-green">"REST APIs"</span>],',
  '  architecture: [<span class="c-green">"DDD"</span>, <span class="c-green">"CQRS"</span>, <span class="c-green">"Hexagonal"</span>],',
  '  focus: <span class="c-green">"scalable business applications"</span>,',
  '  <span class="c-cyan">build</span>() {',
  '    <span class="c-purple">return</span> <span class="c-green">"robust and maintainable systems 🚀"</span>',
  '  }',
  '};',
  '',
  '<span class="c-cyan">developer</span>.<span class="c-cyan">build</span>();',
  '<span class="c-purple">// → "robust and maintainable systems 🚀"</span>',
];
    const el = document.getElementById('codeAnim');
    let li = 0, ci = 0;
    const rawLines = lines.map(l => l.replace(/<[^>]+>/g, ''));

    function typeCode() {
      if (li >= lines.length) return;
      const raw = rawLines[li];
      if (ci <= raw.length) {
        let visible = lines.slice(0, li).map(l => '<span class="code-line">' + l + '</span>').join('');
        const partial = lines[li].replace(/<[^>]+>/g, '');
        let charCount = 0;
        let partialHtml = '';
        for (let i = 0; i < lines[li].length; i++) {
          if (lines[li][i] === '<') {
            let end = lines[li].indexOf('>', i);
            partialHtml += lines[li].slice(i, end + 1);
            i = end;
          } else {
            if (charCount < ci) { partialHtml += lines[li][i]; charCount++; }
            else break;
          }
        }
        visible += '<span class="code-line">' + partialHtml + '<span style="border-right:2px solid var(--accent);animation:scrollPulse 1s infinite">&nbsp;</span></span>';
        el.innerHTML = visible;
        ci++;
        setTimeout(typeCode, 35);
      } else {
        li++; ci = 0;
        setTimeout(typeCode, 180);
      }
    }
    setTimeout(typeCode, 1200);

    // ── SCROLL REVEAL ─────────────────────────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── PORTFOLIO FILTER ──────────────────────────────────────────────────────
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
          const cats = card.dataset.cat || '';
          card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
        });
      });
    });
