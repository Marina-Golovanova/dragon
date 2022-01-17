class Fire extends MovableObject {
  static generate(scene, source) {
    const data = {
      scene,
      x: source.x,
      y: source.y,
      texture: source.bullet.texture,
      velocity: source.bullet.velocity,
    };
    return new Fire(data);
  }

  isDead() {
    return this.x > this.width + config.width;
  }

  move() {
    this.body.setVelocityX(this.velocity);
  }
}
