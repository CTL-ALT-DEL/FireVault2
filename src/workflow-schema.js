export const WORKFLOW_SCHEMA_VERSION = 1;

export const WORKFLOW_SURFACES = Object.freeze({
  directory:"directoryActionIds",
  detailPrimary:"detailPrimaryActionIds",
  notes:"notesActionIds"
});

export const WORKFLOW_SCHEMA = Object.freeze({
  id:"field-vault.workflow.v1",
  actions:Object.freeze([
    Object.freeze({id:"call",label:"Call",surfaceSupport:Object.freeze(["directory","detailPrimary"]),modules:Object.freeze(["core.records"]),capability:"phone",appForgeReady:true}),
    Object.freeze({id:"route",label:"Route",surfaceSupport:Object.freeze(["directory","detailPrimary"]),modules:Object.freeze(["core.nearby"]),capability:"gps",appForgeReady:true}),
    Object.freeze({id:"note",label:"Add Note",surfaceSupport:Object.freeze(["directory","detailPrimary"]),modules:Object.freeze(["core.notes"]),capability:"notes",appForgeReady:true}),
    Object.freeze({id:"photo",label:"Photo",surfaceSupport:Object.freeze(["directory","detailPrimary","notes"]),modules:Object.freeze(["core.photos"]),capability:"camera",appForgeReady:true}),
    Object.freeze({id:"favorite",label:"Favorite",surfaceSupport:Object.freeze(["directory"]),modules:Object.freeze(["core.search"]),capability:"favorite",appForgeReady:true}),
    Object.freeze({id:"task",label:"Task",surfaceSupport:Object.freeze(["notes"]),modules:Object.freeze(["optional.tasks"]),capability:"task",appForgeReady:true}),
    Object.freeze({id:"deficiency",label:"Deficiency",surfaceSupport:Object.freeze(["notes"]),modules:Object.freeze(["optional.deficiencies"]),capability:"deficiency",appForgeReady:true}),
    Object.freeze({id:"report",label:"Report",surfaceSupport:Object.freeze(["notes"]),modules:Object.freeze(["optional.reports"]),capability:"report",appForgeReady:true})
  ]),
  quickPhotoDefaults:Object.freeze({
    defaultUseOverlay:true,
    defaultIncludeReport:false,
    rememberAccount:true,
    rememberCategory:true,
    allowAccountChange:true,
    allowRetake:true,
    showCategory:true,
    showOverlayToggle:true,
    showReportToggle:true,
    showTitle:true,
    showInternalNotes:true,
    showCustomerCaption:true,
    cameraFacing:"environment",
    maxImageDimension:2048,
    jpegQuality:0.86
  })
});

function enabledModules(profile){return new Set(profile?.enabledModules||[]);}
function modulesSatisfied(profile,requirements=[]){
  const enabled=enabledModules(profile);
  return (requirements||[]).every(id=>enabled.has(id));
}
function configuredActionIds(profile,surface){
  const key=WORKFLOW_SURFACES[surface];
  const configured=key?profile?.workflows?.[key]:null;
  if(Array.isArray(configured))return configured;
  return WORKFLOW_SCHEMA.actions.filter(action=>action.surfaceSupport.includes(surface)).map(action=>action.id);
}

export function workflowActionById(id){
  return WORKFLOW_SCHEMA.actions.find(action=>action.id===String(id||""))||null;
}
export function activeWorkflowActions(profile,surface){
  const configured=configuredActionIds(profile,surface);
  return configured.map(workflowActionById).filter(action=>action&&action.surfaceSupport.includes(surface)&&modulesSatisfied(profile,action.modules));
}
export function workflowActionEnabled(profile,surface,id){
  return activeWorkflowActions(profile,surface).some(action=>action.id===String(id||""));
}
export function quickPhotoWorkflow(profile){
  const configured=profile?.workflows?.quickPhoto||{};
  const merged={...WORKFLOW_SCHEMA.quickPhotoDefaults,...configured};
  merged.cameraFacing=["environment","user","none"].includes(merged.cameraFacing)?merged.cameraFacing:"environment";
  merged.maxImageDimension=Math.max(640,Math.min(4096,Number(merged.maxImageDimension)||2048));
  merged.jpegQuality=Math.max(.5,Math.min(.96,Number(merged.jpegQuality)||.86));
  return merged;
}
export function workflowSchemaSummary(profile){
  const directory=activeWorkflowActions(profile,"directory");
  const detail=activeWorkflowActions(profile,"detailPrimary");
  const notes=activeWorkflowActions(profile,"notes");
  const photo=quickPhotoWorkflow(profile);
  return {
    schemaId:WORKFLOW_SCHEMA.id,
    presetId:profile?.workflows?.presetId||"default",
    totalActions:WORKFLOW_SCHEMA.actions.length,
    directoryActions:directory.length,
    detailPrimaryActions:detail.length,
    notesActions:notes.length,
    configurablePhotoOptions:Object.keys(photo).length,
    appForgeReadyActions:WORKFLOW_SCHEMA.actions.filter(action=>action.appForgeReady).length
  };
}
export function workflowSchemaExport(profile){
  return JSON.parse(JSON.stringify({
    version:WORKFLOW_SCHEMA_VERSION,
    profileWorkflow:profile?.workflows||{},
    schema:WORKFLOW_SCHEMA,
    active:{
      directory:activeWorkflowActions(profile,"directory"),
      detailPrimary:activeWorkflowActions(profile,"detailPrimary"),
      notes:activeWorkflowActions(profile,"notes"),
      quickPhoto:quickPhotoWorkflow(profile)
    }
  }));
}
