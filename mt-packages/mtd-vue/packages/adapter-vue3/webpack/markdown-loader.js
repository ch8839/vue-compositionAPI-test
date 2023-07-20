const path = require('path')
const md = require('markdown-it')();

function wrap (render) {
  return function () {
    return render.apply(this, arguments)
      .replace('<code v-pre class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">');
  };
}

function getComponentName (path) {
  const pathName = path.replace(/\.[a-z]+$/, '') // 移除后缀
    .match(/\w+/g).join('-');
  if (!pathName.includes('demo')) {
    return camelCase(`demo-${pathName}`);
  }
  return camelCase(pathName);
}

function camelCase(str){
  let strArr = str.split('-');
  for(let i = 1; i < strArr.length; i++){
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
  }
  strArr = strArr.join('').split('/');
  for(let i = 1; i < strArr.length; i++){
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
  }
  return strArr.join('');
}

function parseRef(str) {
  const result = str[1].match(/([@_a-zA-Z]+)(\s+|=|$)("[^"]+"*|\d+|true|false)?/g);
  const ret = {};
  if (result.length) {
    result.forEach((item) => {
      const r = item.split('=');
      ret[r[0]] = r.length > 1 ? eval(r[1]) : true;
    })
  }
  return ret;
}

const resolveMds = {};

const markdownLoader = [{
  loader: 'vue-loader',
}, {
  loader: 'vue-markdown-loader/lib/markdown-compiler',
  options: {
    raw: true,
    preventExtract: true,
    use: [
      [require('markdown-it-anchor'), {
        level: [2, 3],
        permalink: true,
        permalinkBefore: false,
        permalinkSymbol: '#',
        permalinkClass: 'anchor',
      }],
      [require('markdown-it-container'), 'demo', {
        validate (params) {
          return params.trim().match(/^demo\s*(.*)$/);
        },
        render (tokens, idx) {
          const token = tokens[idx];
          const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/) || '';
          const description = (m && m.length > 1) ? m[1] : '';
          const descriptionHTML = description ? md.render(description) : '';
          if (token.nesting === 1) {
            const content = tokens[idx + 1].content;
            return `<demo-block>
                <template v-slot:source>${content}</template>
                ${descriptionHTML}
                <template v-slot='highlight'><div class='highlight'>
            `;
          }
          return '</div></template></demo-block>\n';
        },
      }],
      [require('markdown-it-container'), 'include', {
        validate: function validate(params) {
          return params.trim().match(/^include\s*(.*)$/);
        },

        render: function render(tokens, idx) {
          const curToken = tokens[idx];
          const m = curToken.info.trim();
          const paramText = m.match(/^include\s*\(([^()]*?)\)/) || '';
          if (curToken.nesting === 1) {
            let description = '';
            let params = {};
            if (paramText && paramText.length > 1) {
              params = parseRef(paramText);
            }

            let content = tokens[idx + 1].content;

            if (params.src) {
              const mdcname = getComponentName(params.src);
              const reg = /[A-Z]/g;
              const realMdcname = mdcname.replace(reg,function(m){return '-' + m.toLowerCase()})
              return `<${realMdcname}></${realMdcname}>`;
            } else {
              throw new Error('include container must has src param');
            }
          }
          return '</div></demo-block>\n';
        },
      }],
    ],
    preprocess: function preprocess(MarkdownIt, source) {
      MarkdownIt.renderer.rules.table_open = () => '<table class="table">';
      MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence);
      MarkdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const href = token.attrGet('href');
        if (/^[http|https]/.test(href) || /^\/\//.test(href)) {
          // abs path
          token.attrPush(['target', '_blank'])
        } else if (/^\//.test(href)) {
          // relative path
          const to = publicPath !== '/' ? `${publicPath}${href}` : href;
          token.attrSet('href', '');
          token.attrPush(['to', to]);
          token.tag = 'router-link';
        } else if (/^#/.test(href)) {
          // // anchor
          // token.attrSet('href', '');
          token.attrPush([':to', `{ ...$route, hash: "${decodeURIComponent(href)}" }`]);
          token.tag = 'router-link';
        }
        return self.renderToken(tokens, idx, options);
      }
      // MarkdownIt.renderer.rules.link_close = function (tokens, idx, options, env, self) {

      // }
      const resourcePath = this.resourcePath;
      if (resolveMds[resourcePath]) {
        return source;
      }
      const filePath = resourcePath.replace(/\/?[^/]*$/, '');
      const matches = source.match(/:::\s*include\s*\(([^()]*?)\)[\s\S]*?:::/g) || '';
      const scripts = [];
      const components = [];
      if (matches) {
        matches.forEach((match, index) => {
          const _match = match.match(/:::\s*include\s*\(([^()]*?)\)/) || '';
          const params = parseRef(_match);
          if (params.src) {
            const mdcname = getComponentName(params.src);
            const mdpath = path.join(filePath, params.src);
            resolveMds[mdpath] = true;
            source = source.replace(match, match.replace(/(:::\s*include\s*\(([^()]*?)\)[\s\S]*?)(:::)/, function (s, a, b ,c) {
              return a.replace(b, `${b} resolve="${mdpath}"`) + c;
            }));
            scripts.push(`import ${mdcname} from "${path.join(filePath, params.src)}"`);
            components.push(mdcname);
          }
        })
      }

      source =
        (scripts.length ?
        `<script>
          ${scripts.join('\n')};
          import { defineComponent } from 'vue';
          export default defineComponent({
            components: {${components.length && components.join(',')}},
          })
        </script>\n` : '') + source;
      return source;
    },
  },
}]

module.exports = markdownLoader
