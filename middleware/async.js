module.exports = function asyncMiddleware(handler) {
  // i want to bring back the srtucture of function to it's place so 
  // when define function with this argument ,i mean that i want to return express it's function with function i send with try and catch expcession
  return async (req, res, next) => { // this argument for express it's argument just like this
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
