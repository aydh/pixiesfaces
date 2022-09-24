const sharp     = require('sharp');
//banner
sharp('./banner-logo.png').resize({width:100}).toFile('./banner-logo-large.png');
sharp('./banner-logo.png').resize({width:75}).toFile('./banner-logo-medium.png');
sharp('./banner-logo.png').resize({width:50}).toFile('./banner-logo-small.png');
sharp('./banner-logo.png').resize({width:100}).webp({lossless: true}).toFile('./banner-logo-large.webp');
sharp('./banner-logo.png').resize({width:75}).webp({lossless: true}).toFile('./banner-logo-medium.webp');
sharp('./banner-logo.png').resize({width:50}).webp({lossless: true}).toFile('./banner-logo-small.webp');

//background
sharp('./background-logo.png').resize({width:1280}).toFile('./background-logo-large.png');
sharp('./background-logo.png').resize({width:768}).toFile('./background-logo-medium.png');
sharp('./background-logo.png').resize({width:640}).toFile('./background-logo-small.png');
sharp('./background-logo.png').resize({width:1280}).webp({lossless: true}).toFile('./background-logo-large.webp');
sharp('./background-logo.png').resize({width:768}).webp({lossless: true}).toFile('./background-logo-medium.webp');
sharp('./background-logo.png').resize({width:640}).webp({lossless: true}).toFile('./background-logo-small.webp');

//redtiger
sharp('./redtiger.png').resize({width:1280}).toFile('./redtiger-large.png');
sharp('./redtiger.png').resize({width:768}).toFile('./redtiger-medium.png');
sharp('./redtiger.png').resize({width:640}).toFile('./redtiger-small.png');
sharp('./redtiger.png').resize({width:1024}).webp({lossless: true}).toFile('./redtiger-large.webp');
sharp('./redtiger.png').resize({width:768}).webp({lossless: true}).toFile('./redtiger-medium.webp');
sharp('./redtiger.png').resize({width:640}).webp({lossless: true}).toFile('./redtiger-small.webp');
