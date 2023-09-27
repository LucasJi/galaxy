import fromMarkdown from './fromMarkdown';
import syntax from './syntax';

// import toMarkdown from './toMarkdown';

function wikilinkPlugin(opts = { markdownFolder: 'page' }) {
  const data = this.data();

  function add(field, value) {
    if (data[field]) {
      data[field].push(value);
    } else {
      data[field] = [value];
    }
  }

  opts = {
    ...opts,
  };

  add('micromarkExtensions', syntax(opts));
  add('fromMarkdownExtensions', fromMarkdown(opts));
  // TODO: toMarkdown extension seems doesn't work
  // add('toMarkdownExtensions', toMarkdown(opts));
}

export default wikilinkPlugin;
export {
  wikilinkPlugin,
  fromMarkdown as fromMarkdownWikilink,
  // toMarkdown,
  syntax,
};
