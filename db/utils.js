exports.createRefObject = (data, refObjKey, refObjValue) => {
    if(data.length === 0) {
        return {};
    }

    let output = data.map(el => [ el[refObjKey], el[refObjValue] ] )
    return Object.fromEntries(output)
}

