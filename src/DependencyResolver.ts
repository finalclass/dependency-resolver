module grom {

  class Service {
    public dependencies:Service[] = []
    constructor(public name:string){}
  }

  interface IServiceHash {
    [id:string]:Service;
  }

  export class DependencyResolver {

    private services:IServiceHash = {};

    constructor() {

    }

    public add(name:string):void {
      this.addAndGet(name);
    }

    private addAndGet(serviceName:string):Service {
      if (this.services[serviceName]) {
        return this.services[serviceName];
      }
      return this.services[serviceName] = new Service(serviceName);
    }

    public setDependency(serviceName:string, dependencyName:string):void {
      var service:Service = this.addAndGet(serviceName);
      var dependency:Service = this.addAndGet(dependencyName);
      service.dependencies.push(dependency);
    }

    public resolve(serviceName:string):string[] {
      var resolved:Service[] = [];
      var unresolved:Service[] = [];
      var service:Service = this.services[serviceName];
      if (!service) {
        throw new Error('Service ' + serviceName + ' does not exist');
      }
      this.recursiveResolve(service, resolved, unresolved);
      return resolved.map((s:Service):string => s.name);
    }

    private recursiveResolve(service:Service, resolved:Service[], unresolved:Service[]):void {
      unresolved.push(service);
      service.dependencies.forEach((sub:Service) => {
        if (resolved.indexOf(sub) === -1) {
          if (unresolved.indexOf(sub) !== -1) {
            throw new Error('Circular reference detected: ' + service.name + ' -> ' + sub.name);
          }
          this.recursiveResolve(sub, resolved, unresolved)
        }
      });
      resolved.push(service);
      unresolved.splice(unresolved.indexOf(service), 1);
    }

  }

}

declare var module: any;
if (typeof module !== 'undefined') {
  module.exports = grom.DependencyResolver;
}