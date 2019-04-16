'use strict';
module.exports = (sequelize, DataTypes) => {
    const Order_products = sequelize.define('Order_products', {
        number: DataTypes.STRING,
        orderId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER
    }, {});
    Order_products.associate = function (models) {
        models.Order_products.belongsTo(models.Order);
        models.Order_products.belongsTo(models.Product);
    };
    return Order_products;
};
