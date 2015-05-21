/*
 * TESTS - PROTRACTOR 
 */

 // webdriver-manager start 
 // protractor test/conf.js


var enterRoom = function (roomName) {
  element(by.model('room.name')).sendKeys(roomName);
  element(by.id('enterRoom')).click();
};

var newPost = function (text) {
  element(by.model('post.body')).sendKeys(text);
  $('#publishPost').click();
  browser.sleep(500);
}

var vote = function(post, direction) {
  var button = post.element(by.css(direction));
  button.click();
  browser.sleep(250);
  button.click();
  browser.sleep(250);
}


describe('Home Page', function() {
  beforeEach(function() {
    browser.get('http://localhost:1337/');
  });

  it('should have the correct title', function() {
    expect(browser.getTitle()).toEqual('Question Queue');
  });

  it('should accept a room hashtag', function() {
    enterRoom("GeneralAssembly");
    element(by.id('roomName')).getAttribute('value')
      .then(function(val) {
        expect("#" + val).toEqual('#GeneralAssembly');
      })
  });

  // it('should increment the number of people in the room', function() {
  //   enterRoom("GeneralAssembly");
  //   element(by.binding('people_count')).getText()
  //     .then(function(val) {
  //       expect(parseInt(val)).toEqual(1)
  //     });
  // });

  it('should accept a new post', function() {
    enterRoom("GeneralAssembly");
    var text = 'Test Post ' + Math.random().toString();
    newPost(text);
    var first = element.all(by.repeater('post in posts')).first().element(by.binding('post.body'));
    // console.log(first.getText());
    expect(first.getText()).toEqual(text)
  });
});

describe('voting', function() {
  beforeEach(function() {
    browser.get('http://localhost:1337/');
    enterRoom("GeneralAssembly");
    var text = 'Test Post ' + Math.random().toString();
    newPost(text);
  });

  it('should allow voting up just once', function() {
    var post = element.all(by.repeater('post in posts')).first();
    vote(post, ".vote_up")
    post.element(by.binding('post.votes_count')).getText()
      .then(function(val) {
        expect(parseInt(val)).toEqual(1)
        // after voting up it will equal one
      });
  });

  it('should allow voting down just once and be -1', function() {
    var post = element.all(by.repeater('post in posts')).first();
    vote(post, ".vote_down")
    post.element(by.binding('post.votes_count')).getText()
      .then(function(val) {
        expect(parseInt(val)).toEqual(-1)
      });
  });
})

// describe("sorting by newest or votes", function() {
  //   beforeEach(function() {
  //     browser.get('http://localhost:1337/');
  //     enterRoom("GeneralAssembly");
  //   });
// });

// describe("moderation", function() {
//   beforeEach(function() {
//     browser.get('http://localhost:1337/');
//     enterRoom("GeneralAssembly");
//   });

//   it('should remove post if -5 votes', function() {
//     var text = 'Test Post ' + Math.random().toString();
//     newPost(text);
//     var post = element.all(by.repeater('post in posts')).first();
//     vote(post, ".vote_down")
//     post.element(by.binding('post.votes_count')).getText()
//       .then(function(val) {
//         expect(parseInt(val)).toEqual(-5)
//         // if it is 1, after voting down, it will be 0, but should be -1
//       });
//   });
// })