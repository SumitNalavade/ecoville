const express = require('express');
const path = require('path');
const categoriesData = require('./categoriesData.json');

const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.json());
app.use(express.static('public'))
const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
    console.log(`Express app listening on port ${PORT}`)
})

app.get("/", (req, res) => {
    res.render("homepage.ejs", {
        categoryData : categoriesData["homepage"]
    });
})

app.get("/:category", (req, res) => {
    const { category } = req.params;

    if(categoriesData[category]) {
        res.render("category.ejs", {
            category : category,
            categoryData : categoriesData[category]
        });
    } else {
        res.render("error.ejs");
    }
})