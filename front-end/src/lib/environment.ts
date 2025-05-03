import {User} from "../types";

export const environment = {
    API_URL: "http://localhost:8082/api/v1/",
    SESSION_STORAGE: "book-sen-application",
    MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
    ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    DEFAULT_USER: {
        id: "",
        name: "",
        email: "",
        password: "",
        role: "USER",
        avatar: undefined,
    } as User,
}