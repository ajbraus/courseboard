/*
 * TESTS- MOCHA, CHAI, ZOMBIE
 */


var enterRoom = function (roomName) {
  element(by.model('room.name')).sendKeys(roomName);
  element(by.id('enterRoom')).click();
};

describe('Home Page', function() {
  beforeEach(function() {
    browser.get('http://localhost:1337/');
  });

  it('should have the correct title', function() {
    expect(browser.getTitle()).toEqual('Question Queue');
  });

  it('should accept a room hashtag', function() {
    enterRoom("GeneralAssembly");
    var roomName = element(by.id('roomName')).getText()
    expect(roomName).toEqual('#GeneralAssembly');
    expect(roomName).not.toEqual('#generalassembly');
  });

  it('should accept a new post', function() {
    enterRoom("GeneralAssembly");
    var postTitle = 'Test Post ' + Math.random().toString();
    element(by.model('post.body')).sendKeys(postTitle);
    $('button').click();
    browser.sleep(500);
    var first = element.all(by.repeater('post in posts')).first().element(by.binding('post.body'));
    // console.log(first.getText());
    expect(first.getText()).toEqual(postTitle)
  });
});

var voteUp = function(index) {

}

var voteDown = function() {

}

describe('voting', function() {
  beforeEach(function() {
    browser.get('http://localhost:1337/');
  });

  it('should allow voting up only once', function() {
    enterRoom("GeneralAssembly");
    var post = element.all(by.repeater('post in posts')).first();
    var voteUpButton = post.element(by.css('.vote_up'));
    var voteCount = post.element(by.binding('post.votes_count')).getText()
      .then(function(val) {
        console.log(parseInt(val))
      }).then(function() {
        voteUpButton.click();
        browser.sleep(500);
        post.element(by.binding('post.votes_count')).getText().then(function(val) {
          console.log(voteCount)
          expect(parseInt(val)).toEqual(voteCount++)
        }
      )
    })
  });

  // it('should allow voting down', function() {
  //   enterRoom("GeneralAssembly");
  // });

})


// describe('angularjs homepage todo list', function() {
//   it('should add a todo', function() {
//     browser.get('http://www.angularjs.org');

//     element(by.model('todoList.todoText')).sendKeys('write a protractor test');
//     element(by.css('[value="add"]')).click();

//     var todoList = element.all(by.repeater('todo in todoList.todos'));
//     expect(todoList.count()).toEqual(3);
//     expect(todoList.get(2).getText()).toEqual('write a protractor test');
//   });
// });

// element(by.model('todoList.todoText')).sendKeys('write a protractor test');
// element(by.css('[value="add"]')).click();

// var todoList = element.all(by.repeater('todo in todoList.todos'));
// expect(todoList.count()).toEqual(3);
// expect(todoList.get(2).getText()).toEqual('write a protractor test');



// process.env.NODE_ENV = 'test';

// var app = require('../server')
//   , assert = require('chai').assert
//   , expect = require('chai').expect
//   , Browser = require('zombie')
//   , browser = new Browser();

// // Browser.localhost('example.com', 3001);

// before(function() {
//   // before ALL the tests, start our Express server (on a test port, 3001)
//   server = app.listen(3001);
// });

// describe('Loads pages', function(){
//   it('Google.com', function(done){
//     browser.visit("http://www.google.com", function () {
//       console.log(browser.text("title"))
//       expect(browser.text("title")).to.equal('ogle');
//       done();
//     });
//   });
// });

// describe('Visit home page', function() {
//   before(function(done) {
//     return browser.visit('/');
//   });

//   describe('Home Page', function() {
//     it('should show the home page', function() {
//       browser.assert.text('title', "Question Queue");
//     });
//   });

  // describe('Click link', function() {
  //   before(function() {
  //     return browser.clickLink('a[class"add"]')
  //       .then(function() {
  //         return browser.clickLink('#something-else');
  //       });
  //   });
  //   it('should something', function() {
  //     browser.assert.text('title', 'something');
  //   });
  // });
// });
// it("should show the home page to begin", function (done) {
//   browser.visit('/', function (browser) {
//     console.log(browser.assert.element('#blah'))
//     assert(true === true);
//     // done with test
//     done();
//   });
// });
// describe('User visits home page', function() {
//   browser.visit('/', function (){
//     it('should show the home page', function(done) {
//       assert.text('title', 'Question Queue');
//       done();
//     });
//   });
//   // it('should refuse empty room name');
// });
//   it('should show the home page', function(done) {
//     browser.assert.text('title', 'Question Queue');
//     done();
//   });

//   it('should refuse empty room name');
//   it('should refuse a room name < 3 characters');
//   it('should make room names case insensitive');

//   describe('submits room name', function() {
//     browser = new Browser();
//     before(function(done) {
//       browser
//         .fill('email',    'BoogerBrains')
//         .pressButton('Sign Me Up!', done);
//     });

//     it('should be successful', function() {
//       browser.assert.success();
//     });

//     it('should see welcome page', function() {
//       browser.assert.text('title', 'Question Queue');
//     });
//   });

//   it('should be successful', function() {
//     browser.assert.success();
//   });

//   it('should see room', function() {
//     browser.assert.text('title', 'Welcome To Brains Depot');
//   });
// })

// describe('voting', function() {
//   browser = new Browser();
//   it('should accept only one vote up or down');
// });

// after(function() {
//     // after ALL the tests, close the server
//     app.close();
// });