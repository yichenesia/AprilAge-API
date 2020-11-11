const fs = require('fs');

exports.seed = async (knex) => {
  const deleteDataSql = fs.readFileSync(`${__dirname}/sqlFiles/ClearData.sql`).toString();
  const testDataSql = fs.readFileSync(`${__dirname}/sqlFiles/TestData.sql`).toString();

  try {
    await knex.raw(deleteDataSql);
    await knex.raw(testDataSql);

    console.log('done seeding');

    return ;
  } catch(err) {
    throw err;
  }
};
