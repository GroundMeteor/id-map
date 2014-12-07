ground:id-map
=============

This package will mount `Ground.IdMap` - This is a simple way to ground a
collection.

> Note: This will work with local collections, but if using remote collections
> please use the ground:db main package instead

Ex.
```js
  // Create a local only db
  var foo = new Mongo.Collection('foo', { connection: null });

  // Create a storage using the ground:localstorage package
  var storage = new Store.create({
    name: 'foo'
  });

  // Now initialize the storage id map on the local collection
  foo._collection._docs = new Ground.IdMap(storage, function() {
    // Optional ready callback
  });
```

Kind regards

Morten (aka RaiX)