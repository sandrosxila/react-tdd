export const objectToQueryString = (object: object) => {
    const queryString = (Object.keys(object) as Array<keyof typeof object>)
        .filter(k => object[k] && object[k] !== '')
        .map(k => `${k}=${encodeURIComponent(object[k])}`)
        .join('&');
  
    if (queryString) return '?' + queryString;
    return '';
};
  