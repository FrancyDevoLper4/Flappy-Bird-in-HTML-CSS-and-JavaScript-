const reset = document.getElementById("reset");

// run kaboom
kaboom();

// load assets

loadSprite("bird", "sprites/bird1.png");

//loadSprite("background", "sprites/background.png");

//loadSprite("background", "sprites/halloween.png");
//loadSprite("background", "sprites/pasqua.png");
// loadSprite("background", "sprites/estate.png");
// loadSprite("bird", "sprites/uccelloVeccchio.png");
loadSprite("background", "sprites/natale.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("hit", "audios/hit.ogg");
loadSound("point", "audios/point.ogg");
loadSound("wing", "audios/wing.ogg");

scene("game", () => {
  
  reset.style.display = "none";
  
  let score = 0;
  
  // background
  
  const bg = add([
    sprite("background", {width: width(), height: height()})
  ]);
  
  const scoreText = add([
    text(score),
    pos(20, 10),
    scale(0.5),
  ]);
  
  // bird
  const bird = add([
    sprite("bird"),
    pos(width()/7, height()/2),
    area(),
    body()
  ]);
  
  // down pipe
  function makePipes() {
    const pipeGap = rand(150, 180);
    const offset = rand(-80, 80);
    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + pipeGap / 2),
      origin("topleft"),
      area(),
      "pipe"
    ]);
    
    // up pipe
    add([
      sprite("pipe", {flipY: true}),
      pos(width(), height() / 2 + offset - pipeGap / 2),
      origin("botleft"),
      area(),
      "pipe",
      {passed: false}
    ]);
  }
  
  loop(2.5, () => {
    makePipes();
  });
  
  // move pipes
  onUpdate("pipe", (pipe) => {
    pipe.move(-100, 0);
    if (pipe.passed === false && pipe.pos.x < bird.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
      play("point");
    }
  });
  
  // bird touch the pipe
  bird.onCollide("pipe", () => {
    play("hit");
    go("Hai", score);
  });
  
  // lose if bird get over the screen
  bird.onUpdate(() => {
    if (bird.pos.y > height() + 30 || bird.pos.y < -30) {
      play("hit");
      go("hai perso mi dispiace riprova", score);
    }
  })
  
  // make bird jump
  window.onclick = () => {
    play("wing");
    bird.jump(450);
  };
  
  reset.onclick = () => {
    go("game");
  };
  
});

// game over scene
scene("hai perso mi dispiace riprova", (score) => {
  add([
  sprite("background", {width: width(), height: height()})
  ]);
  add([
    text("hai perso mi dispiace riprova"),
    pos(width() / 2, 100),
    origin("center"),
    scale(0.7),
    color(255, 50, 50)
  ]);
  add([
    text("Score: " + score),
    pos(width() / 2, 2),
    origin("center"),
    scale(0.4),
    color(0, 255, 0)
  ])
  reset.style.display = "block";
});

go("game");
