/**
 * Рисунки площадок для дизайна «Сцена» — показываются, пока не загружено настоящее фото.
 * Перенесены из прототипа как есть (SVG 1600×900).
 */
/* eslint-disable */
export const VENUE_ART: Record<string, string> = {
weddings:`<defs><linearGradient id="w1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2414"/><stop offset="1" stop-color="#0a0604"/></linearGradient><radialGradient id="w2"><stop offset="0" stop-color="#ffe3a8"/><stop offset=".3" stop-color="#f5b85a" stop-opacity=".55"/><stop offset="1" stop-color="#f5b85a" stop-opacity="0"/></radialGradient><radialGradient id="w3"><stop offset="0" stop-color="#ffd38a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd38a" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#w1)"/>
${[160,480,800,1120,1440].map(x=>`<path d="M${x-120} 620V300a120 120 0 0 1 240 0v320Z" fill="#4a2f1a" opacity=".55"/><path d="M${x-96} 620V310a96 96 0 0 1 192 0v310Z" fill="#1c1209" opacity=".8"/>`).join('')}
<path d="M640 600V330a160 160 0 0 1 320 0v270" fill="none" stroke="#f3e6d8" stroke-width="26" stroke-dasharray="2 22" stroke-linecap="round" opacity=".85"/>
${[300,800,1300].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="120" stroke="#8a6a40" stroke-width="2"/><circle cx="${x}" cy="150" r="190" fill="url(#w2)"/><ellipse cx="${x}" cy="150" rx="70" ry="26" fill="#ffe9bf" opacity=".8"/>${[-60,-30,0,30,60].map(d=>`<circle cx="${x+d}" cy="${185+Math.abs(d)/3}" r="4" fill="#fff6dc"/>`).join('')}`).join('')}
<rect y="600" width="1600" height="300" fill="#120b06"/>
${[[220,700],[620,690],[1000,690],[1400,700],[420,820],[1180,820]].map(([x,y])=>`<ellipse cx="${x}" cy="${y+40}" rx="170" ry="38" fill="#000" opacity=".5"/><ellipse cx="${x}" cy="${y}" rx="160" ry="40" fill="#efe6d8"/><rect x="${x-160}" y="${y}" width="320" height="70" fill="#d9cdb9"/><circle cx="${x}" cy="${y-30}" r="60" fill="url(#w3)"/><rect x="${x-3}" y="${y-28}" width="6" height="22" fill="#fff"/>`).join('')}`,
conferences:`<defs><linearGradient id="c1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1630"/><stop offset="1" stop-color="#02040a"/></linearGradient><radialGradient id="c2"><stop offset="0" stop-color="#4f7dff" stop-opacity=".5"/><stop offset="1" stop-color="#4f7dff" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#c1)"/>
${[0,1,2,3,4,5].map(i=>`<rect x="${120+i*240}" y="96" width="160" height="8" rx="4" fill="#cfe0ff" opacity=".5"/>`).join('')}
<circle cx="800" cy="300" r="520" fill="url(#c2)"/>
<rect x="430" y="130" width="740" height="400" rx="10" fill="#14254f" stroke="#5b86ff" stroke-width="3"/>
<rect x="490" y="190" width="340" height="26" rx="6" fill="#dbe6ff" opacity=".9"/><rect x="490" y="240" width="560" height="12" rx="6" fill="#9fb8ff" opacity=".5"/><rect x="490" y="270" width="480" height="12" rx="6" fill="#9fb8ff" opacity=".5"/>
${[0,1,2,3,4].map(i=>`<rect x="${500+i*100}" y="${470-[90,140,110,180,150][i]}" width="60" height="${[90,140,110,180,150][i]}" fill="#5b86ff" opacity=".75"/>`).join('')}
<rect y="560" width="1600" height="40" fill="#0b1328"/><path d="M1240 560h120l-14 120h-92Z" fill="#1a2a52"/><rect x="1236" y="550" width="128" height="14" fill="#2d4790"/>
${[0,1,2,3].map(r=>Array.from({length:14+r*2},(_,i)=>{const w=1600/(14+r*2),x=i*w+w*.15,y=640+r*70;return `<rect x="${x}" y="${y}" width="${w*.7}" height="${120}" rx="18" fill="#05080f" stroke="#2b4688" stroke-opacity=".6"/>`}).join('')).join('')}`,
corporate:`<defs><linearGradient id="k1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22093a"/><stop offset="1" stop-color="#050108"/></linearGradient><linearGradient id="k2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e05cff" stop-opacity=".5"/><stop offset="1" stop-color="#e05cff" stop-opacity="0"/></linearGradient><linearGradient id="k3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cd6ff" stop-opacity=".45"/><stop offset="1" stop-color="#5cd6ff" stop-opacity="0"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#k1)"/>
<path d="M300 0h40l260 900H0Z" fill="url(#k2)"/><path d="M1260 0h40l300 700V900h-560Z" fill="url(#k3)"/><path d="M780 0h40l220 900H560Z" fill="url(#k2)" opacity=".6"/>
<path d="M0 120Q400 260 800 140T1600 130" fill="none" stroke="#6b4a7a" stroke-width="2"/>
${Array.from({length:26},(_,i)=>{const t=i/25,x=t*1600,y=t<.5?120+Math.sin(t*2*Math.PI)*90+40*t:140+Math.sin((t-.5)*2*Math.PI)*-40;return `<circle cx="${x}" cy="${y+20}" r="7" fill="#ffd98a"/><circle cx="${x}" cy="${y+20}" r="22" fill="#ffd98a" opacity=".18"/>`}).join('')}
<rect x="980" y="430" width="560" height="14" fill="#c27bff" opacity=".6"/>
${Array.from({length:14},(_,i)=>`<rect x="${1000+i*38}" y="${370+(i%3)*8}" width="18" height="${60-(i%3)*8}" rx="5" fill="${['#ff7ab6','#8ad8ff','#ffd27a'][i%3]}" opacity=".7"/>`).join('')}
<rect x="960" y="560" width="640" height="340" fill="#120619"/>
${Array.from({length:22},(_,i)=>{const x=i*76+20,y=700+(i%4)*24;return `<circle cx="${x}" cy="${y}" r="34" fill="#07020a"/><path d="M${x-60} 900Q${x} ${y+20} ${x+60} 900Z" fill="#07020a"/>`}).join('')}`,
private:`<defs><linearGradient id="p1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1e2a"/><stop offset=".55" stop-color="#3a3140"/><stop offset=".75" stop-color="#c0703a"/><stop offset="1" stop-color="#1a120c"/></linearGradient><radialGradient id="p2"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".8"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#p1)"/>
<path d="M0 640Q400 590 800 620T1600 600V900H0Z" fill="#0c1410"/>
<path d="M980 640V430l170-110 170 110v210Z" fill="#14100d"/><path d="M960 440l190-130 190 130" fill="none" stroke="#2a211a" stroke-width="16"/>
${[[1040,470],[1220,470],[1040,560],[1220,560]].map(([x,y])=>`<rect x="${x}" y="${y}" width="54" height="56" fill="#ffc46b"/><circle cx="${x+27}" cy="${y+28}" r="70" fill="url(#p2)" opacity=".5"/>`).join('')}
${[[120,420,160],[330,380,190],[1480,400,170],[620,450,130]].map(([x,y,r])=>`<rect x="${x-10}" y="${y+r*.6}" width="20" height="${640-y-r*.6}" fill="#0a0f0c"/><circle cx="${x}" cy="${y}" r="${r}" fill="#0f1a13"/><circle cx="${x-r*.5}" cy="${y+r*.3}" r="${r*.7}" fill="#0c1610"/><circle cx="${x+r*.55}" cy="${y+r*.25}" r="${r*.65}" fill="#122017"/>`).join('')}
<path d="M120 420Q380 560 620 450" fill="none" stroke="#3a2e22" stroke-width="2"/><path d="M620 450Q1050 600 1480 400" fill="none" stroke="#3a2e22" stroke-width="2"/>
${Array.from({length:24},(_,i)=>{const t=i/23;let x,y;if(t<.35){const u=t/.35;x=120+u*500;y=420+Math.sin(u*Math.PI)*110+u*30}else{const u=(t-.35)/.65;x=620+u*860;y=450+Math.sin(u*Math.PI)*120-u*50}return `<circle cx="${x}" cy="${y+8}" r="6" fill="#ffe2a0"/><circle cx="${x}" cy="${y+8}" r="20" fill="#ffd27a" opacity=".22"/>`}).join('')}
<path d="M140 780L1460 780L1560 880H40Z" fill="#e9e1d2"/><rect x="40" y="880" width="1520" height="20" fill="#bfb4a2"/>
${Array.from({length:9},(_,i)=>`<circle cx="${260+i*135}" cy="770" r="40" fill="url(#p2)"/><rect x="${254+i*135}" y="750" width="12" height="26" fill="#fff4d6"/>`).join('')}`,
official:`<defs><linearGradient id="o1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1612"/><stop offset="1" stop-color="#080404"/></linearGradient><linearGradient id="o2" x1="0" x2="1"><stop offset="0" stop-color="#3b2a24"/><stop offset=".45" stop-color="#8a7464"/><stop offset="1" stop-color="#2a1d18"/></linearGradient><linearGradient id="o3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8c1d1d"/><stop offset="1" stop-color="#3a0a0a"/></linearGradient><radialGradient id="o4"><stop offset="0" stop-color="#ffe0b0" stop-opacity=".35"/><stop offset="1" stop-color="#ffe0b0" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#o1)"/><circle cx="800" cy="200" r="600" fill="url(#o4)"/>
${[100,330,1170,1400].map(x=>`<rect x="${x}" y="90" width="110" height="560" fill="url(#o2)"/><rect x="${x-14}" y="70" width="138" height="30" fill="#9b8574"/><rect x="${x-14}" y="640" width="138" height="24" fill="#6a574a"/>`).join('')}
${[560,960].map(x=>`<path d="M${x} 80h80v400l-40-30-40 30Z" fill="url(#o3)"/><rect x="${x}" y="80" width="80" height="10" fill="#d9b25c"/><line x1="${x+40}" y1="40" x2="${x+40}" y2="80" stroke="#d9b25c" stroke-width="4"/>`).join('')}
<rect y="660" width="1600" height="240" fill="#140a08"/>
<path d="M740 660h120l200 240H540Z" fill="url(#o3)"/>
<path d="M730 520h140l-16 140h-108Z" fill="#3a2418"/><rect x="722" y="508" width="156" height="16" fill="#6a4a32"/><circle cx="800" cy="580" r="26" fill="none" stroke="#d9b25c" stroke-width="4"/>`
};
