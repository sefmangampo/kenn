const fs = require("fs");
const path = require("path");
const connection = require("../../config/dbConfig");

const readSqlFiles = (filePath) => {
  return fs.readFileSync(path.join(__dirname, "migrations", filePath), "utf-8");
};

const readSqlFilesFromDirectory = (directoryPath) => {
  const sqlFiles = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".sql"));
  return sqlFiles.map((file) => path.basename(file));
};

const executeSqlScript = (script, callback) => {
  connection.getConnection((err, con) => {
    if (err) {
      return callback(err);
    }
    con.query(script, (error, results) => {
      con.release();

      if (error) {
        return callback(error);
      }

      callback(null, results);
    });
  });
};

const isMigrationApplied = (migrationFile, callback) => {
  connection.getConnection((err, con) => {
    if (err) {
      return callback(err);
    }

    const query =
      "SELECT COUNT(*) AS count FROM schema_migrations WHERE migration = ? ";
    con.query(query, [migrationFile], (error, results) => {
      con.release();

      if (error) {
        return callback(error);
      }

      callback(null, results[0].count > 0);
    });
  });
};

const markMigrationAsApplied = (migration, callback) => {
  connection.getConnection((err, con) => {
    if (err) {
      return callback(err);
    }

    const query = "INSERT INTO schema_migrations (migration) VALUES (?)";

    con.query(query, [migration], (err, results) => {
      con.release();
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  });
};

const applyMigration = (migrationFile, callback) => {
  isMigrationApplied(migrationFile, (err, applied) => {
    if (err) {
      return callback(err);
    }

    if (applied) {
      console.log(`${migrationFile} is already applied`);
      return callback(null, "Already applied");
    }

    const script = readSqlFiles(migrationFile);
    executeSqlScript(script, (err, results) => {
      if (err) {
        return callback(err);
      }

      markMigrationAsApplied(migrationFile, (err, results) => {
        if (err) {
          return callback(err);
        }

        console.log(`${migrationFile.name} applied successfully`);
        callback(null, "Applied successfully");
      });
    });
  });
};

exports.applyMigrations = (directoryPath, callback) => {
  const migrationScripts = readSqlFilesFromDirectory(directoryPath);

  let index = 0;
  const next = () => {
    if (index < migrationScripts.length) {
      applyMigration(migrationScripts[index], (err) => {
        if (err) {
          return callback(err);
        }
        index++;
        next();
      });
    } else {
      callback(null, "All migrations applied");
    }
  };
  next();
};

exports.testConnection = (callback) => {
  connection.getConnection((err, con) => {
    if (err) {
      console.error("error connecting to database", err);
      callback(err);
      return;
    }
    console.log("Connected to database");
    con.release();
    callback(null, true);
  });
};

exports.applyMigrations(path.join(__dirname, "migrations"), (err, result) => {
  if (err) {
    console.error("Error applying migrations:", err);
  } else {
    console.log(result);
  }
});
