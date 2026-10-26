/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  let exists = await knex.schema.hasTable("Roles");

  //Создание таблицы Roles
  try {
    if (!exists) {
      await knex.schema.createTable("Roles", (t) => {
        t.increments("id").primary();
        t.text("name").notNullable();
      });
    }
  } catch (error) {
    console.log(`Ошибка создания Roles - ${error}`);
  }

  //Заполнение Roles
  try {
    await knex("Roles").insert([
        {name: "Администратор"},
        {name: "Пользователь"}
    ])
  } catch (error) {
    console.log(`Ошибка заполнения Roles - ${error}`);
  }

    exists = await knex.schema.hasTable("Users");

    //Создание Users
    try {
        if (!exists){
            await knex.schema.createTable("Users", (t) => {
                t.increments("id").primary();
                t.text("login").notNullable().unique();
                t.text('password_hash').notNullable();
                t.integer("id_role").notNullable().references("id").inTable("Users").onUpdate("CASCADE").onDelete("CASCADE");
            })
        }
    } catch (error) {
        console.log(`Ошибка создания Users - ${error}`);
    }

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
