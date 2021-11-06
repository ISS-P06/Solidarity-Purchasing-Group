'use strict';

import sqlite3 from 'sqlite3';

// open database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) throw err;
});

export default db;
