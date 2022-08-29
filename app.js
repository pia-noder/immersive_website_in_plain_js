import "dotenv/config";

process.env.PRISMIC_ENDPOINT;

//express server => backend (toutes les vues/views seront construite dans le back)
import express from "express";
import errorHandler from "errorhandler";
import logger from "morgan";
import bodyParser from "body-parser";
import methodOverride from "method-override";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;

// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
import UAParser from "ua-parser-js";
import * as prismicH from "@prismicio/helpers";
import PrismicDOM from "prismic-dom";
import { client } from "./config/prismicConfig.js";
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };
  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "";
  };
  next();
});

const handleLinkResolver = (doc) => {
  if (doc.type === "product") {
    return `/detail/${doc.slug}`;
  }

  if (doc.type === "collections") {
    return "/collections";
  }

  if (doc.type === "about") {
    return "/about";
  }

  return "/";
};

app.use((req, res, next) => {
  const ua = UAParser(req.headers["user-agent"]);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === "mobile";
  res.locals.isTablet = ua.device.type === "tablet";

  res.locals.Link = handleLinkResolver;

  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "";
  };

  res.locals.PrismicDOM = PrismicDOM;

  next();
});
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// Servir scss file on express/server side
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const home = await client.getSingle("home");
  const meta = await client.getSingle("meta");
  const collections = await client.getAllByType("collection", {
    fetchLinks: "product.image",
  });
  const navigation = await client.getSingle("navigation");
  const preloader = await client.getSingle("preloader");

  res.render("pages/home", { home, meta, collections, navigation, preloader });
});

app.get("/about", async (req, res) => {
  const document = await client.getSingle("about");
  const meta = await client.getSingle("meta");
  const navigation = await client.getSingle("navigation");
  const preloader = await client.getSingle("preloader");

  res.render("pages/about", { document, meta, navigation, preloader });
});

app.get("/collections", async (req, res) => {
  //const meta = await client.getSingle('meta')
  const home = await client.getSingle("home");
  const meta = await client.getSingle("meta");
  const collections = await client.getAllByType("collection", {
    fetchLinks: "product.image",
  });
  const navigation = await client.getSingle("navigation");
  const preloader = await client.getSingle("preloader");

  res.render("pages/collections", {
    home,
    meta,
    collections,
    navigation,
    preloader,
  });
});

app.get("/product/:uid", async (req, res) => {
  const meta = await client.getSingle("meta");
  const product = await client.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });
  const navigation = await client.getSingle("navigation");
  const preloader = await client.getSingle("preloader");

  res.render("pages/product", { meta, product, navigation, preloader });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
