export class ItemRecord {

    public upc: string;
    public name: string;
    public weight: number;
    public isHighRisk: boolean;
    public references: number;

    constructor(upc: string, name: string, weight=0, isHighRisk=false) {
      this.references = 1;
      this.weight = weight;
      this.upc = upc;
      this.name = name;
      this.isHighRisk = isHighRisk;
    }


}
