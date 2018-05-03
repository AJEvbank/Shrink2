

export class LogHandler {

  className: string = "undeclared";
  active: boolean = true;

  constructor(className: string){
    this.className = className;
  }
  public logCont(content: any, callerName: string) : void {
    if (this.active == true) {
      console.log("[START OUTPUT]");
      console.log("Content in " + this.className + " method: " + callerName + "() => content = " + JSON.stringify(content));
      console.log("[END OUTPUT]");
    }
  }

  public logErr(error: any, callerName: string) : void {
    if (this.active == true) {
      console.log("[START OUTPUT]");
      console.log("Error in " + this.className + ", method: " + callerName + "() => error = "
                      + JSON.stringify(error)
                      + JSON.stringify(Object.getOwnPropertyNames(error)));
      console.log("[END OUTPUT]");
    }
  }

  public logURLInfo(url: string, body: any, method: string) {
    if (this.active == true) {
      console.log("[START OUTPUT]");
      console.log("In " + this.className + ", method = " + method + " URL: " + url);
      if (body != null) console.log("body: " + JSON.stringify(body));
      console.log("[END OUTPUT]");
    }
  }

}