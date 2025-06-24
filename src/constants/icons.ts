export const icons = {
    google: {
        svg: "/icon/google-icon.svg",
    },

    comment: {
        svg: "/icon/comment-icon.svg",
    },

    dislike: {
        svg: "/icon/dislike-icon.svg",
    },

    like: {
        svg: "/icon/like-icon.svg",
    },

    profile: {
        svg: "/icon/profile-icon.svg",
    },

    share: {
        svg: "/icon/share-icon.svg",
    },

    trending: {
        svg: "/icon/trending-icon.svg",
    },

    home: {
        svg: "/icon/home-icon.svg",
    },

    logo: {
        png: "/logo.png",
    },
} as const;

export type Icons = keyof typeof icons;
