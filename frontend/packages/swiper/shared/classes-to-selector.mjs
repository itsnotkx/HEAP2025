function classesToSelector(classes) {
  if (classes === void 0) {
    classes = '';
  }
  return `.${classes.trim().replace(/([\.:!+\/])/g, '\\$1')  
  .replace(/ /g, '.')}`;
}

export { classesToSelector as c };
