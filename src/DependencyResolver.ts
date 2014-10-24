module grom {

  class DepService {
    public dependencies:DepService[] = []
    constructor(public name:string){

    }
  }

  interface IDepServiceHash {
    [id:string]:DepService;
  }

  export class DependencyResolver {

    private static ROOT_SERVICE_NAME:string = '#root#';

    private services:IDepServiceHash = {};

    constructor() {

    }

    public add(name:string):void {
      this.addAndGet(name);
    }

    private addAndGet(serviceName:string):DepService {
      if (this.services[serviceName]) {
        return this.services[serviceName];
      }
      this.services[serviceName] = new DepService(serviceName);
      //Add dependency to root element for sort function to work
      if (serviceName !== DependencyResolver.ROOT_SERVICE_NAME) { //avoid circular depdency of root service
        this.setDependency(DependencyResolver.ROOT_SERVICE_NAME, serviceName);
      }
      return this.services[serviceName];
    }

    public setDependency(serviceName:string, dependencyName:string):void {
      var service:DepService = this.addAndGet(serviceName);
      var dependency:DepService = this.addAndGet(dependencyName);
      service.dependencies.push(dependency);
    }

    public each(func:(serv:string)=>void):void {
      Object.keys(this.services).forEach((key:string):void => {
        func(this.services[key]);
      });
    }

    public resolve(serviceName:string):string[] {
      var resolved:DepService[] = [];
      var unresolved:DepService[] = [];
      var service:DepService = this.services[serviceName];
      if (!service) {
        throw new Error('DepService ' + serviceName + ' does not exist');
      }
      this.recursiveResolve(service, resolved, unresolved);
      return resolved.map((s:DepService):string => s.name);
    }

    public sort():string[] {
      var deps:string[] = this.resolve(DependencyResolver.ROOT_SERVICE_NAME);
      deps.pop(); //remove DependencyResolver.ROOT_SERVICE_NAME element
      return deps;
    }

    private recursiveResolve(service:DepService, resolved:DepService[], unresolved:DepService[]):void {
      unresolved.push(service);
      service.dependencies.forEach((sub:DepService) => {
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
