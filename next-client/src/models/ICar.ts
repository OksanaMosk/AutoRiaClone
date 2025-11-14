export interface ICar {
    id: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    currency: string;
    price_usd: number;
    price_eur: number;
    condition: string;
    max_speed: number;
    seats_count: number;
    engine_volume: number;
    has_air_conditioner: boolean;
    fuel_type: string;
    location: string;
    description: string;
    status: string;
    views: number;
    daily_views: number;
    weekly_views: number;
    monthly_views: number;
    created_at: string;
    updated_at: string;
    exchange_rate_id: string;
    last_exchange_update: string | null;
    photos: ICarPhoto[];
}

export interface ICarPhoto {
    id: string;
    car_id: string;
    photo_url: string;
}
