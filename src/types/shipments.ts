export interface ShipmentEvent {
    eventDateTime: string;
    shipment: {
        status: {
            shipmentIsDelayed: number;
            shipmentException?: number;
        }
    }
    eventPosition: {
        status: string;
        comments?: string;
        city: string;
        country: string;
    }
}