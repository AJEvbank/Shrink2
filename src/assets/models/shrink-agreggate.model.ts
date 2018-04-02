export class ShrinkAggregate {

  public upc: string;
  public name: string;
  public shrink: number;

  constructor(upc:string, name:string, shrink:number){
    this.upc = upc;
    this.name = name;
    this.shrink = shrink;
  }

}
