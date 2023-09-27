function fromMarkdown(opts = {}) {
  const permalinks = opts.permalinks || [];
  const defaultPageResolver = name => [name.replace(/ /g, '_').toLowerCase()];
  const pageResolver = opts.pageResolver || defaultPageResolver;
  const wikilinkClassName = opts.wikilinkClassName || 'wikilink';
  const defaultHrefTemplate = permalink => `${permalink}`;
  const hrefTemplate = opts.hrefTemplate || defaultHrefTemplate;

  function enterWikilink(token) {
    this.enter(
      {
        type: 'wikilink',
        value: null,
        data: {
          alias: null,
          permalink: null,
          exists: null,
        },
      },
      token,
    );
  }

  function top(stack) {
    return stack[stack.length - 1];
  }

  function exitWikilinkAlias(token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack);
    current.data.alias = alias;
  }

  function exitWikilinkTarget(token) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack);
    current.value = target;
  }

  function exitWikilink() {
    // const node = this.stack.pop();
    // const open = this.tokenStack.pop();
    // console.log('node', node);
    // console.log('open', open);
    // const wikilink = { ...this.stack[this.stack.length - 1] };
    // console.log(this.stack.pop());
    // console.log(this.tokenStack.pop());
    // const pagePermalinks = pageResolver(wikilink.value);
    // let permalink = pagePermalinks.find(p => permalinks.indexOf(p) !== -1);
    // const exists = permalink !== undefined;
    // if (!exists) {
    //   permalink = pagePermalinks[0];
    // }
    // let displayName = wikilink.value;
    // if (wikilink.data.alias) {
    //   displayName = wikilink.data.alias;
    // }
    //
    // const classNames = wikilinkClassName;
    // // if (!exists) {
    // //   classNames += ' ' + newClassName;
    // // }
    //
    // wikilink.data.alias = displayName;
    // wikilink.data.permalink = permalink;
    // wikilink.data.exists = exists;
    //
    // wikilink.data.hName = 'a';
    // wikilink.data.hProperties = {
    //   className: classNames,
    //   href: hrefTemplate(permalink),
    // };
    // wikilink.data.hChildren = [
    //   {
    //     type: 'text',
    //     value: displayName,
    //   },
    // ];
  }

  return {
    enter: {
      wikilink: enterWikilink,
    },
    exit: {
      wikilinkTarget: exitWikilinkTarget,
      wikilinkAlias: exitWikilinkAlias,
      wikilink: exitWikilink,
    },
  };
}

export default fromMarkdown;
