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
.tour-overlay{position:fixed;inset:0;margin:0;border:0;padding:0;width:100vw;height:100dvh;max-width:none;max-height:none;background:transparent;color:var(--color-text-primary);overflow:hidden}
.tour-overlay::backdrop{background:transparent}
.tour-spotlight{position:absolute;inset:0;pointer-events:none}
.tour-shade{fill:var(--color-overlay)}
.tour-outline{fill:none;stroke:var(--color-text-accent);stroke-width:3}
.tour-panel #tour-heading:focus{outline:none}
.tour-pointer{fill:none;stroke:var(--color-text-accent);stroke-width:3;stroke-linecap:round}
.tour-panel{position:absolute;bottom:auto;left:var(--spacing-3);top:var(--spacing-3);width:min(27rem,calc(100vw - 1.5rem));max-height:calc(100dvh - 1.5rem);overflow:auto;background:var(--color-background-surface);color:var(--color-text-primary);border:var(--border-width) solid var(--color-border);border-radius:var(--radius-container);box-shadow:var(--shadow-high)}
[data-tour],.hero-copy,.map-inspector,.step-line > :first-child,[aria-labelledby="next-action-title"],[aria-labelledby="practice-title"]{scroll-margin-top:var(--spacing-4)}
.print-only{display:none}
@media(max-width:48rem){.desktop-label{display:none}.flowchart svg{min-width:48rem}}
@media print{
 @page{size:letter;margin:16mm}
 html,body,#root{color-scheme:light!important;height:auto!important;overflow:visible!important;background:var(--color-background-surface)}
 .tour-overlay{display:none!important}.screen-shell{display:none!important}.print-only{display:flex!important;padding:0!important}
 .print-step{break-before:page}.print-only h1,.print-only h2,.print-only h3{break-after:avoid}
 .print-only p,.print-only li{orphans:3;widows:3}.print-only a{overflow-wrap:anywhere}
}
`;
