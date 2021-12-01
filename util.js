
const generateSessionID = () => {
    let text = '';
    const possible = 'ABCDEFGHKNOPQRSTUVXYZ';
    for (let i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


module.exports = {
    generateSessionID,
}