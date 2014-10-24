var DependencyResolver = require('../index.js');

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

  it('sorts', function () {
    var resolver = new DependencyResolver();
    resolver.add('a');
    resolver.add('b');
    resolver.add('c');
    resolver.add('d');
    resolver.add('e');
    resolver.add('f');
    resolver.add('g');

    resolver.setDependency('a', 'b');
    resolver.setDependency('a', 'c');
    resolver.setDependency('c', 'd');
    resolver.setDependency('c', 'e');
    resolver.setDependency('e', 'g');

    //This test is not good
    //it's just a possible solution:
    expect(resolver.sort()).toEqual(['b', 'd', 'g', 'e', 'c', 'a', 'f']);
  });

});
