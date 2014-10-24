var grom;
(function (grom) {
    var DepService = (function () {
        function DepService(name) {
            this.name = name;
            this.dependencies = [];
        }
        return DepService;
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
            this.services[serviceName] = new DepService(serviceName);
            //Add dependency to root element for sort function to work
            if (serviceName !== DependencyResolver.ROOT_SERVICE_NAME) {
                this.setDependency(DependencyResolver.ROOT_SERVICE_NAME, serviceName);
            }
            return this.services[serviceName];
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
                throw new Error('DepService ' + serviceName + ' does not exist');
            }
            this.recursiveResolve(service, resolved, unresolved);
            return resolved.map(function (s) { return s.name; });
        };
        DependencyResolver.prototype.sort = function () {
            var deps = this.resolve(DependencyResolver.ROOT_SERVICE_NAME);
            deps.pop(); //remove DependencyResolver.ROOT_SERVICE_NAME element
            return deps;
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
        DependencyResolver.ROOT_SERVICE_NAME = '#root#';
        return DependencyResolver;
    })();
    grom.DependencyResolver = DependencyResolver;
})(grom || (grom = {}));
if (typeof module !== 'undefined') {
    module.exports = grom.DependencyResolver;
}
