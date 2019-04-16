'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: DataTypes.STRING,
        sort: DataTypes.INTEGER,
    }, {});
    Category.associate = function (models) {
        models.Category.hasMany(models.Product);
    };
    return Category;
};
