const sharp     = require('sharp');
//banner
sharp('./banner-logo.png').resize(256,256,{fit:'cover'}).toFile('./banner-logo-large.png');
sharp('./banner-logo.png').resize(128,128,{fit:'cover'}).toFile('./banner-logo-medium.png');
sharp('./banner-logo.png').resize(50,50,{fit:'cover'}).toFile('./banner-logo-small.png');
sharp('./banner-logo.png').resize(256,256,{fit:'cover'}).webp({lossless: true}).toFile('./banner-logo-large.webp');
sharp('./banner-logo.png').resize(128,128,{fit:'cover'}).webp({lossless: true}).toFile('./banner-logo-medium.webp');
sharp('./banner-logo.png').resize(50,50,{fit:'cover'}).webp({lossless: true}).toFile('./banner-logo-small.webp');

//background
sharp('./background-logo.png').resize(1024,1024,{fit:'cover'}).toFile('./background-logo-large.png');
sharp('./background-logo.png').resize(768,768,{fit:'cover'}).toFile('./background-logo-medium.png');
sharp('./background-logo.png').resize(480,480,{fit:'cover'}).toFile('./background-logo-small.png');
sharp('./background-logo.png').resize(1024,1024,{fit:'cover'}).webp({lossless: true}).toFile('./background-logo-large.webp');
sharp('./background-logo.png').resize(768,768,{fit:'cover'}).webp({lossless: true}).toFile('./background-logo-medium.webp');
sharp('./background-logo.png').resize(480,480,{fit:'cover'}).webp({lossless: true}).toFile('./background-logo-small.webp');

//redtiger
sharp('./redtiger.png').resize(1024,1024,{fit:'cover'}).toFile('./redtiger-large.png');
sharp('./redtiger.png').resize(768,768,{fit:'cover'}).toFile('./redtiger-medium.png');
sharp('./redtiger.png').resize(480,480,{fit:'cover'}).toFile('./redtiger-small.png');
sharp('./redtiger.png').resize(1024,1024,{fit:'cover'}).webp({lossless: true}).toFile('./redtiger-large.webp');
sharp('./redtiger.png').resize(768,768,{fit:'cover'}).webp({lossless: true}).toFile('./redtiger-medium.webp');
sharp('./redtiger.png').resize(480,480,{fit:'cover'}).webp({lossless: true}).toFile('./redtiger-small.webp');
