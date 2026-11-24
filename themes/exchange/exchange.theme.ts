// The exchange theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in exchange.settings.json and the generated exchange.settings.ts;
// change them with `astryx experimental theme editor set exchange ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {exchangeSettings} from './exchange.settings';

export const exchangeTheme = defineTheme({
  extends: exchangeSettings,
  name: 'exchange',
});
