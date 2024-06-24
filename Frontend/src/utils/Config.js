const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000";

export const URLS = {
    fetchCountries: `${BASE_URL}/countries`,
    fetchVolcanoes: (country, populatedWithin) => {
        let url = `${BASE_URL}/volcanoes?country=${encodeURIComponent(country)}`;
        if (populatedWithin) {
            url += `&populatedWithin=${populatedWithin}`;
        }
        return url;
    },
    fetchVolcanoDetails: (volcanoId) => `${BASE_URL}/volcanoes/${encodeURIComponent(volcanoId)}`,
    volcanoListPage: (country) => `/volcanoes-list/country/${encodeURIComponent(country)}`,
    navigateToVolcano: (country, name, id) => {
        return `/volcanoes-list/country/${encodeURIComponent(country)}/volcano/${encodeURIComponent(name)}?id=${encodeURIComponent(id)}`;
    },
    loginUrl: `${BASE_URL}/users/login`,
    registerUrl: `${BASE_URL}/users/register`
};