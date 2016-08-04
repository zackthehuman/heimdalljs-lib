module.exports = HeimdallNode;
function HeimdallNode(heimdall, id, data) {
  this._heimdall = heimdall;

  this._id = heimdall.generateNextId();
  this.id = id;

  if (!(typeof this.id === 'object' && this.id !== null && typeof this.id.name === 'string')) {
    throw new TypeError('HeimdallNode#id.name must be a string');
  }

  this.stats = {
    own: data,
    time: { self: 0 },
  };

  this._children = [];

  this.parent = null;
}

Object.defineProperty(HeimdallNode.prototype, 'isRoot', {
  get: function () {
    return this.parent === undefined;
  },
});

HeimdallNode.prototype.visitPreOrder = function (cb) {
  cb(this);

  for (var i = 0; i < this._children.length; i++) {
    this._children[i].visitPreOrder(cb);
  }
};

HeimdallNode.prototype.visitPostOrder = function (cb) {
  for (var i = 0; i < this._children.length; i++) {
    this._children[i].visitPostOrder(cb);
  }

  cb(this);
};

HeimdallNode.prototype.remove = function () {
  if (!this.parent) {
    throw new Error('Cannot remove the root heimdalljs node.');
  }
  if (this._heimdall.current === this) {
    throw new Error('Cannot remove an active heimdalljs node.');
  }

  return this.parent.removeChild(this);
};

HeimdallNode.prototype.toJSON = function () {
  return {
    _id: this._id,
    id: this.id,
    stats: this.stats,
    children: this._children.map(function (child) { return child._id; }),
  };
};

HeimdallNode.prototype.toJSONSubgraph = function () {
  var nodes = [];

  this.visitPreOrder(function(node) {
    nodes.push(node.toJSON());
  });

  return nodes;
};

HeimdallNode.prototype.addChild = function (node) {
  if (node.parent) {
    throw new TypeError('Node ' + node._id + ' already has a parent.  Cannot add to ' + this._id);
  }

  this._children.push(node);

  node.parent = this;
};


HeimdallNode.prototype.removeChild = function (child) {
  var index = this._children.indexOf(child);

  if (index < 0) {
    throw new Error('Child(' + child._id + ') not found in Parent(' + this._id + ').  Something is very wrong.');
  }
  this._children.splice(index, 1);

  child.parent = null;

  return child;
};
