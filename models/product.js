'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        categoryId:DataTypes.INTEGER,
        name: DataTypes.STRING,
        sort: DataTypes.INTEGER,
        price: DataTypes.DECIMAL(10, 2),
        stock: DataTypes.INTEGER,
        image: DataTypes.STRING,
        code: DataTypes.STRING,
        sale:DataTypes.BOOLEAN,
        excellent: DataTypes.BOOLEAN
    }, {});
    Product.associate = function (models) {
        models.Product.belongsTo(models.Category);
    };
    return Product;
};
