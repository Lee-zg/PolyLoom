import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import EmbedPdfVueDemo from '../../src/components/EmbedPdfVueDemo.vue';
import ReactButtonHost from '../../src/components/ReactButtonHost.vue';
import VueButtonDemo from '../../src/components/VueButtonDemo.vue';
import Layout from './Layout.vue';
import '../../../../packages/theme/src/button.css';
import '../../../../packages/theme/src/embedpdf-vue.css';
import '../../../../packages/theme/src/tokens.css';
import './styles.css';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('EmbedPdfVueDemo', EmbedPdfVueDemo);
    app.component('ReactButtonHost', ReactButtonHost);
    app.component('VueButtonDemo', VueButtonDemo);
  },
} satisfies Theme;
