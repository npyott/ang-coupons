export interface Coupon {
    _id: string;
    description: string;
    section: string;
    limit: number;
    usage: number;
    imageSrc: string;
    createdAt: Date;
    updatedAt: Date;
}
