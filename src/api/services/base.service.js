class BaseService {

  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.$repo = {};
    this.$error = {};
  }

}

module.exports = BaseService;