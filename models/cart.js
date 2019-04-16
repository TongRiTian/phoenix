'use strict';
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        number: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER
    }, {});
    Cart.associate = function (models) {
        models.Cart.belongsTo(models.User);
        models.Cart.belongsTo(models.Product);
    };
    return Cart;
};
