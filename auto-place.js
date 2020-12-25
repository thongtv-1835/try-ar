AFRAME.registerComponent("auto-place", {
  init() {
    const dot1 = document.querySelector(".dot1");
    const dot2 = document.querySelector(".dot2");
    const dot3 = document.querySelector(".dot3");

    const dot1Rect = dot1.getBoundingClientRect();
    const dot2Rect = dot2.getBoundingClientRect();
    const dot3Rect = dot3.getBoundingClientRect();

    this.el.addEventListener("model-loaded", () => {
      const dot1Position = this.to3dPosition(dot1Rect.x, dot1Rect.y);
      const dot2Position = this.to3dPosition(dot2Rect.x, dot2Rect.y);
      const dot3Position = this.to3dPosition(dot3Rect.x, dot3Rect.y);

      // current size before transform
      const size = this.getSize();

      // rotation
      const rotationZDeg =
        (Math.atan(
          (dot3Position.y - dot1Position.y) / (dot3Position.x - dot1Position.x)
        ) /
          Math.PI) *
        180;
      this.el.setAttribute("rotation", {
        x: 0,
        y: 0,
        z: rotationZDeg,
      });

      // scale
      const currentScale = this.el.getAttribute("scale");
      const scaleFactor =
        Math.sqrt(
          Math.pow(dot3Position.x - dot1Position.x, 2) +
            Math.pow(dot3Position.y - dot1Position.y, 2)
        ) / size.x;
      this.el.setAttribute("scale", {
        x: scaleFactor * currentScale.x,
        y: scaleFactor * currentScale.y,
        z: scaleFactor * currentScale.z,
      });

      // size after transform
      const sizeAfter = this.getSize();
      console.log(size, sizeAfter);

      // position
      this.el.setAttribute("position", {
        x: dot2Position.x,
        y: dot2Position.y,
        z: dot2Position.z,
      });
    });
  },
  getSize() {
    const box3 = new THREE.Box3().setFromObject(this.el.object3D);
    const size = box3.getSize(new THREE.Vector3());
    return size;
  },
  to3dPosition(x, y) {
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    const cameraEl = document.querySelector("#camera");

    const cameraPosition = cameraEl.object3D.position;

    const camera = cameraEl.getObject3D("camera");

    vec.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0.5
    );

    vec.unproject(camera);

    vec.sub(cameraPosition).normalize();

    var distance = -cameraPosition.z / vec.z;

    pos.copy(cameraPosition).add(vec.multiplyScalar(distance));

    return pos;
  },
  remove() {},
  update() {},
  tick() {},
});
