import express from "express";
import config from "./config/index.js";
import { connectDB } from "./db/index.js";
import AdminRouter from "./routes/admin.route.js";
import { createSuperAdmin } from "./db/create-superadmin.js";
import CategoryRouter from "./routes/category.route.js";
import SalesmanRouter from "./routes/salesman.route.js";
import ProductRouter from "./routes/product.route.js";
import ClientRouter from "./routes/client.route.js";
import SolidProductRouter from "./routes/solidProduct.route.js";

const app = express();

app.use(express.json());

await connectDB();
await createSuperAdmin();

app.use("/admin", AdminRouter);
app.use("/category", CategoryRouter);
app.use("/salesman", SalesmanRouter);
app.use("/product", ProductRouter);
app.use("/client", ClientRouter);
app.use("/soldproduct", SolidProductRouter);

app.listen(config.PORT, () =>
  console.log(`Server is running on port http://localhost:${config.PORT}`)
);
