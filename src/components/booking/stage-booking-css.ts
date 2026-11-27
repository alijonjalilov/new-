/**
 * Анкета бронирования в стиле «Сцены»: те же блоки, но чёрный фон, белые кнопки
 * и микрофон справа. Цвета сайта переопределяются только внутри .bw-stage.
 */
export const STAGE_BOOKING_CSS = `
html:has(.bw-stage),html:has(.bw-stage) body{background:#000}
.bw-stage{
 --color-paper:#000;--color-paper-2:#0e0e0e;--color-ink:#f5f5f5;--color-muted:#9a9a9a;--color-line:rgba(255,255,255,.18);
 --color-velvet:#fff;--color-velvet-2:#e6e6e6;--color-brass:#000;--color-brass-deep:#cfcfcf;
 --font-display:var(--font-unbounded),var(--font-manrope),sans-serif;
 position:relative;background:#000;color:var(--color-ink);font-family:var(--font-manrope),system-ui,sans-serif;color-scheme:dark}
.bw-stage[data-locale="tg"]{--font-display:var(--font-display-face),var(--font-golos),sans-serif;font-family:var(--font-golos),system-ui,sans-serif}
.bw-stage header{background:rgba(0,0,0,.8)!important;border-color:transparent!important}
.bw-stage .bw-logo{font-weight:800;letter-spacing:.04em;font-size:18px}
.bw-stage #question-title,.bw-stage h1{font-weight:700!important;letter-spacing:-.01em}
.bw-stage .bg-white{background:rgba(255,255,255,.03)!important}
.bw-stage .field{background:rgba(255,255,255,.04);color:var(--color-ink);border-color:rgba(255,255,255,.22)}
.bw-stage .field::placeholder{color:#6f6f6f}
.bw-stage .field:focus{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.15)}
.bw-stage input[type="date"],.bw-stage input[type="time"]{color-scheme:dark}
.bw-stage .btn-primary{background:#fff;color:#000}
.bw-stage .btn-primary:hover{background:#e6e6e6}
.bw-stage .btn-outline{border-color:rgba(255,255,255,.3)}
.bw-stage .opt{border-color:rgba(255,255,255,.18)}
.bw-stage a:focus-visible,.bw-stage button:focus-visible,.bw-stage input:focus-visible{outline:3px solid #fff;outline-offset:3px}
.bw-stage .sticky.bottom-0{background:rgba(0,0,0,.92)!important;border-color:rgba(255,255,255,.12)!important}
.bw-halo{position:fixed;right:-8vw;top:50%;width:70vh;height:70vh;transform:translateY(-50%);background:radial-gradient(closest-side,rgba(255,255,255,.08),transparent);pointer-events:none;z-index:0}
.bw-mic{position:fixed;right:6vw;top:54%;height:72vh;transform:translateY(-50%) rotate(-16deg);pointer-events:none;z-index:0;filter:drop-shadow(0 0 1px rgba(255,255,255,.3))}
.bw-stage header,.bw-stage .bw-main{position:relative;z-index:1}
@media(min-width:1100px){
 .bw-stage .bw-main{margin-left:max(5vw,calc((100vw - 1320px)/2));margin-right:auto;max-width:760px}
 .bw-stage .bw-bar{max-width:none;margin:0;padding-left:4vw;padding-right:4vw}
}
@media(max-width:1099px){.bw-mic{height:46vh;right:-10vw;top:auto;bottom:-8vh;transform:rotate(-16deg);opacity:.25}.bw-halo{display:none}}
@media(max-width:640px){.bw-mic{display:none}}
`;
