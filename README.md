DependencyResolver
==================

## Example usage

```js
var resolver = new DependencyResolver();
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