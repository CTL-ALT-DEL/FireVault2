export const THEME_PROFILE_SCHEMA_VERSION = 1;

const DEFAULT_THEME_PROFILE = Object.freeze({
  id:"field-vault-dark",
  name:"Field Vault Dark",
  mode:"dark",
  branding:Object.freeze({
    mark:"assets/favicon.png",
    logo:"assets/firevault-logo-master.png",
    icon192:"assets/icon-192.png",
    icon512:"assets/icon-512.png",
    appleTouchIcon:"assets/apple-touch-icon.png",
    wordmark:Object.freeze([
      Object.freeze({text:"FIRE",tone:"primary"}),
      Object.freeze({text:"VAULT",tone:"accent"})
    ]),
    tagline:"Field Vault System"
  }),
  colors:Object.freeze({
    background:"#0b0d10",
    surface:"#151922",
    surfaceRaised:"#1d2330",
    line:"#303747",
    text:"#f4f7fb",
    muted:"#a7b0c0",
    accent:"#ef4444",
    accentStrong:"#991b1b",
    success:"#22c55e",
    warning:"#f59e0b",
    info:"#38bdf8",
    cyan:"#22d3ee"
  }),
  chrome:Object.freeze({
    themeColor:"#101216",
    backgroundColor:"#0b0d10",
    statusBarStyle:"black"
  }),
  shape:Object.freeze({
    radius:18,
    controlRadius:15,
    compact:false
  }),
  typography:Object.freeze({
    family:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
    baseSize:14
  })
});

function safeString(value,fallback=""){return typeof value==="string"&&value.trim()?value.trim():fallback;}
function safeHex(value,fallback){return /^#[0-9a-f]{6}$/i.test(String(value||""))?String(value):fallback;}
function safeNumber(value,fallback,min,max){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;}

export function resolveThemeProfile(appProfile={}){
  const appearance=appProfile.appearance||{};
  const branding=appProfile.branding||{};
  const wordmark=Array.isArray(branding.wordmark)&&branding.wordmark.length
    ? branding.wordmark.slice(0,3).map(segment=>({text:safeString(segment?.text,""),tone:["primary","accent","muted"].includes(segment?.tone)?segment.tone:"primary"})).filter(segment=>segment.text)
    : DEFAULT_THEME_PROFILE.branding.wordmark.map(segment=>({...segment}));
  return {
    schemaVersion:THEME_PROFILE_SCHEMA_VERSION,
    id:safeString(appearance.profileId,DEFAULT_THEME_PROFILE.id),
    name:safeString(appearance.profileName,DEFAULT_THEME_PROFILE.name),
    mode:appearance.theme==="light"?"light":"dark",
    branding:{
      mark:safeString(branding.mark,DEFAULT_THEME_PROFILE.branding.mark),
      logo:safeString(branding.logo,DEFAULT_THEME_PROFILE.branding.logo),
      icon192:safeString(branding.icon192,DEFAULT_THEME_PROFILE.branding.icon192),
      icon512:safeString(branding.icon512,DEFAULT_THEME_PROFILE.branding.icon512),
      appleTouchIcon:safeString(branding.appleTouchIcon,DEFAULT_THEME_PROFILE.branding.appleTouchIcon),
      wordmark,
      tagline:safeString(branding.tagline,DEFAULT_THEME_PROFILE.branding.tagline)
    },
    colors:{
      background:safeHex(appearance.background,DEFAULT_THEME_PROFILE.colors.background),
      surface:safeHex(appearance.surface,DEFAULT_THEME_PROFILE.colors.surface),
      surfaceRaised:safeHex(appearance.surfaceRaised,DEFAULT_THEME_PROFILE.colors.surfaceRaised),
      line:safeHex(appearance.line,DEFAULT_THEME_PROFILE.colors.line),
      text:safeHex(appearance.text,DEFAULT_THEME_PROFILE.colors.text),
      muted:safeHex(appearance.muted,DEFAULT_THEME_PROFILE.colors.muted),
      accent:safeHex(appearance.accent,DEFAULT_THEME_PROFILE.colors.accent),
      accentStrong:safeHex(appearance.accentStrong,DEFAULT_THEME_PROFILE.colors.accentStrong),
      success:safeHex(appearance.success,DEFAULT_THEME_PROFILE.colors.success),
      warning:safeHex(appearance.warning,DEFAULT_THEME_PROFILE.colors.warning),
      info:safeHex(appearance.info,DEFAULT_THEME_PROFILE.colors.info),
      cyan:safeHex(appearance.cyan,DEFAULT_THEME_PROFILE.colors.cyan)
    },
    chrome:{
      themeColor:safeHex(appearance.themeColor||appearance.surface,DEFAULT_THEME_PROFILE.chrome.themeColor),
      backgroundColor:safeHex(appearance.background,DEFAULT_THEME_PROFILE.chrome.backgroundColor),
      statusBarStyle:safeString(appearance.statusBarStyle,DEFAULT_THEME_PROFILE.chrome.statusBarStyle)
    },
    shape:{
      radius:safeNumber(appearance.radius,DEFAULT_THEME_PROFILE.shape.radius,8,30),
      controlRadius:safeNumber(appearance.controlRadius,DEFAULT_THEME_PROFILE.shape.controlRadius,6,24),
      compact:Boolean(appearance.compact)
    },
    typography:{
      family:safeString(appearance.fontFamily,DEFAULT_THEME_PROFILE.typography.family),
      baseSize:safeNumber(appearance.baseFontSize,DEFAULT_THEME_PROFILE.typography.baseSize,12,18)
    }
  };
}

export function themeBrandAsset(appProfile={},key="mark"){
  const theme=resolveThemeProfile(appProfile);
  return theme.branding[key]||theme.branding.mark;
}

function wordmarkParts(theme){
  return theme.branding.wordmark.map(segment=>{
    const tag=segment.tone==="accent"?"b":"span";
    return `<${tag} data-brand-tone="${segment.tone}">${segment.text.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}</${tag}>`;
  }).join("");
}

export function themeWordmarkMarkup(appProfile={},extraClass=""){
  const theme=resolveThemeProfile(appProfile);
  return `<span class="fireVaultWordmark575 appWordmark0958 ${String(extraClass||"").replace(/[^a-z0-9_-]/gi,"")}">${wordmarkParts(theme)}</span>`;
}

export function applyThemeProfile(appProfile={},root=document.documentElement){
  const theme=resolveThemeProfile(appProfile);
  const vars={
    "--bg":theme.colors.background,
    "--panel":theme.colors.surface,
    "--panel2":theme.colors.surfaceRaised,
    "--line":theme.colors.line,
    "--text":theme.colors.text,
    "--muted":theme.colors.muted,
    "--accent":theme.colors.accent,
    "--accent2":theme.colors.accentStrong,
    "--green":theme.colors.success,
    "--amber":theme.colors.warning,
    "--blue":theme.colors.info,
    "--cyan":theme.colors.cyan,
    "--radius":`${theme.shape.radius}px`,
    "--fv-control-radius":`${theme.shape.controlRadius}px`,
    "--baseFont":`${theme.typography.baseSize}px`,
    "--fv-font-family":theme.typography.family,
    "--fv-brand-background":theme.colors.background,
    "--fv-brand-surface":theme.colors.surface,
    "--fv-brand-accent":theme.colors.accent
  };
  Object.entries(vars).forEach(([key,value])=>root.style.setProperty(key,value));
  root.dataset.themeProfile=theme.id;
  root.dataset.themeMode=theme.mode;
  document.body?.classList.toggle("profile-compact0958",theme.shape.compact);
  const metaTheme=document.querySelector('meta[name="theme-color"]');if(metaTheme)metaTheme.content=theme.chrome.themeColor;
  const statusBar=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(statusBar)statusBar.content=theme.chrome.statusBarStyle;
  const appTitle=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(appTitle)appTitle.content=appProfile.shortName||appProfile.name||"Field Vault";
  const favicon=document.querySelector('link[rel="icon"]');if(favicon)favicon.href=`${theme.branding.mark}?v=${window.__FIREVAULT_BUILD||"profile"}`;
  const appleIcon=document.querySelector('link[rel="apple-touch-icon"]');if(appleIcon)appleIcon.href=`${theme.branding.appleTouchIcon}?v=${window.__FIREVAULT_BUILD||"profile"}`;
  document.querySelectorAll("[data-app-mark]").forEach(img=>{img.src=`${theme.branding.mark}?v=${window.__FIREVAULT_BUILD||"profile"}`;img.alt=appProfile.name||"App";});
  document.querySelectorAll("[data-app-wordmark]").forEach(el=>{el.innerHTML=wordmarkParts(theme);});
  document.querySelectorAll("[data-app-tagline]").forEach(el=>{el.textContent=theme.branding.tagline;});
  return theme;
}

export function themeProfileSummary(appProfile={}){
  const theme=resolveThemeProfile(appProfile);
  return {
    id:theme.id,
    name:theme.name,
    mode:theme.mode,
    accent:theme.colors.accent,
    surfaces:3,
    brandAssets:5,
    radius:theme.shape.radius,
    baseFontSize:theme.typography.baseSize
  };
}

export function themeProfileExport(appProfile={}){
  return JSON.parse(JSON.stringify(resolveThemeProfile(appProfile)));
}
