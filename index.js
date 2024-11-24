import "dotenv/config";
import app from "./src/app.js";
import { PORT } from "./src/constants/constants.js";

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
