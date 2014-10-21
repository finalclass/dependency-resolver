var fcc;
(function (fcc) {
    var Service = (function () {
        function Service(name) {
            this.name = name;
            this.dependencies = [];
        }
        return Service;
    })();
    var DependencyResolver = (function () {
        function DependencyResolver() {
            this.services = {};
        }
        DependencyResolver.prototype.add = function (name) {
            this.addAndGet(name);
        };
        DependencyResolver.prototype.addAndGet = function (serviceName) {
            if (this.services[serviceName]) {
                return this.services[serviceName];
            }
            return this.services[serviceName] = new Service(serviceName);
        };
        DependencyResolver.prototype.setDependency = function (serviceName, dependencyName) {
            var service = this.addAndGet(serviceName);
            var dependency = this.addAndGet(dependencyName);
            service.dependencies.push(dependency);
        };
        DependencyResolver.prototype.resolve = function (serviceName) {
            var resolved = [];
            var unresolved = [];
            var service = this.services[serviceName];
            if (!service) {
                throw new Error('Service ' + serviceName + ' does not exist');
            }
            this.recursiveResolve(service, resolved, unresolved);
            return resolved.map(function (s) { return s.name; });
        };
        DependencyResolver.prototype.recursiveResolve = function (service, resolved, unresolved) {
            var _this = this;
            unresolved.push(service);
            service.dependencies.forEach(function (sub) {
                if (resolved.indexOf(sub) === -1) {
                    if (unresolved.indexOf(sub) !== -1) {
                        throw new Error('Circular reference detected: ' + service.name + ' -> ' + sub.name);
                    }
                    _this.recursiveResolve(sub, resolved, unresolved);
                }
            });
            resolved.push(service);
            unresolved.splice(unresolved.indexOf(service), 1);
        };
        return DependencyResolver;
    })();
    fcc.DependencyResolver = DependencyResolver;
})(fcc || (fcc = {}));
if (typeof module !== 'undefined') {
    module.exports = fcc.DependencyResolver;
}
