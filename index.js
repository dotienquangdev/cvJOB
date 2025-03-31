const express = require('express');
const path = require('path');
var methodOverride = require('method-override') /// import PATH PUSH ....
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");

require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");
// Server-side (hay Server-side rendering - SSR) đang code theo kiểu này , mỗi lần nó phải load lại web
// Single Page Application (SPA) học ở fontEnd ko cần lòa lại web giống web Youtobe
// npm i nodemailer gui OTP ve email

const database = require("./config/database.js");
const systemConfig = require("./config/system.js");
const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js");

database.connect();

const app = express();
const port = process.env.PORT;

//socketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// io.on('connection', (socket) => {
//     console.log('a user connected', socket.id);
// });

//end soclet


app.use(methodOverride("_method"));

//parse application/x-www-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// app.set('views', './views'); // // file cũ của monggodb app 

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//tinyMCE
app.use('/tinymce',
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

//Flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// App Locals Variables
// app.locals tạo ra biến toàn cục 
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
console.log(__dirname);
// file cũ của monggodb app thì để bên dưới
// app.use(express.static("public"));

app.use(express.static(`${__dirname}/public`));

//Routes
routeAdmin(app);
route(app);



app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`Example app listening on post ${port}`)
});