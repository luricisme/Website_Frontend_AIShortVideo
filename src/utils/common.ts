export const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const createUniqueUsername = (firstName: string, lastName: string) => {
    let base = `${firstName}-${lastName}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
        .replace(/[^a-zA-Z0-9-]/g, "") // Chỉ giữ chữ, số, dấu -
        .replace(/\s+/g, "-")
        .toLowerCase();

    const baseParts = base.split("").filter(Boolean);
    const shuffledParts = shuffleArray(baseParts);
    base = shuffledParts.join("");

    const random = Math.floor(100000 + Math.random() * 900000);
    const timestamp = Date.now();

    return base ? `${base}-${random}-${timestamp}` : `user-${random}-${timestamp}`;
};

export const formatNumberToSocialStyle = (number: number) => {
    let result = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    })
        .format(number)
        .replace(".", ",");

    result = result.slice(0, result.length - 1) + " " + result.slice(-1).toUpperCase();

    return result;
};

export const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 0 || isNaN(diffInSeconds)) {
        return "just now";
    }

    const intervals = [
        { label: "year", seconds: 31536000 }, // 365 * 24 * 60 * 60
        { label: "month", seconds: 2592000 }, // 30 * 24 * 60 * 60
        { label: "week", seconds: 604800 }, // 7 * 24 * 60 * 60
        { label: "day", seconds: 86400 }, // 24 * 60 * 60
        { label: "hour", seconds: 3600 }, // 60 * 60
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        
        if (count >= 1) {
            if (count === 1) {
                return `${count} ${interval.label} ago`;
            } else {
                // Thêm 's' cho số nhiều
                return `${count} ${interval.label}s ago`;
            }
        }
    }

    return "just now";
};
