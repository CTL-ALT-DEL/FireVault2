import assert from "node:assert/strict";
import {access,readFile,readdir} from "node:fs/promises";

const root=new URL("../",import.meta.url);
const [versionText,index,worker,instructions,noJekyll,entries]=await Promise.all([
  readFile(new URL("version.json",root),"utf8"),
  readFile(new URL("index.html",root),"utf8"),
  readFile(new URL("sw.js",root),"utf8"),
  readFile(new URL("CLEAN_INSTALL.md",root),"utf8"),
  readFile(new URL(".nojekyll",root),"utf8"),
  readdir(root,{withFileTypes:true})
]);

const build=JSON.parse(versionText).build;
const escapedBuild=build.replaceAll(".","\\.");
const requiredRootFiles=[
  ".nojekyll","index.html","manifest.json","version.json","sw.js",
  "README.md","CLEAN_INSTALL.md","VALIDATION.md"
];
const requiredRootDirectories=["assets","src","tests","architecture"];

assert.equal(build,"1.03.16");
for(const path of [...requiredRootFiles,...requiredRootDirectories]) await access(new URL(path,root));
assert.match(noJekyll,/Publish FireVault directly/);
assert.doesNotMatch(noJekyll,/theme:|plugins:/i);
assert.match(instructions,new RegExp(`FireVault Build ${escapedBuild} deployment`));
assert.match(instructions,/copy its \*\*contents\*\* into the repository root/);
assert.match(instructions,/do not upload the containing ZIP folder as another nested directory/);
assert.match(instructions,/only the newest run for the newest commit needs to succeed/);
assert.match(instructions,new RegExp(`confirm it reports Build ${escapedBuild}`));
assert.match(instructions,/Do not delete the Home Screen app or clear Safari website data/);
assert.match(instructions,/firevault_vault_build_030/);

const topLevelNames=entries.map(entry=>entry.name);
assert.equal(topLevelNames.includes("_config.yml"),false,"FireVault must not require a Jekyll configuration.");
assert.equal(topLevelNames.includes("Gemfile"),false,"FireVault must not require a Ruby build.");
assert.equal(topLevelNames.some(name=>/^firevault-(?:build|0\.)/i.test(name)),false,"A release folder must not be nested inside the deploy root.");
assert.match(index,new RegExp(`window\\.FIREVAULT_BUILD = "${escapedBuild}"`));
assert.match(index,new RegExp(`serviceWorker\\.register\\("sw\\.js\\?v=${escapedBuild}"`));
assert.match(worker,new RegExp(`const BUILD="${escapedBuild}"`));
assert.doesNotMatch(index,new RegExp(`\\?v=1\\.03\\.(?:[0-9]|10)(?:"|')`));

console.log(JSON.stringify({
  status:"passed",build,checks:29,
  requiredRootFiles:requiredRootFiles.length,
  requiredRootDirectories:requiredRootDirectories.length,
  directDeploy:true
}));
