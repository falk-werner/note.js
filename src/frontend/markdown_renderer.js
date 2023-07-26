
function prefixLinksWith(prefix) {
  return {
    walkTokens(token) {
      if (!['link', 'image'].includes(token.type)) {
        return;
      }

      if (token.href.includes('://')) {
        return;
      }

      token.href = prefix + token.href;
    }
  };
}


function render(name, plainText) {

    const markedOptions = {
        mangle: false,
        headerIds: false
    };

    marked.marked.setOptions(markedOptions);
    marked.marked.use(prefixLinksWith(`local://${name}/`));

    return marked.marked(plainText);
}

export { render }