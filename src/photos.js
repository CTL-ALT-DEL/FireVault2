import { fullAddress } from "./storage.js";

export function stampFireVaultPhoto(dataUrl, site, settings, cb){
  const cfg = settings.overlay;
  const img = new Image();
  img.onload = function(){
    try{
      const canvas = document.createElement("canvas");
      const maxW = 1400;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const sizeMap = {small:.12, medium:.15, large:.19};
      const barH = Math.max(78, Math.round(canvas.height * (sizeMap[cfg.fontSize] || .15)));
      const y = cfg.alignment === "top" ? 0 : canvas.height - barH;
      const grad = ctx.createLinearGradient(0, y, canvas.width, y);
      grad.addColorStop(0, "rgba(0,0,0,.86)");
      grad.addColorStop(.65, "rgba(0,0,0,.66)");
      grad.addColorStop(1, "rgba(120,0,0,.62)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, canvas.width, barH);

      const pad = Math.round(canvas.width * .035);
      const accent = cfg.accentColor || "#ef4444";
      const textColor = cfg.textColor || "#ffffff";

      if(cfg.showLogo !== false){
        const logo = Math.round(barH * .52);
        const lx = pad, ly = y + Math.round((barH-logo)/2);
        ctx.fillStyle = accent; ctx.fillRect(lx, ly, logo, logo);
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "900 " + Math.round(logo*.46) + "px Arial";
        ctx.fillText("F", lx+logo/2, ly+logo/2);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.font = "900 " + Math.round(barH*.26) + "px Arial";
        ctx.fillStyle = textColor; ctx.fillText("FIRE", lx+logo+16, y+Math.round(barH*.46));
        const fireW = ctx.measureText("FIRE").width;
        ctx.fillStyle = accent; ctx.fillText("VAULT", lx+logo+16+fireW+5, y+Math.round(barH*.46));
        if(cfg.showTagline !== false){
          ctx.font = "600 " + Math.round(barH*.12) + "px Arial";
          ctx.fillStyle = "rgba(255,255,255,.84)";
          ctx.fillText("DOCUMENT. TRACK. PROTECT.", lx+logo+16, y+Math.round(barH*.68));
        }
      }

      const now = new Date();
      const fieldMap = {
        site:"Site: " + (site?.name || "Unknown Site"),
        date:"Date: " + now.toLocaleDateString([], {year:"numeric",month:"short",day:"numeric"}),
        time:"Time: " + now.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}),
        panel:"Panel: " + [site?.panelManufacturer, site?.panelModel].filter(Boolean).join(" "),
        address:"Address: " + (site ? fullAddress(site) : ""),
        gps:"GPS: " + (site?.lat && site?.lng ? site.lat + ", " + site.lng : "Not set")
      };
      const lines = (cfg.fields || ["site","date","time"]).map(k => fieldMap[k]).filter(Boolean);
      ctx.textAlign = "right"; ctx.fillStyle = textColor;
      const mainFont = Math.round(barH * (cfg.fontSize === "large" ? .20 : cfg.fontSize === "small" ? .14 : .17));
      ctx.font = "800 " + mainFont + "px Arial";
      const startY = y + Math.round(barH*.34);
      const gap = Math.round(mainFont*1.25);
      lines.slice(0,3).forEach((line,i) => ctx.fillText(line, canvas.width-pad, startY+(i*gap)));
      cb(canvas.toDataURL("image/jpeg", .88));
    }catch(err){
      console.error("Photo stamp failed", err);
      cb(dataUrl);
    }
  };
  img.onerror = () => cb(dataUrl);
  img.src = dataUrl;
}
