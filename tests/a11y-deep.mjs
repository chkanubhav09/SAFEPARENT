import {chromium} from 'playwright';import AxeBuilder from '@axe-core/playwright';import {spawn} from 'node:child_process';
const server=spawn('python3',['-m','http.server','18746','--bind','127.0.0.1'],{stdio:'ignore'});await new Promise(r=>setTimeout(r,500));
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1280,height:900}});const page=await ctx.newPage();
const states=[];
async function axeState(name){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();states.push([name,r.violations.map(v=>v.id)]);}
await page.goto('http://127.0.0.1:18746');
await axeState('initial-empty');
await page.locator('#sample').click();await page.locator('#inspect').click();
await axeState('case-loaded');
await page.locator('#ask').click();await axeState('assistant-answer');
await page.locator('#exportCase').click();await axeState('export-dialog');
await page.locator('#exportCancel').click();
await page.locator('#practice').click();await axeState('practice-visible');
await page.evaluate(()=>localStorage.setItem('safeparent-v1','{corrupt'));await page.reload();await axeState('recovery');
const bad=states.filter(([n,v])=>v.length);
console.log(bad.length?JSON.stringify(bad):'AXE clean across all 6 states: '+states.map(s=>s[0]).join(', '));
await browser.close();server.kill();
if(bad.length)process.exit(1);
