let instance = null;

class MockDB {
  constructor() {

    if(!instance){
      instance = this;
    }
    this.users = [];

    return instance;
  }

  async getUser(id) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.users[id];
  }

  async addUser(id,data){
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.users[id] = data;
    return true;
  }
}

module.exports = MockDB;