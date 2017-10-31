var socket = io.connect('/'), 
    tweets = document.getElementById('tweets');

socket.on('tweet', function(data) {
    var pictureURL = data.user.profile_image_url;
    var name = data.user.name;
    var handle = data.user.screen_name;
    var time = data.created_at;
    var text = data.text;
    var tweetURL = `https://twitter.com/${handle}/status/${data.id}`;

    var tweetHTML = `<div class="card-body">
        <img src="${pictureURL}" alt="profile image" />
        <strong>${name}</strong>
        <span class="light">@${handle} -
            <span class="time">${time}</span>
        </span>
        <br/> ${text}
        <br/>
        <a href="#">link</a>
        <div class="summary">
            <a href="${tweetURL}"><i class="fa fa-file-o"></i> View Full Tweet</a>
        </div>
    </div>`;

    console.log("HTML: " + tweetHTML);

    tweets.innerHTML = tweets.innerHTML + '<br>' + tweetHTML;
});