import app from "./app";
import 'colors';

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.bgMagenta.bold));