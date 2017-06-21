const typeValidator = {
  get(obj, prop) {
    if (obj[prop]) {
      return prop;
    } else {
      throw new TypeError(`${prop} is not a valid action type`);
    }
  }
}

module.exports = (types) => new Proxy(types, typeValidator);