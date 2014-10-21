DependencyResolver
==================

## Example usage

```js
var DependencyResolver = require('dependency-resolver'); //if in node env

var resolver = new DependencyResolver(); //or new grom.DependencyResolver(); when in browser env
resolver.add('a');
resolver.add('b');
resolver.add('c');
resolver.add('d');

resolver.setDependency('d', 'c');
resolver.setDependency('c', 'b');
resolver.setDependency('c', 'a');
resolver.setDependency('b', 'a');

resolver.resolve('d'); //=> ['a', 'b', 'c', 'd'];
```

## License - ISC

ISC is even simpler MIT like license