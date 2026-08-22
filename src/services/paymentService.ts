import api from "@/lib/axios";
export const paymentService = {
    createVnpayUrl: (orderId: number) =>
        api.post(`/payment/vnpay/${orderId}`) as Promise<{ paymentUrl: string; txnRef: string }>,

    verifyVnpayReturn: (queryString: string) =>
        api.get(`/payment/vnpay/return${queryString}`) as Promise<{
            success: boolean;
            message: string;
            orderId?: number;
        }>,
};