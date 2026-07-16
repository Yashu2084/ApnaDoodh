import { DeliveryItem, getDeliveries, addDelivery, updateDeliveryStatus, pauseCustomerDeliveries, skipDeliveryDate, logDeliveryTemperature } from "../db";

export class DeliveryRepository {
  async getById(id: string): Promise<DeliveryItem | null> {
    const deliveries = await getDeliveries();
    return deliveries.find(d => d.id === id) || null;
  }

  async getAll(): Promise<DeliveryItem[]> {
    return await getDeliveries();
  }

  async getByCustomerId(customerId: string): Promise<DeliveryItem[]> {
    const deliveries = await getDeliveries();
    return deliveries.filter(d => d.customerId === customerId);
  }

  async getByFarmerId(farmerId: string): Promise<DeliveryItem[]> {
    const deliveries = await getDeliveries();
    return deliveries.filter(d => d.farmerId === farmerId);
  }

  async create(delivery: Omit<DeliveryItem, "id">): Promise<DeliveryItem> {
    return await addDelivery(delivery);
  }

  async updateStatus(id: string, status: DeliveryItem["status"]): Promise<DeliveryItem> {
    return await updateDeliveryStatus(id, status);
  }

  async pauseDeliveries(customerId: string, isPaused: boolean): Promise<void> {
    return await pauseCustomerDeliveries(customerId, isPaused);
  }

  async skipDate(id: string, date: string): Promise<DeliveryItem> {
    return await skipDeliveryDate(id, date);
  }

  async logTemperature(id: string, temperature: number): Promise<DeliveryItem> {
    return await logDeliveryTemperature(id, temperature);
  }
}
