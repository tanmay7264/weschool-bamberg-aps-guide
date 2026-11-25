export default `
.flow-experience{min-width:0;container-type:inline-size}
.flow-experience .flow-workspace{display:grid;grid-template-columns:minmax(0,1fr) 19rem;gap:var(--spacing-5);align-items:start}
@container(max-width:64rem){.flow-experience .flow-workspace{grid-template-columns:minmax(0,1fr)}}
.map-detail{min-width:0}
.map-viewport{width:100%;max-height:70svh;overflow:auto;overscroll-behavior:contain;isolation:isolate;background:var(--color-background-muted);border-radius:var(--radius-container);scrollbar-gutter:stable}
.map-viewport:focus-visible{outline:var(--border-width) solid var(--color-text-accent);outline-offset:calc(-1 * var(--spacing-1))}
.journey-map{display:block;flex:none;width:calc(100% * var(--map-zoom));min-width:calc(44rem * var(--map-zoom));height:auto;padding:var(--spacing-4);overflow:visible;transform-origin:50% 45%;transition:transform .5s ease}
.has-depth .journey-map{transform:perspective(90rem) rotateX(20deg) rotateZ(-.7deg)}
.map-floor-depth{fill:var(--color-border);stroke:var(--color-border-emphasized);stroke-width:1}
.map-viewport:not(.has-depth) .map-floor-depth{display:none}
.map-floor{fill:var(--color-background-surface);stroke:var(--color-border);stroke-width:1}
.map-floor-grid{fill:none;stroke:var(--color-border);stroke-dasharray:3 9}
.map-chapter{font:700 .875rem var(--font-family-body);letter-spacing:.09em;fill:var(--color-text-secondary)}
.map-edge{fill:none;stroke:var(--color-text-secondary);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round}
.map-edge.is-active{stroke:var(--color-text-accent);stroke-width:4}
.exemption-edge{stroke:var(--color-text-warning);stroke-dasharray:7 7}
.return-edge{stroke:var(--color-text-warning);stroke-dasharray:5 8;opacity:.65}
.return-edge.is-active{stroke:var(--color-text-warning);opacity:1}
.has-motion .map-edge.is-active{stroke-dasharray:10 8;animation:route-flow 1.8s linear infinite}
.map-viewport:not(.has-motion) .journey-map,.map-viewport:not(.has-motion) .map-tile{transition:none}
.map-node{outline:none;cursor:pointer}
.map-tile{transition:transform .25s ease}
.has-depth .map-node:is(:hover,:focus-visible,.is-selected) .map-tile{transform:translateY(-7px)}
.node-depth{fill:var(--color-border);stroke:var(--color-border-emphasized);stroke-width:1;opacity:.9}
.map-viewport:not(.has-depth) .node-depth{display:none}
.node-face{fill:var(--color-background-surface);stroke:var(--color-border-emphasized);stroke-width:1.5}
.map-node.is-gate .node-face{stroke:var(--color-text-warning);stroke-width:2.5}
.map-node.is-selected .node-face,.map-node:focus-visible .node-face{stroke:var(--color-text-accent);stroke-width:4}
.map-node:hover .node-face{stroke:var(--color-text-accent);stroke-width:3}
.node-number-bg{fill:var(--color-background-muted)}
.node-number{font:700 1.25rem var(--font-family-body);fill:var(--color-text-accent)}
.node-owner{font:500 .75rem var(--font-family-body);fill:var(--color-text-secondary)}
.node-title{font:650 1.3125rem var(--font-family-body);fill:var(--color-text-primary)}
.done-dot{fill:var(--color-text-success)}
.done-check{fill:none;stroke:var(--color-background-surface);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.map-terminal{cursor:pointer;outline:none}
.terminal-face{fill:var(--color-background-surface);stroke:var(--color-text-warning);stroke-width:2;stroke-dasharray:6 4}
.map-terminal:is(:focus-visible,.is-selected) .terminal-face{stroke:var(--color-text-accent);stroke-width:4;stroke-dasharray:none}
.visa-terminal{stroke:var(--color-text-accent);stroke-dasharray:none}
.terminal-title{font:650 1.1875rem var(--font-family-body);fill:var(--color-text-primary)}
.terminal-copy,.map-footnote{font:400 .875rem var(--font-family-body);fill:var(--color-text-secondary)}
.edge-label{font:650 .75rem var(--font-family-body);letter-spacing:.03em;fill:var(--color-text-secondary)}
.return-hit{fill:var(--color-background-muted);stroke:var(--color-border);stroke-width:1}
.return-label{font:650 .75rem var(--font-family-body);fill:var(--color-text-warning);cursor:pointer}
.return-label:focus-visible{outline:var(--border-width) solid var(--color-text-accent)}
.map-inspector{min-width:0}
@keyframes route-flow{to{stroke-dashoffset:-36}}
@media(prefers-reduced-motion:reduce){.journey-map,.map-tile{transition:none}.has-motion .map-edge.is-active{animation:none}.has-depth .map-node:is(:hover,:focus-visible,.is-selected) .map-tile{transform:none}}
@media(max-width:40rem){.map-viewport{max-height:34rem}.journey-map{padding:var(--spacing-2)}}
`;
