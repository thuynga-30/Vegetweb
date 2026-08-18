import {
    createContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

import { cartService } from "@/services/cartService";

export interface CartLine {
    // ID của dòng cart trong database
    cart_id: number;

    // ID của batch
    batch_id: number;

    // Thông tin sản phẩm
    product_name: string;
    image: string | null;
    price: number;

    // Số lượng đang có trong giỏ
    quantity: number;

    // Số lượng còn lại trong kho
    stock: number;

    farm_name?: string;
    batch_code?: string;
}

interface CartContextType {
    items: CartLine[];

    loading: boolean;

    // Thêm sản phẩm vào giỏ
    addItem: (
        batchId: number,
        quantity: number
    ) => Promise<void>;

    // Cập nhật số lượng
    updateQuantity: (
        cartId: number,
        quantity: number
    ) => Promise<void>;

    // Xóa sản phẩm
    removeItem: (
        cartId: number
    ) => Promise<void>;

    // Xóa state frontend sau checkout
    clearCart: () => void;

    // Lấy lại cart từ database
    refreshCart: () => Promise<void>;

    totalItems: number;
    totalPrice: number;
}

export const CartContext =
    createContext<CartContextType | null>(null);

export function CartProvider({
                                 children,
                             }: {
    children: ReactNode;
}) {
    const [items, setItems] = useState<CartLine[]>([]);
    const [loading, setLoading] = useState(false);
    const refreshCart = async () => {
        try {
            setLoading(true);

            const response =
                await cartService.getMyCart();

            const mappedItems: CartLine[] =
                response.items.map((item) => ({
                    // ID dòng cart
                    cart_id: item.id,

                    // ID batch
                    batch_id: item.batch.id,

                    // Tên sản phẩm
                    product_name:
                        item.product?.name ??
                        "Sản phẩm",

                    // Hiện tại API cart chưa trả image
                    image: null,

                    // Giá sản phẩm
                    price: Number(
                        item.product?.price ?? 0
                    ),

                    // Số lượng trong cart
                    quantity: Number(
                        item.quantity
                    ),

                    // Tồn kho thực tế
                    stock: Number(
                        item.batch
                            .quantityAvailable
                    ),

                    // Tên nông trại
                    farm_name:
                    item.farmName,

                    // Mã batch
                    batch_code:
                    item.batch.batchCode,
                }));

            setItems(mappedItems);
        } catch (error) {
            console.error(
                "Get cart error:",
                error
            );

            setItems([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        refreshCart();
    }, []);
    const addItem = async (
        batchId: number,
        quantity: number
    ) => {
        await cartService.addToCart(
            batchId,
            quantity
        );

        await refreshCart();
    };
    const updateQuantity = async (
        cartId: number,
        quantity: number
    ) => {
        if (quantity < 1) {
            return;
        }

        await cartService.updateItem(
            cartId,
            quantity
        );

        await refreshCart();
    };

    const removeItem = async (
        cartId: number
    ) => {
        await cartService.removeItem(
            cartId
        );

        // Đồng bộ lại cart
        await refreshCart();
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce(
        (sum, item) =>
            sum + Number(item.quantity),
        0
    );

    const totalPrice = items.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity) *
            Number(item.price),
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                loading,

                addItem,
                updateQuantity,
                removeItem,

                clearCart,
                refreshCart,

                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}