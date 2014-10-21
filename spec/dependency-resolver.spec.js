var DependencyResolver = require('../build/DependencyResolver');

describe('dependency-resolver', function () {

  it('resolves dependencies', function () {
    var resolver = new DependencyResolver();
    resolver.add('a');
    resolver.add('b');
    resolver.add('c');
    resolver.add('d');

    resolver.setDependency('d', 'c');
    resolver.setDependency('c', 'b');
    resolver.setDependency('c', 'a');
    resolver.setDependency('b', 'a');

    expect(resolver.resolve('d')).toEqual(['a', 'b', 'c', 'd']);
  });

  it('detects circular dependencies', function () {
    var resolver = new DependencyResolver();
    resolver.add('a');
    resolver.add('b');
    resolver.add('c');
    resolver.add('d');

    resolver.setDependency('d', 'c');
    resolver.setDependency('c', 'b');
    resolver.setDependency('c', 'a');
    resolver.setDependency('b', 'a');
    resolver.setDependency('a', 'd');

    expect(resolver.resolve.bind(this, 'd')).toThrow();
  });

  it('detects throws when resolving not existing modules', function () {
    var resolver = new DependencyResolver();
    resolver.add('a');
    expect(resolver.resolve.bind(this, 'b')).toThrow();
  });

});