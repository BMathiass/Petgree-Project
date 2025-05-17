export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidCPF(cpf) {
    return /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/.test(cpf);
}

export function isValidPasswordLength(password) {
    return password.length >= 6;
}

export function doPasswordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}