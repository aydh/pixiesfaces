const instarow = document.getElementById('insta');

var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:9999/.netlify/functions/instagram', true);
request.onload = function () {

  // Begin accessing JSON data here
  var insta = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    for (let image of insta.data) {
    //insta.data.forEach(image => {
      if (image.media_type === 'VIDEO') continue;
      
      const div1 = document.createElement('div');
      div1.setAttribute('class', 'col-md-4 col-sm-6 col-xxs-12');
      instarow.appendChild(div1);

      const a = document.createElement('a');
      a.setAttribute('class', 'pixies-project-item image-popup to-animate');
      a.setAttribute('href', image.media_url);
      div1.appendChild(a);

      const img = document.createElement('img');
      img.setAttribute('class', 'img-responsive');
      img.setAttribute('alt', image.caption);
      img.setAttribute('src', image.media_url);
      a.appendChild(img);

      const div2 = document.createElement('div');
      div2.setAttribute('class', 'pixies-text');
      a.appendChild(div2);

      const h2 = document.createElement('h2');
      const captionArray = image.caption.split("#");
      h2.textContent = captionArray[0];
      div2.appendChild(h2);

      const div3 = document.createElement('div');
      div3.setAttribute('class', 'clearfix visible-sm-block');
      instarow.appendChild(div3);
    //});
    };
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send();