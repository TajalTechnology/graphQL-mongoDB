import utils from "../common/services/utils";
import { ApolloServer } from "apollo-server-express";
import { accesssOrigin } from "./common/utils/accessOrigin";
import { typeDefs, resolvers } from "./schemas/category.schema";

/* ----------------------------------- */
/* Initializing Express App */
/* ----------------------------------- */
var appLocals = {
    baseUri: "/api/",
    dirname: __dirname,
};

export var app: any = utils.initApp(appLocals);
app.use(accesssOrigin);

/* ----------------------------------- */
/* Loading pre-required local service */
/* ----------------------------------- */
utils.localService("mongoose", app);
utils.middleware("body-parser", app);
utils.localService("logger", app);

const startServer = async () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app });
    app.listen(process.env.PORT, () => {
        return console.log(
            `Express is listening at http://localhost:${process.env.PORT}`
        );
    });
};

startServer();
