export const getItem = key => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    return (
        window.sessionStorage.getItem(key) || window.localStorage.getItem(key)
    );
};

export const setItem = (key, value, persist) => {
    if (typeof window === 'undefined') {
        return;
    }

    if (persist) {
        window.sessionStorage.removeItem(key);
        window.localStorage.setItem(key, value);
    } else {
        window.localStorage.removeItem(key);
        window.sessionStorage.setItem(key, value);
    }
};

export const removeItem = key => {
    if (typeof window === 'undefined') {
        return;
    }

    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
};
