export default `
html,body,#root{height:100%;margin:0;font-family:var(--font-family-body)}
*{box-sizing:border-box}
.screen-shell{height:100%;min-width:0}
.brand-icon{color:var(--color-text-accent);background:var(--color-background-muted);border-radius:var(--radius-element);padding:var(--spacing-2)}
.nav-progress{min-width:0}
.eyebrow{letter-spacing:.08em;text-transform:uppercase}
.hero-grid{align-items:center}
.hero-copy{justify-content:center;min-width:0}
.illustration-figure{margin:0;min-width:0}
.illustration-figure img{display:block;width:100%;height:auto;border-radius:var(--radius-container)}
.hero-art img{aspect-ratio:3/2;object-fit:cover}
.suggestion-result{border-inline-start:var(--spacing-1) solid var(--color-text-accent);padding-inline-start:var(--spacing-4)}
.step-preview{animation:preview-in .25s ease-out}
.practice-feedback{border-block-start:var(--border-width) solid var(--color-border);padding-block-start:var(--spacing-4)}
@keyframes preview-in{from{opacity:.45;transform:translateY(.3rem)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.step-preview{animation:none}}
.content-wrap{min-width:0;width:100%}
.flowchart{margin:0;overflow:auto;max-width:100%;border-radius:var(--radius-container);background:var(--color-background-surface)}
.flowchart svg{display:block;width:100%;min-width:48rem;height:auto}
.flowchart a{outline:none}
.flowchart a:hover rect,.flowchart a:focus-visible rect{stroke:var(--color-accent);stroke-width:3;fill:var(--color-background-muted)}
.step-line{scroll-margin-top:var(--spacing-6)}
.source-links{overflow-wrap:anywhere}
.download-file{color:var(--color-text-secondary);background:var(--color-background-muted);padding:var(--spacing-3);border-radius:var(--radius-element)}
.nav-footer{border-top:var(--border-width) solid var(--color-border)}
.print-only{display:none}
@media(max-width:48rem){.desktop-label{display:none}.flowchart svg{min-width:48rem}}
@media print{
 @page{size:letter;margin:16mm}
 html,body,#root{color-scheme:light!important;height:auto!important;overflow:visible!important;background:var(--color-background-surface)}
 .screen-shell{display:none!important}.print-only{display:flex!important;padding:0!important}
 .print-step{break-before:page}.print-only h1,.print-only h2,.print-only h3{break-after:avoid}
 .print-only p,.print-only li{orphans:3;widows:3}.print-only a{overflow-wrap:anywhere}
}
`;
