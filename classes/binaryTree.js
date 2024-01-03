export class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree {
  constructor(root) {
    this.root = root;
  }
  insertRight(node, nodeToInsert) {
    const newNode = new Node(nodeToInsert);
    node.right = newNode;
  }
  insertLeft(node, nodeToInsert) {
    const newNode = new Node(nodeToInsert);
    node.left = newNode;
  }
  traverse(root) {
    if (root) {
      this.traverse(root.left);
      this.traverse(root.right);
    }
  }
  updateLength(rootNode, node) {}
  traverseAndUpdateLength(root) {
    if (root) {
      this.updateLength(root, root.left);
    }
  }
  parallelTraversal(leftNode, rightNode) {
    let time = performance.now();
    let leftWorker = new Worker("workers/leftTreeTraversal.js");
    leftWorker.postMessage(leftNode);
    leftWorker.onmessage = function (e) {
      console.log(time - performance.now());
    };
    let rightWorker = new Worker("workers/rightTreeTraversal.js");
    rightWorker.postMessage(rightNode);
    rightWorker.onmessage = function (e) {
      console.log(time - performance.now());
    };
  }
}
