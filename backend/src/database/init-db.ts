import db from './database';

const createUsersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN ('admin', 'staff', 'viewer')) NOT NULL DEFAULT 'staff',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(query, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
      return;
    }
    console.log('Users table created or already exists.');
  });
};

// Add more table creation functions here as needed for other features

const initializeDatabase = () => {
  console.log('Initializing database...');
  db.serialize(() => {
    createUsersTable();
    // Call other table creation functions here
    // Example: createPatientsTable();
    // Example: createTestsTable();
  });

  // Close the database connection if the script is run directly and is meant to be a one-off setup.
  // For a persistent connection used by the app, this close would be handled differently (e.g., on app shutdown).
  // For now, since this is an init script, we might not close it here if 'database.ts' is imported by the main app.
  // However, if this script is meant to be run standalone:
  // db.close((err) => {
  //   if (err) {
  //     console.error('Error closing database connection:', err.message);
  //   } else {
  //     console.log('Database connection closed.');
  //   }
  // });
  console.log('Database initialization process completed.');
};

// If running this script directly, e.g., `ts-node src/database/init-db.ts`
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase }; // Export if you want to call it from elsewhere
