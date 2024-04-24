export default function () {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('beta') === 'true';
}