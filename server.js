const express = require('express');
const path = require('path');
const bodyParse = require('body-parser');
const {sequelize} = require('./models');
const app = express();
app.use(express.static(path.join(__dirname, './dist')));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
require('./router')(app)
//app.listen(3000, () => console.log("server has been stared on port 3000"));

//同步模型到数据库
sequelize.sync()
         .then(() => {
            console.log('database connect successful');
            app.listen(3000, () => console.log("server has been stared on port 3000"));
         })
         .catch(err => {
             console.log('database connect fail')
         })
        




