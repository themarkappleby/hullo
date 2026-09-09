const setQueryParam = (param) => {
    const queryParams = new URLSearchParams(window.location.search);
    const key = Object.keys(param)[0]
    queryParams.set(key, param[key]);
    history.replaceState(null, null, "?"+queryParams.toString());
}

export default setQueryParam;