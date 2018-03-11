import { Throwaway } from './throwaway.model';

export class HighRiskItem {

  public throwawayList: Throwaway [];
  public totalLostQuantity: number;
  public totalLostRevenue: number;

  constructor(throwaways: Throwaway [], totalLostQuantity=0, totalLostRevenue=0) {
    this.throwawayList = throwaways;
    this.totalLostQuantity = totalLostQuantity;
    this.totalLostRevenue = totalLostRevenue;
  }

}
