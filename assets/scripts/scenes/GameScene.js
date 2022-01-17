class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.createBackground();
    this.player = new Player(this);
    this.enemies = new Enemies(this);
    this.enemies.createEnemy();
    this.createCompleteEvents();
    this.addOverlap();
    this.createText();
    if (!this.sounds) {
      this.createSounds();
    }
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.score = 0;
  }

  update() {
    this.player.move();
    this.bg.tilePositionX += 0.5;
  }

  createSounds() {
    this.sounds = {
      boom: this.sound.add("boom", {
        volume: 0.1,
      }),
      theme: this.sound.add("theme", {
        volume: 0.1,
        loop: true,
      }),
    };

    this.sounds.theme.play();
  }

  createBackground() {
    this.bg = this.add
      .tileSprite(0, 0, config.width, config.height, "bg")
      .setOrigin(0);
  }

  addOverlap() {
    this.physics.add.overlap(
      this.player.fires,
      this.enemies,
      this.onOverlap,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.enemies.fires,
      this.player,
      this.onOverlap,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.enemies,
      this.player,
      this.onOverlap,
      undefined,
      this
    );
  }

  onOverlap(source, target) {
    const enemy = [source, target].find((item) => item.texture.key === "enemy");
    if (enemy) {
      this.sounds.boom.play();
      this.score++;
      this.timeoutText.setText("Score: " + this.score);
      this.boom = Boom.generate(this, enemy.x, enemy.y);
    }
    source.setAlive(false);
    target.setAlive(false);
  }

  createText() {
    this.timeoutText = this.add.text(50, 50, "Score: 0", {
      font: "40px CurseCasual",
      fill: "#fff",
    });
  }

  createCompleteEvents() {
    this.player.once("killed", this.onComplete, this);
    this.events.on("killed-enemies", this.onComplete, this);
  }

  onComplete() {
    this.scene.start("Start", {
      score: this.score,
      completed: this.player.active,
    });
  }
}
