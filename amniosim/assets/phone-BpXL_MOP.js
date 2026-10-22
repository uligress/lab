import{t as e}from"./bundler-DrfanpzS.js";function t(t){document.title=`AmnioSim · sonda`,document.body.innerHTML=`
  <style>
    :root{--acc:#ffffff;--mono:"Geist Mono",ui-monospace,"SF Mono",Menlo,monospace}
    html,body{margin:0;height:100%;background:#05070a;color:#cfd6de;font:14px/1.45 var(--mono);overscroll-behavior:none;touch-action:none;-webkit-user-select:none;user-select:none}
    .wrap{display:flex;flex-direction:column;height:100%;padding:14px;box-sizing:border-box;gap:12px}
    .h{letter-spacing:.12em;color:#9aa5b0;font-size:11px}.h b{color:var(--acc);font-weight:500}
    .st{padding:8px 10px;border:1px solid rgba(200,214,226,.16);border-radius:8px;background:rgba(10,13,17,.8);font-size:12.5px}
    .st[data-tone=ok]{border-color:rgba(127,214,160,.5);color:#7fd6a0}.st[data-tone=bad]{border-color:rgba(224,106,90,.6);color:#f2a99c}
    button{font:13px var(--mono);color:#e8edf2;background:rgba(255,255,255,.05);border:1px solid rgba(200,214,226,.22);border-radius:8px;padding:14px 10px}
    button.primary{background:var(--acc);color:#041016;border-color:var(--acc);font-weight:600}
    button.on{border-color:var(--acc);color:#fff;background:rgba(255,255,255,.15)}
    .row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
    .pad{flex:1;border:1px dashed rgba(200,214,226,.25);border-radius:14px;display:flex;align-items:center;justify-content:center;text-align:center;color:#7d8791;position:relative}
    .dot{position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.25);border:1px solid var(--acc);transform:translate(-50%,-50%);display:none}
    .ang{font-size:11.5px;color:#7d8791;text-align:center}
    .probe{height:10px;border-radius:0 0 40px 40px;background:#2a3138;margin:0 18%}
  </style>
  <div class="wrap">
    <div class="h"><b>AMNIOSIM</b> · SONDA REMOTA</div>
    <div class="st" id="st">Conectando con la computadora…</div>
    <button class="primary" id="go">Activar sensores</button>
    <div class="pad" id="pad"><div class="dot" id="dot"></div><div>Sostén el celular vertical, con la pantalla hacia ti:<br>el borde de abajo es la cara de la sonda.<br><br>Inclínalo, gíralo y balancéalo como un transductor.<br><br><b style="color:#cfd6de">Arrastra el pulgar aquí</b> para deslizar la sonda.</div></div>
    <div class="ang" id="ang">—</div>
    <div class="row"><button id="zero">Calibrar</button><button id="dop">Doppler</button><button id="fine">Fino</button></div>
    <div class="probe"></div>
  </div>`;let n=e=>document.getElementById(e),r=(e,t=``)=>{n(`st`).textContent=e,n(`st`).dataset.tone=t},i=null,a=e=>{i?.open&&i.send(e)},o=new e({debug:0});o.on(`open`,()=>{i=o.connect(t,{reliable:!1}),i.on(`open`,()=>{r(`Conectado. Pulsa «Activar sensores».`,`ok`),a({t:`hi`})}),i.on(`data`,e=>{let t=e;t.t===`buzz`&&`vibrate`in navigator&&navigator.vibrate(t.ms),t.t===`status`&&r(t.text,`ok`)}),i.on(`close`,()=>r(`Se cerró la conexión. Vuelve a escanear el QR.`,`bad`))}),o.on(`error`,e=>r(`No se pudo conectar (${e.type??e}). Vuelve a escanear el QR.`,`bad`));let s=0,c=e=>{if(e.alpha===null||e.beta===null||e.gamma===null)return;let t=performance.now();t-s<33||(s=t,a({t:`o`,a:e.alpha,b:e.beta,g:e.gamma}),n(`ang`).textContent=`α ${e.alpha.toFixed(0)}°  β ${e.beta.toFixed(0)}°  γ ${e.gamma.toFixed(0)}°`)};n(`go`).onclick=async()=>{try{let e=DeviceOrientationEvent;if(typeof e.requestPermission==`function`&&await e.requestPermission()!==`granted`){r(`Sin permiso para los sensores de movimiento.`,`bad`);return}window.addEventListener(`deviceorientation`,c),n(`go`).hidden=!0,r(`Sensores activos. Apunta como la sonda y pulsa Calibrar.`,`ok`),navigator.wakeLock?.request(`screen`).catch(()=>{})}catch{r(`Este navegador no da acceso a los sensores de movimiento.`,`bad`)}},n(`zero`).onclick=()=>{a({t:`k`,k:`zero`}),`vibrate`in navigator&&navigator.vibrate(20)},n(`dop`).onclick=()=>a({t:`k`,k:`doppler`});let l=!1;n(`fine`).onclick=()=>{l=!l,n(`fine`).classList.toggle(`on`,l),a({t:`k`,k:l?`fine`:`normal`})};let u=n(`pad`),d=n(`dot`),f=null,p=0;u.addEventListener(`pointerdown`,e=>{f=e.clientX,p=e.clientY,u.setPointerCapture(e.pointerId),d.style.display=`block`,m(e)});let m=e=>{let t=u.getBoundingClientRect();d.style.left=`${e.clientX-t.left}px`,d.style.top=`${e.clientY-t.top}px`};u.addEventListener(`pointermove`,e=>{f!==null&&(a({t:`s`,dx:e.clientX-f,dy:e.clientY-p}),f=e.clientX,p=e.clientY,m(e))});let h=()=>{f=null,d.style.display=`none`};u.addEventListener(`pointerup`,h),u.addEventListener(`pointercancel`,h)}export{t as startPhone};