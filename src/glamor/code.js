// Based on prism.js okaidai theme
import { css } from 'glamor';

css.global('code[class*="language-"],pre[class*="language-"]', {
  color: '#f8f8f2',
  background: 'none',
  textShadow: '0 1px rgba(0, 0, 0, 0.3)',
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  lineHeight: 1.5,
  tabSize: 4,
  hyphens: 'none',
});

css.global('pre[class*="language-"]', {
  padding: '1em',
  margin: '.5em 0',
  overflow: 'auto',
});

css.global(':not(pre) > code[class*="language-"], pre[class*="language-"]', {
  background: '#272822',
});

css.global(':not(pre) > code[class*="language-"]', {
  padding: '.1em',
  whiteSpace: 'normal',
});

css.global('.token.comment, .token.prolog, .token.doctype, .token.cdata', {
  color: 'slategray',
});

css.global('.token.punctuation', {
  color: '#f8f8f2',
});

css.global('.namespace', {
  opacity: '.7',
});

css.global('.token.property, .token.tag, .token.constant, .token.symbol, .token.deleted', {
  color: '#f92672',
});

css.global('.token.boolean, .token.number', {
  color: '#ae81ff',
});

css.global('.token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted', {
  color: '#a6e22e',
});

css.global('.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string, .token.variable', {
  color: '#f8f8f2',
});

css.global('.token.atrule, .token.attr-value, .token.function', {
  color: '#e6db74',
});

css.global('.token.keyword', {
  color: '#66d9ef',
});

css.global('.token.regex, .token.important', {
  color: '#fd971f',
});

css.global('.token.important, .token.bold', {
  fontWeight: 'bold',
});

css.global('.token.italic', {
  fontStyle: 'italic',
});

css.global('.token.entity', {
  cursor: 'help',
});
