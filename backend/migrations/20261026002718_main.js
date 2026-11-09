/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
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
                t.text("bio");
                t.jsonb("skills").notNullable();
                t.text("token").unique();
                t.integer("id_role").notNullable().references("id").inTable("Roles").onUpdate("CASCADE").onDelete("CASCADE");
            })
        }
    } catch (error) {
        console.log(`Ошибка создания Users - ${error}`);
    }

    //Создание Conversations (Беседы в списке если отправили сообщение)
    try {
      exists = await knex.schema.hasTable("Conversations");

      if (!exists){
        await knex.schema.createTable("Conversations", (t) => {
          t.increments("id").primary();
          t.integer("id_userA").notNullable();
          t.integer("id_userB").notNullable();
          t.timestamp("last_message_at", {useTz:true});
        });
      }
    } catch (error) {
      console.log(`Ошибка создания Conversations - ${error}`);
    }

    //Создание ConversationsParticipants (Таблица с участниками для возможности очистки беседы только у себя.)
    //При начале диалога автоматически будут создаваться 2 записи с участниками и датой очистки диалога (если она была произведена)
    try {
      exists = await knex.schema.hasTable("ConversationsParticipants");

      if (!exists){
        await knex.schema.createTable("ConversationsParticipants", (t) => {
          t.increments("id").primary();
          t.integer("id_coversation").references("id").inTable("Conversations").onDelete("CASCADE").onUpdate("CASCADE");
          t.integer("id_user").notNullable().references("id").inTable("Users").onDelete("CASCADE").onUpdate("CASCADE");
          t.timestamp("cleared_at", {useTz: true})
        });
      }
    } catch (error) {
      console.log(`Ошибка создания ConversationsParticipants - ${error}`);
    }

    //Создание таблицы Messages
    try {
      exists = await knex.schema.hasTable("Messages");

      if (!exists){
        await knex.schema.createTable("Messages", (t) => {
          t.increments("id").primary();
          t.integer("id_conversation").notNullable().references("id").inTable("Conversations").onDelete("CASCADE").onUpdate("CASCADE");
          t.integer("id_sender").notNullable().references("id").inTable("Users").onDelete("CASCADE").onUpdate("CASCADE");
          t.text("message_text");
          t.timestamp("created_at", {useTz: true}).notNullable();
        });
      }
    } catch (error) {
      console.log(`Ошибка создания Messages - ${error}`);
    }

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {};
