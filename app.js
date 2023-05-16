const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get players api
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    select *
    from cricket_team
    order by player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//create player api
app.post("/players/", async (request, response) => {
  const { playerDetails } = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `
    insert into cricket_team (player_id,player_name,jersey_number,role)
    values ('${playerId}','${playerName}','${jerseyNumber}','${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//get player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerBasedOnPlayerId = `
    SELECT
     *
    FROM
     cricket_team
    WHERE
      player_id = ${playerId};`;
  const playerArray = await db.get(playerBasedOnPlayerId);
  response.send(playerArray);
});

//update player
app.put("/player/:playerId", async (request, response) => {
  const playerId = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const updatePlayer = `
    update cricket_team
    set
    player_name='${playerName}',
    jersey_number='${jerseyNumber}',
    role='${role}'
    where player_id=${playerId};
    `;
  await dp.run(updatePlayer);
  response.send("Player Details Updated");
});

//delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    delete from
    cricket_team
    where player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
