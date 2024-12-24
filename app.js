const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');



const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){

    res.sendFile(__dirname + "/index.html");
    
    // res.send("server is up and running.");    //we should have single send() in get() method
})


app.post("/", function (req, res) {
    const query = req.body.cityName;
    const appKey = process.env.API_KEY;
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + appKey;
    https.get(url, function (response) {
        console.log(response);

        response.on("data", function (data) {
            const weatherReport = JSON.parse(data);
            const desc = weatherReport.weather[0].description;
            const temp = weatherReport.main.temp;
            const icon = weatherReport.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Weather Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #e3f2fd;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .weather-container {
                            text-align: center;
                            background: #ffffff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            max-width: 400px;
                        }
                        .weather-container h1 {
                            font-size: 24px;
                            color: #333333;
                        }
                        .weather-container p {
                            font-size: 16px;
                            color: #555555;
                        }
                        .weather-container img {
                            margin-top: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="weather-container">
                        <h1>The temperature in ${query} is ${temp}&deg;C</h1>
                        <p>Weather description: ${desc}</p>
                        <img src="${imgUrl}" alt="Weather Icon">
                    </div>
                </body>
                </html>
            `);

            res.send();
        });
    });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});