module.exports = {
    plugins: [
        [
            "@fullhuman/postcss-purgecss",
            process.env.NODE_ENV === "production"
                ? {
                    // the paths to all template files
                    content: [
                        "./pages/**/*.{js,jsx,ts,tsx,svg}",
                        "./components/**/*.{js,jsx,ts,tsx,svg}",
                    ],
                    safelist: [/^col-/, 'body', 'html'],
                }
                : false,
        ],
    ],
};
