import { Throwaway } from './throwaway.model';

export class HighRiskItem {

  public throwawayList: Throwaway [];
  public totalLostQuantity: number;
  public totalLostRevenue: number;

  constructor(throwaways: Throwaway []) {
    this.throwawayList = throwaways;
    for (let throwaway of this.throwawayList) {
      this.totalLostQuantity += throwaway.item.quantity;
      this.totalLostRevenue += throwaway.item.unitPrice * throwaway.item.quantity;
    }
  }

}
