'use strict';

import app from './src/app.js';

const port = process.env.PORT || 3001;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
