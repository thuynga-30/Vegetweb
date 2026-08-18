import { http, HttpResponse } from "msw";
import type { Batch } from "@/types/batch";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import {
    categories, users, farms, products, batches, batchListItems,
    cultivationLogs, batchImages, approvals, orders, orderDetails, reviews,
    DEMO_SELLER_ID, DEMO_BUYER_ID,
} from "./data";

/** state trong bộ nhớ để các thao tác create/update phản ánh lại khi xem lại trong phiên làm việc */
const state = {
    products: [...products] as Product[],
    batches: [...batches] as Batch[],
    batchListItems: [...batchListItems],
    orders: [...orders] as Order[],
    orderDetails: [...orderDetails],
    reviews: [...reviews],
    farms: [...farms],
    users: [...users],
    cultivationLogs: [...cultivationLogs],
    nextProductId: 1000,
    nextBatchId: 1000,
    nextOrderId: 1000,
    nextReviewId: 1000,
    nextLogId: 1000,
};

const ok = <T,>(data: T, message = "Thành công") => ({ success: true, message, data });
const delay = () => new Promise((r) => setTimeout(r, 250));

function findUserByEmail(email: string) {
    return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// Giải mã user hiện tại từ token giả lập "mock-jwt-token-<id>" trong header Authorization,
// để /users/profile trả đúng người đang đăng nhập thay vì luôn là buyer demo.
function getCurrentUser(request: Request) {
    const auth = request.headers.get("Authorization") ?? "";
    const match = auth.match(/mock-jwt-token-(\d+)/);
    const id = match ? Number(match[1]) : DEMO_BUYER_ID;
    return state.users.find((u) => u.id === id) ?? state.users.find((u) => u.id === DEMO_BUYER_ID)!;
}

export const handlers = [
    /* ============ AUTH ============ */
    http.post("/auth/login", async ({ request }) => {
        await delay();
        const body = (await request.json()) as { email: string; password: string };
        const user = findUserByEmail(body.email) ?? state.users.find((u) => u.id === DEMO_BUYER_ID)!;
        return HttpResponse.json({
            success: true, message: "Đăng nhập thành công",
            token: `mock-jwt-token-${user.id}`, user,
        });
    }),

    http.post("/auth/register", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const newUser = {
            id: state.users.length + 1,
            full_name: body.full_name, email: body.email, phone: body.phone,
            address: body.address, role: body.role, created_at: new Date().toISOString(),
        };
        state.users.push(newUser);
        return HttpResponse.json(ok(newUser, "Đăng ký thành công"));
    }),

    http.get("/users/profile", async ({ request }) => {
        await delay();
        return HttpResponse.json(ok(getCurrentUser(request)));
    }),

    http.put("/users/profile", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const current = getCurrentUser(request);
        const idx = state.users.findIndex((u) => u.id === current.id);
        state.users[idx] = { ...state.users[idx], ...body };
        return HttpResponse.json(ok(state.users[idx], "Cập nhật hồ sơ thành công"));
    }),

    /* ============ CATEGORIES ============ */
    http.get("/categories", async () => {
        await delay();
        return HttpResponse.json(ok(categories));
    }),

    /* ============ FARMS ============ */
    http.get("/farms/my", async () => {
        await delay();
        const farm = state.farms.find((f) => f.seller_id === DEMO_SELLER_ID)!;
        return HttpResponse.json(ok(farm));
    }),

    http.put("/farms/my", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const idx = state.farms.findIndex((f) => f.seller_id === DEMO_SELLER_ID);
        state.farms[idx] = { ...state.farms[idx], ...body };
        return HttpResponse.json(ok(state.farms[idx]));
    }),

    http.get("/farms/:id", async ({ params }) => {
        await delay();
        const farm = state.farms.find((f) => f.id === Number(params.id));
        if (!farm) return HttpResponse.json({ success: false, message: "Không tìm thấy nông trại" }, { status: 404 });
        return HttpResponse.json(ok(farm));
    }),

    http.get("/farms", async () => {
        await delay();
        return HttpResponse.json(ok(state.farms));
    }),

    // Admin duyệt / từ chối hồ sơ nông trại (khác với duyệt lô hàng)
    http.put("/farms/:id/approve", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as { note?: string };
        const idx = state.farms.findIndex((f) => f.id === Number(params.id));
        if (idx < 0) return HttpResponse.json({ success: false, message: "Không tìm thấy nông trại" }, { status: 404 });
        state.farms[idx] = { ...state.farms[idx], approval_status: "Approved", approval_note: body.note };
        return HttpResponse.json(ok(state.farms[idx], "Đã duyệt hồ sơ nông trại"));
    }),

    http.put("/farms/:id/reject", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as { note?: string };
        const idx = state.farms.findIndex((f) => f.id === Number(params.id));
        if (idx < 0) return HttpResponse.json({ success: false, message: "Không tìm thấy nông trại" }, { status: 404 });
        state.farms[idx] = { ...state.farms[idx], approval_status: "Rejected", approval_note: body.note };
        return HttpResponse.json(ok(state.farms[idx], "Đã từ chối hồ sơ nông trại"));
    }),

    /* ============ PRODUCTS ============ */
    http.get("/products/my", async () => {
        await delay();
        const farm = state.farms.find((f) => f.seller_id === DEMO_SELLER_ID)!;
        return HttpResponse.json(ok(state.products.filter((p) => p.farm_id === farm.id)));
    }),

    http.post("/products", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const farm = state.farms.find((f) => f.seller_id === DEMO_SELLER_ID)!;
        const newProduct: Product = {
            id: state.nextProductId++, farm_id: farm.id, category_id: body.category_id,
            name: body.name, description: body.description, price: body.price,
            created_at: new Date().toISOString(),
        };
        state.products.push(newProduct);
        return HttpResponse.json(ok(newProduct, "Tạo sản phẩm thành công"));
    }),

    /* ============ BATCHES ============ */
    http.get("/batches", async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const categoryId = url.searchParams.get("category_id");
        const trustLevel = url.searchParams.get("trust_level");
        const keyword = url.searchParams.get("keyword")?.toLowerCase();

        let list = state.batchListItems.filter((b) => b.approval_status === "Approved");
        if (categoryId) {
            const prodIds = state.products.filter((p) => p.category_id === Number(categoryId)).map((p) => p.id);
            list = list.filter((b) => prodIds.includes(b.product_id));
        }
        if (trustLevel) list = list.filter((b) => b.trust_level === trustLevel);
        if (keyword) list = list.filter((b) => b.product_name.toLowerCase().includes(keyword));

        return HttpResponse.json(ok(list));
    }),

    // Admin: toàn bộ lô hàng bất kể trạng thái duyệt (dùng cho trang Kiểm duyệt lô hàng & Tổng quan)
    http.get("/admin/batches", async () => {
        await delay();
        return HttpResponse.json(ok(state.batchListItems));
    }),

    http.get("/batches/my", async () => {
        await delay();
        const farm = state.farms.find((f) => f.seller_id === DEMO_SELLER_ID)!;
        const list = state.batchListItems.filter((b) => b.farm_id === farm.id);
        return HttpResponse.json(ok(list));
    }),

    http.get("/batches/trace/:code", async ({ params }) => {
        await delay();
        const code = String(params.code);
        const batch = state.batches.find((b) => b.batch_code.toLowerCase() === code.toLowerCase());
        if (!batch) {
            return HttpResponse.json({ success: false, message: "Không tìm thấy lô hàng với mã này" }, { status: 404 });
        }
        const farm = farms.find((f) => f.id === state.batchListItems.find((b) => b.id === batch.id)!.farm_id)!;
        return HttpResponse.json(ok({
            batch,
            farm: { farm_name: farm.farm_name, owner_name: farm.owner_name, address: farm.address },
            logs: state.cultivationLogs.filter((l) => l.batch_id === batch.id),
            images: batchImages.filter((i) => i.batch_id === batch.id),
        }));
    }),

    // Seller thêm 1 mục nhật ký canh tác mới cho lô hàng
    http.post("/batches/:id/logs", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as { log_date: string; activity: string; description?: string };
        const newLog = {
            id: state.nextLogId++, batch_id: Number(params.id),
            activity: body.activity, description: body.description, log_date: body.log_date,
        };
        state.cultivationLogs.push(newLog);
        return HttpResponse.json(ok(newLog, "Đã thêm nhật ký canh tác"));
    }),

    http.get("/batches/:id", async ({ params }) => {
        await delay();
        const item = state.batchListItems.find((b) => b.id === Number(params.id));
        if (!item) return HttpResponse.json({ success: false, message: "Không tìm thấy lô hàng" }, { status: 404 });
        return HttpResponse.json(ok(item));
    }),

    http.post("/batches", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const farm = state.farms.find((f) => f.seller_id === DEMO_SELLER_ID)!;

        // Tìm sản phẩm cùng tên đã có của chính nông trại này (không phân biệt hoa/thường);
        // nếu chưa có thì tự tạo mới sản phẩm với tên vừa nhập.
        const name = String(body.product_name ?? "").trim();
        let product = state.products.find(
            (p) => p.farm_id === farm.id && p.name.toLowerCase() === name.toLowerCase()
        );
        if (!product) {
            product = {
                id: state.nextProductId++, farm_id: farm.id, category_id: 1,
                name, description: "", price: body.price ?? 0,
                created_at: new Date().toISOString(),
            };
            state.products.push(product);
        }

        const id = state.nextBatchId++;
        const newBatch: Batch = {
            id, product_id: product.id, batch_code: `GF-NEW-2026-${id}`,
            planting_date: body.planting_date, harvest_date: body.harvest_date,
            quantity: body.quantity, trust_level: "Low", approval_status: "Pending",
            created_at: new Date().toISOString(),
        };
        state.batches.push(newBatch);
        state.batchListItems.push({
            ...newBatch, product_name: product.name,
            image: body.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop",
            farm_name: farm.farm_name, farm_id: farm.id, price: body.price ?? product.price ?? 0, sold: 0,
        });
        return HttpResponse.json(ok(newBatch, "Tạo lô hàng thành công, đang chờ duyệt"));
    }),

    http.put("/batches/:id", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as any;
        const id = Number(params.id);
        const idx = state.batches.findIndex((b) => b.id === id);
        if (idx >= 0) state.batches[idx] = { ...state.batches[idx], ...body };
        const listIdx = state.batchListItems.findIndex((b) => b.id === id);
        if (listIdx >= 0) state.batchListItems[listIdx] = { ...state.batchListItems[listIdx], ...body };
        return HttpResponse.json(ok(state.batches[idx]));
    }),

    http.post("/batches/:id/images", async ({ params }) => {
        await delay();
        const images = batchImages.filter((i) => i.batch_id === Number(params.id));
        return HttpResponse.json(ok(images, "Tải ảnh thành công"));
    }),

    http.put("/batches/:id/approve", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as any;
        const id = Number(params.id);
        const idx = state.batches.findIndex((b) => b.id === id);
        if (idx >= 0) state.batches[idx] = { ...state.batches[idx], approval_status: "Approved" };
        const listIdx = state.batchListItems.findIndex((b) => b.id === id);
        if (listIdx >= 0) state.batchListItems[listIdx] = { ...state.batchListItems[listIdx], approval_status: "Approved" };
        return HttpResponse.json(ok(state.batches[idx], body?.note ? "Đã duyệt: " + body.note : "Đã duyệt lô hàng"));
    }),

    http.put("/batches/:id/reject", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as any;
        const id = Number(params.id);
        const idx = state.batches.findIndex((b) => b.id === id);
        if (idx >= 0) state.batches[idx] = { ...state.batches[idx], approval_status: "Rejected" };
        const listIdx = state.batchListItems.findIndex((b) => b.id === id);
        if (listIdx >= 0) state.batchListItems[listIdx] = { ...state.batchListItems[listIdx], approval_status: "Rejected" };
        return HttpResponse.json(ok(state.batches[idx], "Đã từ chối: " + (body?.note ?? "")));
    }),

    /* ============ CART (giỏ hàng lưu ở localStorage phía client, các API này chỉ để dự phòng) ============ */
    http.get("/cart", async () => HttpResponse.json(ok([]))),
    http.post("/cart", async () => HttpResponse.json(ok(null))),
    http.put("/cart/:id", async () => HttpResponse.json(ok(null))),
    http.delete("/cart/:id", async () => HttpResponse.json(ok(null))),

    /* ============ ORDERS ============ */
    http.post("/orders", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const id = state.nextOrderId++;
        const totalPrice = (body.items as any[]).reduce((sum, i) => {
            const batch = state.batchListItems.find((b) => b.id === i.batch_id);
            return sum + (batch?.price ?? 0) * i.quantity;
        }, 0) + 25000;
        const newOrder: Order = {
            id, buyer_id: DEMO_BUYER_ID, receiver_name: body.receiver_name,
            receiver_phone: body.receiver_phone, shipping_address: body.shipping_address,
            total_price: totalPrice, status: "Pending", created_at: new Date().toISOString(),
        };
        state.orders.push(newOrder);
        (body.items as any[]).forEach((i) => {
            const batch = state.batchListItems.find((b) => b.id === i.batch_id);
            state.orderDetails.push({
                id: state.orderDetails.length + 1, order_id: id,
                batch_id: i.batch_id, quantity: i.quantity, price: batch?.price ?? 0,
            });
        });
        return HttpResponse.json(ok(newOrder, "Đặt hàng thành công"));
    }),

    http.get("/orders/my", async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        let list = state.orders.filter((o) => o.buyer_id === DEMO_BUYER_ID);
        if (status) list = list.filter((o) => o.status === status);
        const withDetails = list.map((o) => ({ ...o, details: state.orderDetails.filter((d) => d.order_id === o.id) }));
        return HttpResponse.json(ok(withDetails));
    }),

    http.get("/orders/seller", async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        const farm = state.farms.find((f) => f.seller_id === DEMO_SELLER_ID)!;
        const myBatchIds = state.batchListItems.filter((b) => b.farm_id === farm.id).map((b) => b.id);
        let list = state.orders.filter((o) =>
            state.orderDetails.some((d) => d.order_id === o.id && myBatchIds.includes(d.batch_id))
        );
        if (status) list = list.filter((o) => o.status === status);
        const withDetails = list.map((o) => ({ ...o, details: state.orderDetails.filter((d) => d.order_id === o.id) }));
        return HttpResponse.json(ok(withDetails));
    }),

    http.get("/orders/:id", async ({ params }) => {
        await delay();
        const order = state.orders.find((o) => o.id === Number(params.id));
        if (!order) return HttpResponse.json({ success: false, message: "Không tìm thấy đơn hàng" }, { status: 404 });
        return HttpResponse.json(ok({ ...order, details: state.orderDetails.filter((d) => d.order_id === order.id) }));
    }),

    http.put("/orders/:id/confirm", async ({ params }) => {
        await delay();
        const idx = state.orders.findIndex((o) => o.id === Number(params.id));
        if (idx >= 0) state.orders[idx] = { ...state.orders[idx], status: "Completed" };
        return HttpResponse.json(ok(state.orders[idx], "Đã xác nhận nhận hàng"));
    }),

    // Admin duyệt / từ chối đơn hàng: đổi trạng thái đơn (Pending -> Confirmed hoặc Cancelled)
    http.put("/orders/:id/status", async ({ request, params }) => {
        await delay();
        const body = (await request.json()) as { status: string };
        const idx = state.orders.findIndex((o) => o.id === Number(params.id));
        if (idx < 0) return HttpResponse.json({ success: false, message: "Không tìm thấy đơn hàng" }, { status: 404 });
        state.orders[idx] = { ...state.orders[idx], status: body.status as Order["status"] };
        const msg = body.status === "Confirmed" ? "Đã duyệt đơn hàng" : body.status === "Cancelled" ? "Đã từ chối đơn hàng" : "Đã cập nhật trạng thái";
        return HttpResponse.json(ok(state.orders[idx], msg));
    }),

    // Danh sách toàn bộ đơn hàng (Admin) — đặt sau /orders/my, /orders/seller, /orders/:id không trùng path nên thứ tự không ảnh hưởng
    http.get("/orders", async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        let list = state.orders;
        if (status) list = list.filter((o) => o.status === status);
        const withDetails = list.map((o) => ({ ...o, details: state.orderDetails.filter((d) => d.order_id === o.id) }));
        return HttpResponse.json(ok(withDetails));
    }),

    /* ============ REVIEWS ============ */
    http.get("/reviews", async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const productId = url.searchParams.get("product_id");
        const list = productId ? state.reviews.filter((r) => r.product_id === Number(productId)) : state.reviews;
        return HttpResponse.json(ok(list));
    }),

    http.post("/reviews", async ({ request }) => {
        await delay();
        const body = (await request.json()) as any;
        const newReview = {
            id: state.nextReviewId++, buyer_id: DEMO_BUYER_ID, product_id: body.product_id,
            rating: body.rating, comment: body.comment, created_at: new Date().toISOString(),
        };
        state.reviews.push(newReview);
        return HttpResponse.json(ok(newReview, "Cảm ơn bạn đã đánh giá"));
    }),

    /* ============ USERS (Admin) ============ */
    http.get("/users", async ({ request }) => {
        await delay();
        const url = new URL(request.url);
        const role = url.searchParams.get("role");
        const list = role ? state.users.filter((u) => u.role === role) : state.users;
        return HttpResponse.json(ok(list));
    }),
];

export { approvals };