export const steps = [
  ['pause','Pause. Do not reply, pay, or share a code.'],
  ['verify','Verify through a contact or official app you already trust.'],
  ['block','If unwanted, block the sender yourself in your messaging app.']
];
export function inspectMessage(text) {
  const t=text.trim(); if(!t) throw new Error('Paste a message first.');
  if(t.length>10000) throw new Error('Keep the message under 10,000 characters.');
  const cues=[];
  const patterns=[['Sensitive information request', /(?:otp|password|pin|cvv|verification code|one.time code)/i, 'Never share a password, PIN or one-time code with a sender.'],['Payment or account pressure', /(?:pay now|transfer|account.{0,30}(?:block|suspend)|kyc|urgent|immediately|expires|last chance)/i, 'Urgency can be a scam cue, but is not proof. Verify independently.'],['Prize or reward claim', /(?:won|winner|prize|lottery|reward|free gift)/i, 'A claimed reward does not establish a real offer.']];
  for(const [label,re,meaning] of patterns) { const m=t.match(re); if(m)cues.push({label,excerpt:m[0],meaning}); }
  const links=[];const seen=new Set();
  for(const m of t.matchAll(/(?:https?:\/\/|www\.)[^\s<>]+/gi)) {
    const raw=m[0].replace(/[),.;!?]+$/g,'');
    try {const url=new URL(raw.startsWith('www.')?'https://'+raw:raw); if(seen.has(url.href))continue; seen.add(url.href);links.push({raw,host:url.hostname,hasCredentials:!!(url.username||url.password),encodedHost:url.hostname.includes('xn--'),protocol:url.protocol});} catch { links.push({raw,host:'Unclear address',hasCredentials:false,encodedHost:false,protocol:''}); }
  }
  return {cues,links,summary:cues.length?'Reasons to pause':'Not enough evidence',limit:'This checks a few text patterns and parses addresses locally. It cannot verify the sender, reputation, redirects, attachments or whether a message is a scam. No flags does not mean safe.'};
}
export function redactSecrets(text) {
 return text.replace(/\b(OTP|PIN|password|passcode|CVV|verification code|one.time code)(\s*(?:is|:|=)?\s+)([A-Za-z0-9!@#$%^&*_-]{3,})/gi,(all,label,gap,value)=>['at','with','from','to','here','now','please','immediately'].includes(value.toLowerCase())?all:label+gap+'[redacted]');
}
export function planWorkflow(item,contacts) {
 const contact=contacts.find(c=>c.id===item.contactId);
 const pending=steps.filter(([id])=>!item.done.includes(id));
 const blocked=item.evidence.cues.some(c=>c.label==='Sensitive information request');
 return {sources:['Message excerpts','Parsed hostname (no reputation check)','Your checklist notes','Your selected contact'],tools:['message_evidence','hostname_evidence','check_case_state','trusted_contact_lookup','checklist_planner'],next:pending[0]?.[1]||'Review your notes. Completion is not proof of safety.',verificationReady:!!contact,guard:blocked?'Sensitive-information cue: do not share codes or credentials.':'Identity remains unverified even without flagged cues.',contact:contact?.name||'None selected'};
}
export function newCase(text,id,now) {const masked=redactSecrets(text);return {id,createdAt:now,text:masked,redacted:masked!==text,evidence:inspectMessage(masked),done:[],contactId:null,practiceComplete:false};}
export function answer(question,item,contacts) {
 const q=question.toLowerCase().trim();
 if(!q)return {tool:'clarification',text:'Ask about the next step, recorded blocking status, a hostname or your selected contact.'};
 if(/(?:ignore|override|forget).*(?:rule|instruction|safety)|(?:system prompt|secret|developer mode)|(?:send|transfer|pay|call|report).*(?:now|money|sender|police|bank)/.test(q))return {tool:'scope_guard',text:'A message or question cannot enable external actions. I do not call, report, transfer money, verify identity, or reveal secrets. We can review the local evidence and your notes.'};
 if(/^(?:yes|no|done|i did it|i.ve done that|do it|that.s done)[.! ]*$/.test(q))return {tool:'clarification',text:'Which step do you mean? Use the checklist to mark your own note explicitly. I will not assume you called, blocked or verified anything.'};
 if(/(?:is|looks|it.s|its).*(?:safe|legit|real|scam)|can i trust/.test(q))return {tool:'uncertainty_guard',text:`I cannot establish identity or safety. ${item.evidence.cues.length?item.evidence.cues.map(c=>c.label).join('; ')+'.':'No configured text cue was found; that is not a safe verdict.'} Verify through a known independent contact or official app, not a link or number in the message.`};
 const requests=[];const pending=steps.filter(([id])=>!item.done.includes(id));
 if(/(?:already|did i|have i).*(?:block)|blocked|blocking/.test(q))requests.push({tool:'check_case_state',text:item.done.includes('block')?'You marked the blocking step complete. SAFEPARENT did not block anyone.':'You have not marked the blocking step complete. SAFEPARENT cannot block a sender.'});
 if(/(?:contact|call|verify|verification)/.test(q)){const c=contacts.find(c=>c.id===item.contactId);requests.push({tool:'trusted_contact_lookup',text:c?`Your selected contact is ${c.name}. Use a number you already know outside this message. Practice here does not place a call or verify identity.`:'Choose a trusted contact you already know in the verification panel. Do not use a number supplied by the suspicious message.'});}
 if(/(?:link|host|address|url)/.test(q))requests.push({tool:'hostname_evidence',text:item.evidence.links.length?`Parsed hostname${item.evidence.links.length>1?'s':''}: ${item.evidence.links.map(l=>l.host).join(', ')}. No link was opened. Hostname text does not prove ownership or safety.`:'No http(s) or www address was found. Hidden, shortened, malformed or bare-domain links may be missed.'});
 if(/(?:next|what|remember|done|status)/.test(q)&&!requests.length||/next/.test(q))requests.push({tool:'checklist_planner',text:pending.length?`Next unmarked step: ${pending[0][1]} You decide what to do, and mark it here yourself.`:'All practice checklist steps are marked. This is your record, not proof that the sender was safe or that an action happened outside the app.'});
 if(requests.length)return {tool:requests.map(r=>r.tool).join(' + '),text:requests.map(r=>r.text).join('\n\n')};
 return {tool:'scope_guard',text:'I can show the next checklist step, your recorded blocking status, a parsed hostname, or your selected trusted contact. I cannot verify identity, make calls, report a sender, or move money.'};
}
export function loadState(raw) {
 try {const x=JSON.parse(raw);if(x?.version!==1||!Array.isArray(x.cases)||!Array.isArray(x.contacts)||!Array.isArray(x.events))throw Error();
 if(!x.cases.every(c=>typeof c.id==='string'&&typeof c.createdAt==='string'&&typeof c.text==='string'&&c.text.length<=10000&&Array.isArray(c.done)&&c.done.every(d=>steps.some(([id])=>id===d))&&Array.isArray(c.evidence?.links)&&c.evidence.links.every(l=>typeof l.host==='string')&&Array.isArray(c.evidence?.cues)&&c.evidence.cues.every(q=>typeof q.label==='string'&&typeof q.excerpt==='string'&&typeof q.meaning==='string')&&typeof c.evidence.limit==='string'&&typeof c.evidence.summary==='string'))throw Error();
 if(!x.contacts.every(c=>typeof c.id==='string'&&typeof c.name==='string')||!x.events.every(e=>typeof e.tool==='string'&&typeof e.detail==='string'))throw Error(); return x;
 }catch{}return {version:1,cases:[],contacts:[],events:[]};
}
export function exportSummary(item) {
 if(!item)throw Error('Choose a case first.');
 return {format:'safeparent-redacted-summary',version:1,exportedAt:new Date().toISOString(),caseCreatedAt:item.createdAt,evidenceLabels:item.evidence.cues.map(c=>c.label),addressCount:item.evidence.links.length,recordedSteps:steps.map(([id,label])=>({step:label,userMarkedComplete:item.done.includes(id)})),callbackPracticeComplete:!!item.practiceComplete,limits:['Message, excerpts, hostname, contact name, IDs and trace are omitted.','Checklist values are user notes, not proof of any external action.','Exported file is saved to your device; review it before sharing.']};
}
export function inspectStoredState(raw) {
 if(!raw)return {state:loadState(null),recoveryNeeded:false};
 const state=loadState(raw);let valid=false;
 try{const x=JSON.parse(raw);valid=x?.version===1&&Array.isArray(x.cases)&&Array.isArray(x.contacts)&&Array.isArray(x.events)&&JSON.stringify(state)===JSON.stringify(x);}catch{}
 return {state,recoveryNeeded:!valid};
}
