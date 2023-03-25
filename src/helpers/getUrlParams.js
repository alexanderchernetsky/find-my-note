export default function getUrlSearchParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};

    Array.from(searchParams.entries()).forEach(entry => {
        const [key, value] = entry;
        params[key] = value;
    });

    return params;
}
