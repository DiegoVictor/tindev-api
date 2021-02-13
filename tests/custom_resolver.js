module.exports = (request, options) => {
  if (request.search(/socket\.io/gi) > -1) {
    return `${options.rootDir}/mocks/socket.io.js`;
  }
  return options.defaultResolver(request, options);
};
