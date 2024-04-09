// função para gerar codigos de referencia altomaticos
exports.generateRandomReferenceCode = () =>{
    let code = '';
    const digits = '0123456789';

    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        code += digits[randomIndex];
    }

    return code;
}