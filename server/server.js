'use strict';

import app from './src/app.js';
import { launchTelegramBot } from './src/telegram.js';

const port = process.env.PORT || 3001;

launchTelegramBot();

// activate the server
app.listen(port, () => {
  console.log(`==> Server listening at http://localhost:${port}`);
});
