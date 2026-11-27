/**
 * Стили дизайна «Сцена» — из прототипа, ограничены блоком .stage-root,
 * чтобы не задевать остальной сайт.
 */
export const STAGE_CSS = `
html.stage-lock,html.stage-lock body{height:100%;overflow:hidden;overscroll-behavior:none;background:#000}
html.stage-lock body{touch-action:none;scrollbar-width:none}
.stage-root{--bg:#000;--ink:#f5f5f5;--mute:#9a9a9a;--silver:#cfcfcf;--line:rgba(255,255,255,.2);
 --f-head:var(--font-unbounded),var(--font-manrope),sans-serif;--f-body:var(--font-manrope),system-ui,sans-serif;
 color-scheme:dark;background:var(--bg);color:var(--ink);font:16px/1.55 var(--f-body)}
.stage-root[data-locale="tg"]{--f-head:var(--font-display-face),var(--font-golos),sans-serif;--f-body:var(--font-golos),system-ui,sans-serif}
.stage-root *{box-sizing:border-box;min-width:0}
.stage-root h1,.stage-root h2,.stage-root h3,.stage-root .big{font-family:var(--f-head);line-height:1.05;text-wrap:balance;margin:0;letter-spacing:0}
.stage-root p{margin:0}
.stage-root ol{list-style:none;margin:0;padding:0}
.stage{position:fixed;inset:0;overflow:hidden;background:var(--bg)}
.stage .halo{position:absolute;left:50%;top:46%;width:min(80vh,90vw);aspect-ratio:1;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(255,255,255,.07),rgba(255,255,255,.02) 55%,transparent);pointer-events:none}
.stage .micbox{position:absolute;left:50%;top:50%;height:80vh;aspect-ratio:240/860;z-index:3}
.stage .asm{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 0 1px rgba(255,255,255,.28)) drop-shadow(0 0 24px rgba(255,255,255,.05))}
.stage .exp{position:absolute;left:50%;top:50%;height:115.8%;aspect-ratio:215/970;transform:translate(-50%,-50%)}
.stage .part{position:absolute;inset:0;will-change:transform,opacity;opacity:0}
.stage .part img{width:100%;height:100%;display:block;filter:drop-shadow(0 0 1px rgba(255,255,255,.25))}
.stage .mk{position:absolute;width:1px;height:1px}
.stage .venues{position:absolute;inset:0;opacity:0;transition:opacity .4s}
.stage .venue{position:absolute;inset:0;opacity:0;transition:opacity .9s}
.stage .venue.on{opacity:1}
.stage .venue svg{position:absolute;inset:0;width:100%;height:100%}
.stage .venue img{object-fit:cover}
.stage .venue::after{content:"";position:absolute;inset:0;background:
 linear-gradient(rgba(0,0,0,.6),transparent 22%),
 linear-gradient(var(--dir,90deg),rgba(0,0,0,.62),transparent 55%),
 linear-gradient(rgba(0,0,0,.18),rgba(0,0,0,.18)),
 radial-gradient(ellipse 60% 80% at var(--mx,50%) 55%,transparent,rgba(0,0,0,.55)),
 linear-gradient(transparent 55%,rgba(0,0,0,.7))}
.stage .ly{position:absolute;z-index:6;opacity:0;pointer-events:none;will-change:transform,opacity}
.stage .ly.live{pointer-events:auto}
.stage .L{left:max(5vw,16px);top:50%;width:min(440px,31vw)}
.stage .R{right:max(5vw,16px);top:50%;width:min(380px,28vw)}
.stage .T{left:50%;bottom:8vh;width:min(640px,90vw);text-align:center;z-index:7;text-shadow:0 2px 18px #000}
.stage .T p{color:var(--mute);margin:10px 0 0}
.stage .F{top:50%;width:min(420px,34vw);transition:left .8s cubic-bezier(.6,0,.2,1);padding:26px;border-radius:22px;background:rgba(0,0,0,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--line)}
.stage .F p{color:var(--mute);margin:14px 0 0;font-size:17px}
.stage .kicker{display:block;color:var(--silver);font-weight:600;margin-bottom:14px}
.stage h1{font-size:clamp(34px,5vw,72px);font-weight:800}
.stage h2{font-size:clamp(28px,3.6vw,50px);font-weight:700}
.stage h2.final{font-size:clamp(34px,4.8vw,68px);font-weight:800}
.stage .R p,.stage .L p{color:var(--mute);margin:14px 0 20px;font-size:17px}
.stage .row{display:flex;gap:10px;flex-wrap:wrap}
.stage-root .sbtn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:999px;background:#fff;color:#000;font:700 15px var(--f-body);text-decoration:none;border:0;cursor:pointer;white-space:nowrap}
.stage-root .sbtn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.stage-root .sbtn:hover{opacity:.88}
.stage-root a:focus-visible,.stage-root button:focus-visible{outline:3px solid #fff;outline-offset:3px}
.stage .lab{position:absolute;z-index:7;width:min(250px,26vw);height:0;padding-left:70px;opacity:0;transform:translateX(16px);transition:opacity .35s,transform .35s;pointer-events:none}
.stage .lab.on{opacity:1;transform:none}
.stage .lab::before{content:"";position:absolute;left:0;top:0;width:58px;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.15),#fff)}
.stage .lab::after{content:"";position:absolute;left:-3px;top:-3px;width:7px;height:7px;border-radius:50%;background:#fff}
.stage .lab-t{transform:translateY(calc(-50% + var(--shift,0px)))}
.stage .lab small{display:block;color:var(--mute);font-size:12px}
.stage .lab b{display:block;font:700 clamp(15px,1.5vw,20px) var(--f-head);margin:2px 0}
.stage .lab span{display:block;color:var(--mute);font-size:14px;line-height:1.4}
.stage .stat{padding:12px 0;border-bottom:1px solid var(--line)}
.stage .stat:last-child{border:0}
.stage .stat .big{font-size:clamp(34px,4.2vw,58px);font-weight:800;font-variant-numeric:tabular-nums}
.stage .stat small{color:var(--mute);font-size:15px}
.stage .count{font:700 18px var(--f-head);color:var(--silver)}
.stage .orb{position:absolute;left:50%;top:50%;width:66px;height:66px;margin:-33px 0 0 -33px;opacity:0;pointer-events:none;will-change:transform,opacity}
.stage .orb.live{pointer-events:auto;cursor:default}
.stage .orb-c{position:absolute;inset:0;border-radius:50%;background:#fff;display:grid;place-items:center;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.25),0 8px 22px rgba(0,0,0,.6)}
.stage .orb-c img{object-fit:contain;display:block}
.stage .orb.hot .orb-c{box-shadow:0 0 0 2px #fff,0 10px 30px rgba(0,0,0,.7)}
.stage .orb-n{position:absolute;left:50%;top:calc(100% + 6px);transform:translateX(-50%) scale(.69);transform-origin:top center;white-space:nowrap;padding:4px 10px;border-radius:999px;background:rgba(0,0,0,.85);border:1px solid var(--line);font:600 13px var(--f-body);color:var(--ink);opacity:0;transition:opacity .2s;pointer-events:none}
.stage .orb.hot .orb-n{opacity:1}
.stage .stat .big.inf{transform-origin:left center;opacity:0}
.stage .nums{position:relative;height:min(46vh,380px)}
.stage .nums .big{position:absolute;inset:0;display:grid;place-items:center start;font-size:clamp(130px,19vw,290px);font-weight:800;color:transparent;-webkit-text-stroke:1.5px #fff;opacity:0;transform:translateY(30px);transition:.5s}
.stage .nums .big.on{opacity:1;transform:none}
.stage .st{padding:12px 0 12px 22px;border-left:2px solid var(--line);opacity:.32;transition:.4s}
.stage .st.on{opacity:1;border-color:#fff}
.stage .st h3{font-size:clamp(18px,2vw,26px);font-weight:700}
.stage .st p{margin:4px 0 0;font-size:15px;color:var(--mute)}
.stage-root .snav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px max(4vw,14px)}
.stage-root .logo{display:inline-flex;align-items:center;min-height:44px;font:800 18px var(--font-unbounded),var(--f-head);letter-spacing:.04em;color:var(--ink);text-decoration:none}
.stage .T .thanks{color:var(--ink);font-weight:600;margin-top:6px}
.stage .halo{will-change:filter}
.stage-root .snav-r{display:flex;align-items:center;gap:14px}
.stage-root .lang{position:relative}
.stage-root .globe{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:rgba(0,0,0,.5);color:var(--ink);cursor:pointer;text-decoration:none}
.stage-root .globe:hover{border-color:rgba(255,255,255,.5)}
.stage-root .globe[aria-expanded="true"]{background:#fff;color:#000}
.stage-root .lang-list{position:absolute;right:0;top:calc(100% + 8px);min-width:160px;margin:0;padding:6px;list-style:none;border-radius:16px;background:rgba(10,10,10,.94);border:1px solid var(--line);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.stage-root .lang-list a{display:flex;align-items:center;min-height:44px;padding:0 14px;border-radius:10px;color:var(--mute);text-decoration:none;font:600 15px var(--f-body)}
.stage-root .lang-list a:hover{background:rgba(255,255,255,.08);color:var(--ink)}
.stage-root .lang-list a[aria-current]{color:var(--ink)}
.stage-root .lang-list a[aria-current]::after{content:"✓";margin-left:auto;padding-left:12px}
.stage-root .arrows{position:fixed;right:max(4vw,14px);bottom:14px;z-index:20;display:flex;gap:8px}
.stage-root .arrows button{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:rgba(0,0,0,.6);color:#fff;font-size:18px;cursor:pointer}
.stage-root .hud{position:fixed;left:max(4vw,14px);bottom:18px;z-index:20;font:600 13px var(--f-body);color:var(--mute);display:flex;gap:14px;align-items:center}
.stage-root .hud b{font:700 15px var(--f-head);color:var(--ink);min-width:3.2em}
.stage-root .bar{width:90px;height:2px;background:var(--line);overflow:hidden}
.stage-root .bar i{display:block;height:100%;width:0;background:#fff}
.stage-root .spreview{position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:30;margin:0;padding:6px 14px;border-radius:999px;background:#c9a66b;color:#1e1a2b;font:600 13px var(--f-body);white-space:nowrap}
@media(max-width:760px){
 .stage .micbox{height:54vh}
 .stage .halo{top:68%}
 .stage .L{top:64px;left:16px;right:62px;width:auto}
 .stage .R{top:auto;bottom:14px;left:16px;right:16px;width:auto;padding:14px 16px;border-radius:16px;background:rgba(10,10,10,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid var(--line)}
 .stage .T{top:64px;bottom:auto;left:62px;right:62px;width:auto;transform:none}
 .stage .R p{font-size:15px;margin:8px 0 12px}
 .stage .lab{width:44vw;padding-left:34px}.stage .lab::before{width:26px}.stage .lab span,.stage .lab small{display:none}.stage .lab b{font-size:13px}
 .stage .F{top:auto;bottom:14px;left:16px!important;right:16px!important;width:auto;padding:16px}
 .stage .F p{font-size:15px;margin-top:8px}
 .stage .nums{height:24vh}.stage .nums .big{font-size:130px}
 .stage .stat{padding:6px 0}.stage .stat .big{font-size:30px}
 .stage .orb{width:40px;height:40px;margin:-20px 0 0 -20px}
 .stage .orb-n{font-size:12px}
 .stage .st{padding:8px 0 8px 16px}
 .stage .st:not(.cur) p{display:none}
 .stage-root .arrows{top:60px;bottom:auto;right:16px;flex-direction:column}
 .stage-root .arrows button{width:38px;height:38px}
 .stage-root .hud{top:0;bottom:auto;left:0;right:0}.stage-root .hud b,.stage-root .hud span:last-child{display:none}.stage-root .bar{width:100%}
 .stage-root .snav .sbtn{padding:0 14px;font-size:14px}
 .stage-root .snav-r{gap:4px}
 .stage-root .globe{width:40px;height:40px}
 .stage-root .spreview{top:auto;bottom:90px;font-size:12px}
}
`;
