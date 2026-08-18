import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

async function bootstrap() {
    // Chưa có backend thật: dùng Mock Service Worker để chặn toàn bộ request API
    // và trả về dữ liệu giả, phục vụ demo / chụp ảnh báo cáo.
    // if (import.meta.env.DEV) {
    //     const { worker } = await import("./mocks/browser");
    //     await worker.start({
    //         onUnhandledRequest: "bypass",
    //         serviceWorker: { url: "/mockServiceWorker.js" },
    //     });
    // }

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}

bootstrap();
