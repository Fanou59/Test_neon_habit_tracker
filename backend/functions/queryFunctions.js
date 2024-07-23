import { executeQuery } from "./functions.js";

export const getData = async (request, reply) => {
  try {
    const result = await executeQuery("SELECT * FROM habits_tracker");
    return result;
  } catch (err) {
    reply.status(500).send(err);
  }
};

export const createHabit = async (request, reply) => {
  const { name } = request.body;
  const today = new Date().toISOString().split("T")[0];
  const checkedHabit = false;
  try {
    const result = await executeQuery(
      "INSERT INTO habits_tracker (name, date, checked) VALUES ($1, $2, $3) RETURNING *",
      [name, today, checkedHabit]
    );
    return result;
  } catch (err) {
    reply.status(500).send(err);
  }
};

export const deleteHabit = async (request, reply) => {
  // il manque la vérification que l'ID est bien trouvé dans la dB
  const id = request.params.id;
  try {
    const result = await executeQuery(
      "DELETE FROM habits_tracker WHERE id=$1",
      [id]
    );
    return reply.status(200).send({ message: "Habits deleted" });
  } catch (err) {
    reply.status(500).send(err);
  }
};
