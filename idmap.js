var noopCallback = function(err) {
    if (err) Ground.emit('error', err);
  };

Ground.IdMap = function(options) {
  var self = this;

  // If user forgot "new" return this
  if (!(this instanceof Ground.IdMap))
    return new Ground.IdMap(options);

  // Check for valid options
  check(options, {
    // Make sure the storage api is compatible
    storage: Match.ObjectIncluding({    
      toObject: Function,
      removeItem: Function,
      setItem: Function,
      addListener: Function
    }),
    // Optional callback hooks
    onReady: Match.Optional(Function),
    onSync: Match.Optional(Function),
    onUpdate: Match.Optional(Function)
  });

  // Add options to self
  _.extend(self, options);

  // Call constructor
  IdMap.call(self, LocalCollection._idStringify, LocalCollection._idParse);
  
  // Load map into collection
  storage.toObject(function(err, map) {
    if (err) {
      // If error then do noop error callback
      noopCallback(err);
    } else {
      // Emit resume event
      Ground.emit('resume', 'database ' + storage.name);
      // Set map to storage map
      self._map = map;
      // Trigger on ready callback
      if (self.onReady) self.onReady();
    }
  });

  // Keep in sync with storage
  self._storageListener = function(e) {
    if (typeof e.newValue == 'undefined') {
      // Remove the key in map
      IdMap.prototype.remove.call(self, e.key);
      // Trigger on sync callback
      if (self.onSync) self.onSync();
    } else {
      // Set key value in map
      IdMap.prototype.set.call(self, e.key, e.newValue);
      // Trigger on sync
      if (self.onSync) self.onSync();
    }
  };

  // Start listening to the storage
  self.storage.addListener('storage', self._storageListener);
};

// Inherit the IdMap
Meteor._inherits(Ground.IdMap, IdMap);

Ground.IdMap.prototype.remove = function(id) {
  // Get stringified key
  var key = LocalCollection._idStringify(id);
  // Remove key in storage
  this.storage.removeItem(key, noopCallback);
  // Remove key in map
  IdMap.prototype.remove.call(this, id);
  // Trigger onUpdate callback
  if (this.onUpdate) this.onUpdate(key);
};

Ground.IdMap.prototype.set = function(id, value) {
  // Get stringified key
  var key = LocalCollection._idStringify(id);
  // Set key value in storage
  this.storage.setItem(key, value, noopCallback);
  // Set key value in map
  IdMap.prototype.set.call(this, id, value);
  // Trigger onUpdate callback
  if (this.onUpdate) this.onUpdate(key, value);
};

Ground.IdMap.prototype.clear = function() {
  // Clear storage
  this.storage.clear(noopCallback);
  // Clear map
  IdMap.prototype.clear.call(this);
  // Trigger onUpdate callback
  if (this.onUpdate) this.onUpdate();
};

Ground.IdMap.prototype.destroy = function() {
  // Remove the storage listner
  this.storage.removeListener(this._storageListener);
};