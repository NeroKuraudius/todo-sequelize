'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Todos','UserId',{
      type:Sequelize.INTEGER,
      allowNull:false,
      // foreign key 設定
      references:{
        model:'Users',
        key:'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Todos','UserId')
  }
};
