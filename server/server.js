'use strict';

const express = require( "express" );

  
  /* express setup */
const port = 3001;
const app = new express();

app.use(express.json());





/*** APIs ***/



/*** End APIs ***/

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });