export default function Loading() {
    return (
        <div
            className="flex items-center justify-center bg-black"
            style={{
                height: "calc(100vh - 80px)",
            }}
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <div className="text-white text-sm">Đang tải video...</div>
            </div>
        </div>
    );
}
