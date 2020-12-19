import React from "react";

export function randomSlug(length: number = 8) {
    // (c) 2009-2019 csharptest.net, Jake
    // SPDX-License-Identifier: CC-BY-SA-4.0
    // https://stackoverflow.com/a/1349426
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function useRandomSlug(length: number = 8) {
    const [slug, setSlug] = React.useState('');

    React.useEffect(() => {
        setSlug(randomSlug(length));
    }, [length]);

    return slug;
}