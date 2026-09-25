// Generates the cheering-crowd silhouettes (people with raised arms and flags)
// used on both sides of the call-to-action banner. Output is a static SVG string.
export function crowdSVG(mirror, seedStart){
  let seed=seedStart; const FLAG=["#2e8a47","#1f6d37","#46a05c","#1a5c2e"]; const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  // arm: [elbowX, elbowY, handX, handY] relative to shoulder
  const POSES=[
    {arms:[[-9,-22,-15,-46],[9,-22,15,-46]]},              // both arms up (V)
    {arms:[[5,-25,7,-50]]},                                  // right fist straight up
    {arms:[[16,-12,13,-40]]},                                // right hand waving
    {arms:[[11,-18,7,-42]], flag:true},                      // flag bearer
    {arms:[[-19,-8,-17,-35],[19,-8,17,-35]]},               // cheering, elbows out
    {arms:[]},                                               // standing
    {arms:[[-6,-24,-4,-49]], flagL:true},                    // left hand flag
    {arms:[[-15,-14,-12,-41],[12,-22,18,-45]]},             // asymmetric cheer
  ];
  const person=(x,base,k,pose,flip)=>{
    const S=v=>v*k, f=flip?-1:1;
    const hy=base-S(106), shY=base-S(86);
    let g=`<g>`;
    // head with hair, neck
    g+=`<ellipse cx="${x}" cy="${hy}" rx="${S(7.6)}" ry="${S(9.4)}"/>`;
        g+=`<rect x="${x-S(3.6)}" y="${hy+S(6)}" width="${S(7.2)}" height="${S(9)}"/>`;
    // torso with rounded shoulders
    g+=`<path d="M${x-S(15)} ${base+40}L${x-S(16.5)} ${shY+S(16)}Q${x-S(17)} ${shY+S(2)} ${x-S(6)} ${shY-S(2)}H${x+S(6)}Q${x+S(17)} ${shY+S(2)} ${x+S(16.5)} ${shY+S(16)}L${x+S(15)} ${base+40}z"/>`;
    const arm=(a,side)=>{
      const [ex,ey,hx,hy2]=a.map((v,i)=>i%2===0?v*f:v);
      const sx=x+S(side>0?12.5:-12.5), sy=shY+S(4);
      const Ex=sx+S(ex), Ey=sy+S(ey), Hx=sx+S(hx), Hy=sy+S(hy2);
      return {d:`<path d="M${sx} ${sy}L${Ex} ${Ey}" stroke-width="${S(7)}"/><path d="M${Ex} ${Ey}L${Hx} ${Hy}" stroke-width="${S(5.6)}"/><circle cx="${Hx}" cy="${Hy-S(2)}" r="${S(4.2)}"/>`,Hx,Hy};
    };
    const flagAt=(Hx,Hy,dir)=>{
      const top=Hy-S(64), w=S(40+rnd()*10), h=S(26);
      const wave=S(7);
      return `<path d="M${Hx} ${Hy+S(12)}V${top}" stroke-width="${S(2.4)}" fill="none" stroke="#2b6e3c"/>`+
        `<path d="M${Hx} ${top}c${dir*w*.33} ${-wave} ${dir*w*.66} ${wave} ${dir*w} ${0}l0 ${h}c${-dir*w*.34} ${wave} ${-dir*w*.67} ${-wave} ${-dir*w} ${0}z" stroke="none" fill="${FLAG[(rnd()*FLAG.length)|0]}"/>`;
    };
    pose.arms.forEach((a,i)=>{
      const side=(a[0]*f)>=0?1:-1;
      const r=arm(a,side); g+=r.d;
      if((pose.flag && i===0) || (pose.flagL && i===0)) g+=flagAt(r.Hx,r.Hy,(r.Hx>=x?1:-1));
    });
    return g+`</g>`;
  };
  const row=(y0,kMin,kVar,step,stepVar,start)=>{
    let s=""; for(let x=start;x<395;x+=step+rnd()*stepVar){
      const pose=POSES[(rnd()*POSES.length)|0]; s+=person(x,y0+rnd()*6,kMin+rnd()*kVar,pose,rnd()<.5);
    } return s;
  };
  const back=row(104,.52,.08,15,7,-6);
  const mid =row(122,.68,.08,21,8,4);
  const front=row(142,.84,.1,28,10,12);
  const defs=`<defs>
    <linearGradient id="gb${seedStart}" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="140"><stop offset="0" stop-color="#6aac79"/><stop offset="1" stop-color="#3d8a51"/></linearGradient>
    <linearGradient id="gm${seedStart}" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="140"><stop offset="0" stop-color="#3f9152"/><stop offset="1" stop-color="#2a7a40"/></linearGradient>
    <linearGradient id="gf${seedStart}" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="140"><stop offset="0" stop-color="#236f39"/><stop offset=".8" stop-color="#1b6532"/><stop offset="1" stop-color="#1d6b35"/></linearGradient></defs>`;
  const layer=(id,content)=>`<g fill="url(#${id})" stroke="url(#${id})" stroke-linecap="round" stroke-linejoin="round">${content}</g>`;
  const body=layer("gb"+seedStart,back)+layer("gm"+seedStart,mid)+layer("gf"+seedStart,front)+`<rect x="-10" y="130" width="400" height="20" fill="#1d6b35"/>`;
  return defs+(mirror?`<g transform="translate(380 0) scale(-1 1)">${body}</g>`:body);
}
