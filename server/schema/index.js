import auth from "./auth.js";
import overview from "./overview.js";
import tracks from "./tracks.js";
import top from "./top.js";
import listeningHistory from "./listening-history.js";

export default function(app) {
  app.addSchema(auth);
  app.addSchema(overview);
  app.addSchema(tracks);
  app.addSchema(top);
  app.addSchema(listeningHistory);
}
