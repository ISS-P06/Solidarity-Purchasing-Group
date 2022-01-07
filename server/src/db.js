'use strict';

import sqlite3 from 'sqlite3';
import { copyFileSync, unlinkSync } from 'fs';

export const dbPath = 'database.db';
export const backupPath = 'database.db.bak';

/**
 * Backup the state of the database.
 *
 * @param {string} path - Path of the backup file.
 */
export function doBackup(path = backupPath) {
  copyFileSync(dbPath, path);
}

/**
 * Restore the databse from it's backup.
 *
 * @param {string} path - Path of the backup to restore.
 */
export function restoreBackup(path = backupPath) {
  copyFileSync(path, dbPath);
}

/**
 * Delete a backup.
 *
 * @param {string} path - Path of the file to delete.
 */
export function deleteBackup(path = backupPath) {
  unlinkSync(path);
}

// During the test stage automatically do a backup of the clean database
if (process.env.NODE_ENV === 'test') {
  doBackup();
}

// open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) throw err;
});

export default db;
