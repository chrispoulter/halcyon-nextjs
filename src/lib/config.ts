export const config = {
    VERSION: String(process.env.npm_package_version),
    SESSION_SECRET: String(process.env.SESSION_SECRET),
    SESSION_DURATION: Number(process.env.SESSION_DURATION),
};
