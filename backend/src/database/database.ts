import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database/lab_management.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Enable foreign key support
    db.exec('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error("Could not enable foreign keys", err.message);
      } else {
        console.log("Foreign key support enabled.");
      }
    });
  }
});

export default db;
