import{a as y,t as w}from"../chunks/disclose-version.BFzxGX5O.js";import{i as x}from"../chunks/legacy.CeienYN-.js";import{p as _,t as R,a as k,m as n,x as d,s as p,y as f,c as u,r as v,z as E}from"../chunks/index-client.CbWOD79m.js";import{d as G}from"../chunks/utils.C2s_CC8S.js";import{b,r as g}from"../chunks/input.CGOLwYDl.js";import{g as C}from"../chunks/entry.D1uk6aZO.js";function P(l,t,e,r){n(t)&&e.start(n(t),n(r))}var T=w('<div class="landing-container svelte-hrrm9o"><h1 class="svelte-hrrm9o">RepoGPT</h1> <p class="svelte-hrrm9o">Transform GitHub repositories into GPT-ready files in seconds. Free, fast, and secure—all in your browser!</p> <div class="feature-box svelte-hrrm9o"><input type="text" placeholder="Enter GitHub Repository URL: https://github.com/USERNAME/REPO" class="svelte-hrrm9o"> <div class="control-group svelte-hrrm9o"><label for="chunks" class="svelte-hrrm9o">Number of Chunks:</label> <input id="chunks" type="number" min="1" class="svelte-hrrm9o"></div> <button class="svelte-hrrm9o">Concatenate Files</button></div> <div class="footer svelte-hrrm9o"><p class="svelte-hrrm9o">Your data never leaves the browser.</p></div></div>');function U(l,t){_(t,!0);let e=d(""),r=d(1);var s=T(),a=p(u(s),4),o=u(a);g(o);var i=p(o,2),c=p(u(i),2);g(c),v(i);var h=p(i,2);h.__click=[P,e,t,r],v(a),E(2),v(s),R(()=>h.disabled=!n(e)),b(o,()=>n(e),m=>f(e,m)),b(c,()=>n(r),m=>f(r,m)),y(l,s),k()}G(["click"]);function A(l,t){_(t,!1);function e(s){const[a,o]=s.split("github.com/")[1].split("/");return{owner:a,repo:o}}function r(s,a){try{const{owner:o,repo:i,branch:c="main"}=e(s);C(`concat#chunks=${a}&owner=${o}&repo=${i}&branch=${c}`)}catch{}}x(),U(l,{start:r}),k()}export{A as component};
