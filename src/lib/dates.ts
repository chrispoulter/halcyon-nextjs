export function now() {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now;
}

export function toLocaleString(value: string) {
    return new Date(`${value}T00:00:00.000Z`).toLocaleString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function toDate(value: string) {
    const isoString = `${value}T00:00:00.000Z`;
    const date = new Date(isoString);

    return !isNaN(date.getTime()) && isoString === date.toISOString()
        ? date
        : undefined;
}

export function isInPast(value: string) {
    if (!value) {
        return false;
    }

    const date = toDate(value);

    if (!date) {
        return false;
    }

    return date < now();
}
