'use strict';
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root', email: 'root@exampale.com', password: '12345678'
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    // bulkInsert: 大量資料寫入
    return queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      // hashSync: hash的同步版本，genSaltSync亦同
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
      .then(userId => queryInterface.bulkInsert('Todos',
        Array.from({ length: 10 }).map((_, i) => ({
          name: `name-${i}`,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {}))
  },
  // bulkDelete: 多筆資料刪除
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Todos', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}))
  }
};
