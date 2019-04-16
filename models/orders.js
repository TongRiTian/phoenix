'use strict';
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        status: DataTypes.INTEGER,
        out_trade_no: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }, {});
    Order.associate = function (models) {
        models.Order.hasMany(models.Order_products);
        models.Order.belongsTo(models.User);
    };
    return Order;
};
