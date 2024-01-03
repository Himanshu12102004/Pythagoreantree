onmessage = function (e) {
  console.log("right");
  let root = e.data;
  traverse(root);

  function traverse(root) {
    if (root) {
      traverse(root.left);
      traverse(root.right);
    }
  }
  postMessage("rightDone");
};
