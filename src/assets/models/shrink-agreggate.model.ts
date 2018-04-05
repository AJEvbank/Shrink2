export class ShrinkAggregate {

  public upc: string;
  public name: string;
  public shrink: number;
  public highRisk: boolean;

  constructor(upc:string, name:string, shrink:number, highRisk:boolean){
    this.upc = upc;
    this.name = name;
    this.shrink = shrink;
    this.highRisk = highRisk;
  }

}
