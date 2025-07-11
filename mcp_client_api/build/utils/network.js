export const apiFetch = async (url, method, body, token) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        };
        if (body && method !== 'GET' && method !== 'HEAD') {
            options.body = JSON.stringify(body);
        }
        console.log(url, JSON.stringify(options));
        // console.log(JSON.stringify(body));
        const response = await fetch(url, options);
        // console.log(response)
        return response.json();
    }
    catch (error) {
        console.log(error);
    }
};
export const apiFetchStream = async (url, method, body, token) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        };
        if (body && method !== 'GET' && method !== 'HEAD') {
            options.body = JSON.stringify(body);
        }
        console.log(url, JSON.stringify(options));
        // console.log(JSON.stringify(body));
        const response = await fetch(url, options);
        // console.log(response)
        // return response.json();
        return response.body;
    }
    catch (error) {
        console.log(error);
    }
};
