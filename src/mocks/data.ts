import type { User } from "@/types/user";
import type { Farm } from "@/types/farm";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import type { Batch, CultivationLog, BatchImage } from "@/types/batch";
import type { Order, OrderDetail } from "@/types/order";
import type { Review } from "@/types/review";
import type { Approval } from "@/types/approval";
import type { BatchListItem } from "@/services/batchService";

/* ============ Ảnh minh họa (Unsplash) ============ */
const IMG = {
    romaine: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80&auto=format&fit=crop",
    tomato: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800&q=80&auto=format&fit=crop",
    strawberry: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&q=80&auto=format&fit=crop",
    broccoli: "https://picsum.photos/seed/broccoli-gf/800/600",
    spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80&auto=format&fit=crop",
    cabbage: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80&auto=format&fit=crop",
    plum: "https://picsum.photos/seed/plum-gf/800/600",
    potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80&auto=format&fit=crop",
    mushroom: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&q=80&auto=format&fit=crop",
    rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80&auto=format&fit=crop",
    waterspinach: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80&auto=format&fit=crop",
    ginger: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80&auto=format&fit=crop",
    farm1: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80&auto=format&fit=crop",
    farm2: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&auto=format&fit=crop",
    farm3: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=900&q=80&auto=format&fit=crop",
    field1: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&auto=format&fit=crop",
    field2: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80&auto=format&fit=crop",
    field3: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80&auto=format&fit=crop",
    avatar1: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80&auto=format&fit=crop",
    avatar2: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop",
    idcard: "https://images.unsplash.com/photo-1614167415193-e2c99e4e0f52?w=600&q=80&auto=format&fit=crop",
    certScan: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&q=80&auto=format&fit=crop",
};

/* ============ Danh mục ============ */
export const categories: Category[] = [
    { id: 1, name: "Rau ăn lá", description: "Các loại rau ăn lá tươi, thu hoạch trong ngày" },
    { id: 2, name: "Rau củ quả", description: "Củ quả các loại theo mùa" },
    { id: 3, name: "Trái cây", description: "Trái cây tươi theo mùa vụ" },
    { id: 4, name: "Ngũ cốc & Hạt", description: "Gạo, hạt và ngũ cốc hữu cơ" },
    { id: 5, name: "Nấm & Gia vị", description: "Nấm tươi và gia vị hữu cơ" },
];

/* ============ Người dùng ============ */
export const users: User[] = [
    {
        id: 1, full_name: "Trần Văn Quản", email: "admin@greenfarmer.vn", phone: "0901000001",
        address: "Quận 1, TP. Hồ Chí Minh", avatar: IMG.avatar1, role: "Admin",
        created_at: "2025-11-01T02:00:00Z",
    },
    {
        id: 2, full_name: "Nguyễn Văn Hòa", email: "seller1@greenfarmer.vn", phone: "0901000002",
        address: "Xã Xuân Thọ, TP. Đà Lạt, Lâm Đồng", avatar: IMG.avatar2, role: "Seller",
        created_at: "2025-11-05T02:00:00Z",
    },
    {
        id: 3, full_name: "Lê Thị Mai", email: "seller2@greenfarmer.vn", phone: "0901000003",
        address: "Thị trấn Mộc Châu, Sơn La", role: "Seller",
        created_at: "2025-11-10T02:00:00Z",
    },
    {
        id: 4, full_name: "Phạm Văn Đức", email: "seller3@greenfarmer.vn", phone: "0901000004",
        address: "Xã Trung An, Củ Chi, TP. Hồ Chí Minh", role: "Seller",
        created_at: "2025-11-12T02:00:00Z",
    },
    {
        id: 5, full_name: "Đỗ Thị Hương", email: "buyer1@gmail.com", phone: "0912000005",
        address: "12 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh", role: "Buyer",
        created_at: "2025-12-01T02:00:00Z",
    },
    {
        id: 6, full_name: "Vũ Minh Tuấn", email: "buyer2@gmail.com", phone: "0912000006",
        address: "45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", role: "Buyer",
        created_at: "2025-12-03T02:00:00Z",
    },
    {
        id: 7, full_name: "Ngô Thị Lan", email: "buyer3@gmail.com", phone: "0912000007",
        address: "78 Lê Lợi, Hải Châu, Đà Nẵng", role: "Buyer",
        created_at: "2025-12-08T02:00:00Z",
    },
    {
        id: 8, full_name: "Bùi Quang Huy", email: "buyer4@gmail.com", phone: "0912000008",
        address: "23 Nguyễn Huệ, Ninh Kiều, Cần Thơ", role: "Buyer",
        created_at: "2025-12-15T02:00:00Z",
    },
    {
        id: 9, full_name: "Trịnh Thu Trang", email: "buyer5@gmail.com", phone: "0912000009",
        address: "9 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh", role: "Buyer",
        created_at: "2026-01-02T02:00:00Z",
    },
];

/** Người dùng demo dùng cho các API "của tôi" (my) — không có backend thật nên cố định theo vai trò */
export const DEMO_SELLER_ID = 2; // Nguyễn Văn Hòa
export const DEMO_BUYER_ID = 5; // Đỗ Thị Hương

/* ============ Nông trại ============ */
export const farms: Farm[] = [
    {
        id: 1, seller_id: 2, farm_name: "Nông trại Xanh Hòa An", owner_name: "Nguyễn Văn Hòa",
        address: "Xã Xuân Thọ, TP. Đà Lạt, Lâm Đồng",
        description: "Chuyên canh rau ôn đới và dâu tây theo hướng hữu cơ, ứng dụng nhà kính và tưới nhỏ giọt.",
        image: IMG.farm1, created_at: "2025-11-05T02:00:00Z",
        area_ha: 3.2, farming_method: "Hữu cơ - VietGAP", gps_lat: 11.94, gps_lng: 108.44,
        certifications: [
            { name: "VietGAP", verified: true, image: IMG.certScan, issued_date: "2024-03-10" },
            { name: "Hữu cơ Việt Nam", verified: true, image: IMG.certScan, issued_date: "2024-06-01" },
        ],
        owner_id_number: "049201004521",
        owner_id_front: IMG.idcard, owner_id_back: IMG.idcard,
        business_license: IMG.certScan,
        trust_score: 4.8,
        trust_metrics: [
            { label: "Chất lượng sản phẩm", percent: 96 },
            { label: "Đúng nguồn gốc", percent: 98 },
            { label: "Đúng số lượng", percent: 94 },
        ],
        approval_status: "Approved",
    },
    {
        id: 2, seller_id: 3, farm_name: "Nông trại Hữu cơ Mai Anh", owner_name: "Lê Thị Mai",
        address: "Thị trấn Mộc Châu, Sơn La",
        description: "Trang trại gia đình canh tác rau củ và trái cây vùng cao nguyên, đạt chứng nhận VietGAP.",
        image: IMG.farm2, created_at: "2025-11-10T02:00:00Z",
        area_ha: 2.5, farming_method: "VietGAP", gps_lat: 20.83, gps_lng: 104.68,
        certifications: [{ name: "VietGAP", verified: true, image: IMG.certScan, issued_date: "2024-02-15" }],
        owner_id_number: "038187002233",
        owner_id_front: IMG.idcard, owner_id_back: IMG.idcard,
        trust_score: 4.5,
        trust_metrics: [
            { label: "Chất lượng sản phẩm", percent: 92 },
            { label: "Đúng nguồn gốc", percent: 95 },
            { label: "Đúng số lượng", percent: 90 },
        ],
        approval_status: "Pending",
    },
    {
        id: 3, seller_id: 4, farm_name: "Trang trại Sạch Đức Thành", owner_name: "Phạm Văn Đức",
        address: "Xã Trung An, Củ Chi, TP. Hồ Chí Minh",
        description: "Mô hình nông nghiệp tuần hoàn: trồng nấm, gạo hữu cơ và gia vị sạch không hóa chất.",
        image: IMG.farm3, created_at: "2025-11-12T02:00:00Z",
        area_ha: 1.8, farming_method: "Hữu cơ", gps_lat: 10.97, gps_lng: 106.49,
        certifications: [{ name: "Hữu cơ Việt Nam", verified: false, image: IMG.certScan, issued_date: "2026-06-20" }],
        owner_id_number: "079195003318",
        owner_id_front: IMG.idcard, owner_id_back: IMG.idcard,
        trust_score: 4.2,
        trust_metrics: [
            { label: "Chất lượng sản phẩm", percent: 88 },
            { label: "Đúng nguồn gốc", percent: 91 },
            { label: "Đúng số lượng", percent: 89 },
        ],
        approval_status: "Approved",
    },
];

/* ============ Sản phẩm (mỗi sản phẩm gắn 1 lô hàng, id trùng nhau để đơn giản hóa demo) ============ */
export const products: Product[] = [
    { id: 1, farm_id: 1, category_id: 1, name: "Xà lách Romaine Đà Lạt", description: "Xà lách trồng nhà kính, giòn ngọt, thu hoạch trong ngày.", price: 35000, created_at: "2026-05-01T02:00:00Z" },
    { id: 2, farm_id: 1, category_id: 2, name: "Cà chua bi Đà Lạt", description: "Cà chua bi đỏ mọng, vị chua ngọt hài hòa.", price: 45000, created_at: "2026-05-03T02:00:00Z" },
    { id: 3, farm_id: 1, category_id: 3, name: "Dâu tây Đà Lạt", description: "Dâu tây giống Nhật, quả to, thơm, ngọt tự nhiên.", price: 120000, created_at: "2026-05-10T02:00:00Z" },
    { id: 4, farm_id: 1, category_id: 2, name: "Súp lơ xanh Đà Lạt", description: "Bông chắc, xanh đậm, giàu vitamin.", price: 40000, created_at: "2026-05-15T02:00:00Z" },
    { id: 5, farm_id: 2, category_id: 1, name: "Cải bó xôi Mộc Châu", description: "Cải bó xôi lá to, mềm, giàu sắt.", price: 30000, created_at: "2026-05-05T02:00:00Z" },
    { id: 6, farm_id: 2, category_id: 2, name: "Bắp cải tím Mộc Châu", description: "Bắp cải tím giòn, thích hợp trộn salad.", price: 25000, created_at: "2026-05-08T02:00:00Z" },
    { id: 7, farm_id: 2, category_id: 3, name: "Mận hậu Mộc Châu", description: "Mận hậu chính vụ, quả giòn, chua ngọt đặc trưng.", price: 60000, created_at: "2026-06-01T02:00:00Z" },
    { id: 8, farm_id: 2, category_id: 2, name: "Khoai tây Mộc Châu", description: "Khoai tây ruột vàng, bở, thơm.", price: 28000, created_at: "2026-05-20T02:00:00Z" },
    { id: 9, farm_id: 3, category_id: 5, name: "Nấm bào ngư xám", description: "Nấm bào ngư trồng theo hướng hữu cơ, không hóa chất.", price: 55000, created_at: "2026-06-05T02:00:00Z" },
    { id: 10, farm_id: 3, category_id: 4, name: "Gạo lứt hữu cơ Củ Chi", description: "Gạo lứt huyết rồng, canh tác hữu cơ đạt chuẩn.", price: 32000, created_at: "2026-06-10T02:00:00Z" },
    { id: 11, farm_id: 3, category_id: 1, name: "Rau muống hữu cơ", description: "Rau muống trồng trong nhà lưới, không thuốc trừ sâu.", price: 15000, created_at: "2026-07-10T02:00:00Z" },
    { id: 12, farm_id: 3, category_id: 5, name: "Gừng hữu cơ Củ Chi", description: "Gừng già, thơm nồng, trồng theo hướng hữu cơ.", price: 40000, created_at: "2026-07-15T02:00:00Z" },
];

const farmOf = (productId: number) => farms.find((f) => f.id === products.find((p) => p.id === productId)!.farm_id)!;
const imgOf: Record<number, string> = {
    1: IMG.romaine, 2: IMG.tomato, 3: IMG.strawberry, 4: IMG.broccoli,
    5: IMG.spinach, 6: IMG.cabbage, 7: IMG.plum, 8: IMG.potato,
    9: IMG.mushroom, 10: IMG.rice, 11: IMG.waterspinach, 12: IMG.ginger,
};

/* ============ Lô hàng (batch id === product id) ============ */
interface BatchSeed {
    id: number; batch_code: string; planting_date: string; harvest_date: string;
    quantity: number; sold: number; trust_level: Batch["trust_level"]; approval_status: Batch["approval_status"];
}
const batchSeeds: BatchSeed[] = [
    { id: 1, batch_code: "GF-XLR-2026-001", planting_date: "2026-05-20", harvest_date: "2026-07-10", quantity: 200, sold: 132, trust_level: "High", approval_status: "Approved" },
    { id: 2, batch_code: "GF-CCB-2026-002", planting_date: "2026-05-22", harvest_date: "2026-07-15", quantity: 150, sold: 98, trust_level: "High", approval_status: "Approved" },
    { id: 3, batch_code: "GF-DTA-2026-003", planting_date: "2026-05-25", harvest_date: "2026-07-20", quantity: 100, sold: 87, trust_level: "High", approval_status: "Approved" },
    { id: 4, batch_code: "GF-SLX-2026-004", planting_date: "2026-06-01", harvest_date: "2026-07-25", quantity: 120, sold: 40, trust_level: "Medium", approval_status: "Rejected" },
    { id: 5, batch_code: "GF-CBX-2026-005", planting_date: "2026-05-18", harvest_date: "2026-07-08", quantity: 180, sold: 120, trust_level: "Medium", approval_status: "Approved" },
    { id: 6, batch_code: "GF-BCT-2026-006", planting_date: "2026-05-28", harvest_date: "2026-07-18", quantity: 140, sold: 55, trust_level: "Medium", approval_status: "Pending" },
    { id: 7, batch_code: "GF-MHU-2026-007", planting_date: "2026-06-10", harvest_date: "2026-07-28", quantity: 90, sold: 61, trust_level: "High", approval_status: "Approved" },
    { id: 8, batch_code: "GF-KTA-2026-008", planting_date: "2026-06-05", harvest_date: "2026-07-30", quantity: 160, sold: 30, trust_level: "Low", approval_status: "Approved" },
    { id: 9, batch_code: "GF-NBN-2026-009", planting_date: "2026-06-20", harvest_date: "2026-08-01", quantity: 80, sold: 52, trust_level: "High", approval_status: "Approved" },
    { id: 10, batch_code: "GF-GLU-2026-010", planting_date: "2026-06-25", harvest_date: "2026-08-02", quantity: 300, sold: 140, trust_level: "Medium", approval_status: "Approved" },
    { id: 11, batch_code: "GF-RMH-2026-011", planting_date: "2026-07-20", harvest_date: "2026-08-04", quantity: 100, sold: 0, trust_level: "Low", approval_status: "Pending" },
    { id: 12, batch_code: "GF-GHC-2026-012", planting_date: "2026-07-22", harvest_date: "2026-08-05", quantity: 70, sold: 0, trust_level: "Low", approval_status: "Pending" },
];

export const batches: Batch[] = batchSeeds.map((b) => ({
    id: b.id,
    product_id: b.id,
    batch_code: b.batch_code,
    planting_date: b.planting_date,
    harvest_date: b.harvest_date,
    quantity: b.quantity,
    barcode: `893${1000000000 + b.id}`,
    trust_level: b.trust_level,
    approval_status: b.approval_status,
    created_at: `${b.planting_date}T02:00:00Z`,
}));

export const batchListItems: BatchListItem[] = batchSeeds.map((b) => {
    const product = products.find((p) => p.id === b.id)!;
    const farm = farmOf(b.id);
    return {
        id: b.id, product_id: b.id, batch_code: b.batch_code,
        planting_date: b.planting_date, harvest_date: b.harvest_date,
        quantity: b.quantity, barcode: `893${1000000000 + b.id}`,
        trust_level: b.trust_level, approval_status: b.approval_status,
        created_at: `${b.planting_date}T02:00:00Z`,
        product_name: product.name, image: imgOf[b.id], farm_name: farm.farm_name,
        farm_id: farm.id, price: product.price, sold: b.sold,
    };
});

/* ============ Nhật ký canh tác ============ */
let logId = 1;
export const cultivationLogs: CultivationLog[] = batchSeeds.flatMap((b) => {
    const activities: { activity: string; description: string; daysAfterPlanting: number }[] = [
        { activity: "Gieo trồng / xuống giống", description: "Xuống giống trên luống đã xử lý đất, phủ màng phủ nông nghiệp.", daysAfterPlanting: 0 },
        { activity: "Bón phân hữu cơ đợt 1", description: "Bón lót phân chuồng hoai mục kết hợp phân vi sinh.", daysAfterPlanting: 10 },
        { activity: "Phòng trừ sâu bệnh sinh học", description: "Phun chế phẩm sinh học phòng sâu bệnh, không sử dụng thuốc hóa học.", daysAfterPlanting: 20 },
        { activity: "Kiểm tra & tỉa cành", description: "Kiểm tra sinh trưởng, tỉa lá già, làm cỏ thủ công.", daysAfterPlanting: 30 },
        { activity: "Thu hoạch", description: "Thu hoạch, phân loại và đóng gói ngay tại vườn.", daysAfterPlanting: 45 },
    ];
    const plant = new Date(b.planting_date);
    return activities.map((a) => {
        const d = new Date(plant);
        d.setDate(d.getDate() + a.daysAfterPlanting);
        return {
            id: logId++, batch_id: b.id, activity: a.activity, description: a.description,
            log_date: d.toISOString().slice(0, 10),
        };
    });
});

/* ============ Hình ảnh lô hàng ============ */
let batchImgId = 1;
export const batchImages: BatchImage[] = batchSeeds.flatMap((b) => {
    const base = imgOf[b.id];
    return [base, IMG.field1, IMG.field2].map((url) => ({
        id: batchImgId++, batch_id: b.id, image_url: url,
    }));
});

/* ============ Lịch sử duyệt ============ */
export const approvals: Approval[] = [
    { id: 1, batch_id: 1, admin_id: 1, status: "Approved", note: "Hồ sơ đầy đủ, nhật ký canh tác minh bạch.", approved_at: "2026-07-11T03:00:00Z" },
    { id: 2, batch_id: 2, admin_id: 1, status: "Approved", note: "Đạt yêu cầu chất lượng.", approved_at: "2026-07-16T03:00:00Z" },
    { id: 3, batch_id: 3, admin_id: 1, status: "Approved", note: "Chứng nhận VietGAP hợp lệ.", approved_at: "2026-07-21T03:00:00Z" },
    { id: 4, batch_id: 4, admin_id: 1, status: "Rejected", note: "Thiếu ảnh minh chứng thu hoạch, đề nghị bổ sung.", approved_at: "2026-07-26T03:00:00Z" },
    { id: 5, batch_id: 9, admin_id: 1, status: "Approved", note: "Nhật ký canh tác chi tiết, đạt chuẩn hữu cơ.", approved_at: "2026-08-02T03:00:00Z" },
];

/* ============ Đơn hàng ============ */
interface OrderSeed {
    id: number; buyer_id: number; receiver_name: string; receiver_phone: string; shipping_address: string;
    status: Order["status"]; tracking_note?: string; created_at: string;
    items: { batch_id: number; quantity: number }[];
}
const orderSeeds: OrderSeed[] = [
    { id: 1, buyer_id: 5, receiver_name: "Đỗ Thị Hương", receiver_phone: "0912000005", shipping_address: "12 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh", status: "Delivered", tracking_note: "Đã giao thành công cho khách.", created_at: "2026-07-15T01:00:00Z", items: [{ batch_id: 1, quantity: 3 }, { batch_id: 3, quantity: 2 }] },
    { id: 2, buyer_id: 6, receiver_name: "Vũ Minh Tuấn", receiver_phone: "0912000006", shipping_address: "45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", status: "Shipping", tracking_note: "Đang trung chuyển qua điểm gom Hà Nội.", created_at: "2026-08-01T01:00:00Z", items: [{ batch_id: 5, quantity: 4 }] },
    { id: 3, buyer_id: 7, receiver_name: "Ngô Thị Lan", receiver_phone: "0912000007", shipping_address: "78 Lê Lợi, Hải Châu, Đà Nẵng", status: "Preparing", tracking_note: "Người bán đang đóng gói.", created_at: "2026-08-03T01:00:00Z", items: [{ batch_id: 9, quantity: 2 }, { batch_id: 10, quantity: 5 }] },
    { id: 4, buyer_id: 5, receiver_name: "Đỗ Thị Hương", receiver_phone: "0912000005", shipping_address: "12 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh", status: "Completed", tracking_note: "Khách đã xác nhận nhận hàng.", created_at: "2026-07-20T01:00:00Z", items: [{ batch_id: 2, quantity: 2 }] },
    { id: 5, buyer_id: 8, receiver_name: "Bùi Quang Huy", receiver_phone: "0912000008", shipping_address: "23 Nguyễn Huệ, Ninh Kiều, Cần Thơ", status: "Confirmed", tracking_note: "Đơn hàng đã được xác nhận.", created_at: "2026-08-04T01:00:00Z", items: [{ batch_id: 7, quantity: 3 }] },
    { id: 6, buyer_id: 9, receiver_name: "Trịnh Thu Trang", receiver_phone: "0912000009", shipping_address: "9 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh", status: "Pending", tracking_note: "Chờ người bán xác nhận.", created_at: "2026-08-05T04:00:00Z", items: [{ batch_id: 6, quantity: 2 }, { batch_id: 8, quantity: 3 }] },
    { id: 7, buyer_id: 6, receiver_name: "Vũ Minh Tuấn", receiver_phone: "0912000006", shipping_address: "45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", status: "Cancelled", tracking_note: "Khách hủy do đổi ý.", created_at: "2026-07-28T01:00:00Z", items: [{ batch_id: 1, quantity: 1 }] },
    { id: 8, buyer_id: 7, receiver_name: "Ngô Thị Lan", receiver_phone: "0912000007", shipping_address: "78 Lê Lợi, Hải Châu, Đà Nẵng", status: "Completed", tracking_note: "Hoàn thành đơn hàng.", created_at: "2026-07-25T01:00:00Z", items: [{ batch_id: 3, quantity: 1 }, { batch_id: 9, quantity: 2 }] },
    { id: 9, buyer_id: 8, receiver_name: "Bùi Quang Huy", receiver_phone: "0912000008", shipping_address: "23 Nguyễn Huệ, Ninh Kiều, Cần Thơ", status: "Confirmed", tracking_note: "Đơn hàng đã được xác nhận, chờ người bán chuẩn bị.", created_at: "2026-08-06T01:00:00Z", items: [{ batch_id: 4, quantity: 2 }] },
    { id: 10, buyer_id: 9, receiver_name: "Trịnh Thu Trang", receiver_phone: "0912000009", shipping_address: "9 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh", status: "Preparing", tracking_note: "Người bán đang đóng gói.", created_at: "2026-08-06T03:00:00Z", items: [{ batch_id: 1, quantity: 1 }, { batch_id: 2, quantity: 2 }] },
];

const priceOf = (batchId: number) => products.find((p) => p.id === batchId)!.price;

export const orders: Order[] = orderSeeds.map((o) => ({
    id: o.id, buyer_id: o.buyer_id, receiver_name: o.receiver_name, receiver_phone: o.receiver_phone,
    shipping_address: o.shipping_address,
    total_price: o.items.reduce((s, i) => s + i.quantity * priceOf(i.batch_id), 0) + 25000,
    status: o.status, tracking_note: o.tracking_note, created_at: o.created_at,
}));

let orderDetailId = 1;
export const orderDetails: OrderDetail[] = orderSeeds.flatMap((o) =>
    o.items.map((i) => ({
        id: orderDetailId++, order_id: o.id, batch_id: i.batch_id, quantity: i.quantity, price: priceOf(i.batch_id),
    }))
);

/* ============ Đánh giá ============ */
export const reviews: Review[] = [
    { id: 1, buyer_id: 5, product_id: 1, rating: 5, comment: "Xà lách rất tươi, giòn, đúng như mô tả nguồn gốc.", created_at: "2026-07-18T02:00:00Z" },
    { id: 2, buyer_id: 5, product_id: 3, rating: 5, comment: "Dâu tây thơm ngọt, giao hàng nhanh, đóng gói cẩn thận.", created_at: "2026-07-22T02:00:00Z" },
    { id: 3, buyer_id: 6, product_id: 2, rating: 4, comment: "Cà chua ngon nhưng một số quả hơi mềm khi nhận.", created_at: "2026-07-24T02:00:00Z" },
    { id: 4, buyer_id: 7, product_id: 5, rating: 5, comment: "Cải bó xôi lá to, sạch, nấu canh rất ngọt.", created_at: "2026-08-02T02:00:00Z" },
    { id: 5, buyer_id: 8, product_id: 7, rating: 4, comment: "Mận giòn ngon, đúng vị Mộc Châu.", created_at: "2026-08-05T02:00:00Z" },
    { id: 6, buyer_id: 7, product_id: 9, rating: 5, comment: "Nấm tươi, không có mùi hóa chất, rất yên tâm.", created_at: "2026-07-27T02:00:00Z" },
];