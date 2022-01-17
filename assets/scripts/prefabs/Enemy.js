class Enemy extends MovableObject {
  static generateAttributes() {
    const x = config.width + 200;
    const y = Phaser.Math.Between(100, config.height - 100);
    return { x, y, frame: `enemy${Phaser.Math.Between(1, 4)}` };
  }

  static generate(scene, fires) {
    const { x, y, frame } = Enemy.generateAttributes();
    return new Enemy({
      scene,
      fires,
      x,
      y,
      texture: "enemy",
      frame,
      velocity: -250,
      bullet: {
        delay: 1000,
        texture: "bullet",
        velocity: -500,
      },
    });
  }

  init(data) {
    super.init(data);
    this.fires = data.fires || new Fires(this.scene);
    this.timer = this.scene.time.addEvent({
      delay: data.bullet.delay,
      callback: this.fire,
      callbackScope: this,
      loop: true,
    });
    this.bullet = data.bullet;
    this.setOrigin(0, 0.5);
  }

  fire() {
    this.fires.createFire(this);
    this.countCreatedFires++;
  }

  reset() {
    const { x, y, frame } = Enemy.generateAttributes();
    super.reset(x, y);
    this.x = x;
    this.y = y;
    this.setFrame(frame);
    this.setAlive(true);
  }

  isDead() {
    return this.active && this.x < -this.width;
  }

  move() {
    this.body.setVelocityX(this.velocity);
  }
}
