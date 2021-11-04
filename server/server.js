import app from "./src/app";

const port = 3001;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
