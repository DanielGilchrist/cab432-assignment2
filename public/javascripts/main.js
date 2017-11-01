var socket = io.connect('/'),
    tweets = document.getElementById('tweets');

socket.on('tweet', function (data) {
    var pictureURL = data.user.profile_image_url;
    var name = data.user.name;
    var handle = data.user.screen_name;
    var time = new Date(data.created_at).toLocaleString();
    var text = data.text;
    var tweetURL = `https://twitter.com/${handle}/status/${data.id}`;

    var tweetHTML = `<div class="card">
        <div class="card-body">
            <img src="${pictureURL}" alt="profile image" />
            <strong>${name}</strong>
            <span class="light">@${handle} -
                <span class="time">${time}</span>
            </span>
            <br/> ${text}
            <br/>
            <br/>
            <a href="#">link</a>
            <div class="summary">
                <a href="${tweetURL}"><i class="fa fa-file-o"></i> View Full Tweet</a>
            </div>
        </div>
    </div>`;

    tweets.innerHTML = tweets.innerHTML + '<br>' + tweetHTML;
});

socket.on('chart', function (positive, neutral, negative) {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
        'packages': ['corechart']
    });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.

    function drawChart() {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sentiment');
        data.addColumn('number', 'Count');
        data.addRows([
            ['Positive', positive],
            ['Neutral', neutral],
            ['Negative', negative]
        ]);

        // Set chart options
        var options = {
            'title': 'Live Tweet Sentiment',
            'width': 400,
            'height': 300
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart'));
        chart.draw(data, options);
    }
});

socket.on('word-cloud', function (entities) {
    $('#word-cloud').empty();
    d3.wordcloud()
    .size([800, 400])
    .selector('#word-cloud')
    .words(entities.words)
    .start();
});