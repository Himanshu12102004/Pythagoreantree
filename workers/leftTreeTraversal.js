onmessage = function (e) {
  console.log("left");
  let root = e.data;
  traverse(root);
  function traverse(root) {
    if (root) {
      traverse(root.left);
      traverse(root.right);
    }
  }
  this.postMessage("leftDone");
};
