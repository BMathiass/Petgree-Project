// formatUtils.js
export const FormatUtils = {
    // formatUtils.js
formatTelefone(value) {
    if (!value) return '';
    
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a quantidade de caracteres
    const limited = numbers.slice(0, 11);
    
    // Aplica a máscara conforme o tamanho
    if (limited.length <= 10) {
        // Formato para telefone fixo: (99) 9999-9999
        return limited.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (match, ddd, prefix, suffix) => {
            let result = '';
            if (ddd) result += `(${ddd}`;
            if (prefix) result += `) ${prefix}`;
            if (suffix) result += `-${suffix}`;
            return result;
        });
    } else {
        // Formato para celular: (99) 99999-9999
        return limited.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (match, ddd, prefix, suffix) => {
            let result = '';
            if (ddd) result += `(${ddd}`;
            if (prefix) result += `) ${prefix}`;
            if (suffix) result += `-${suffix}`;
            return result;
        });
    }
},

    formatCPF(value) {
        if (!value) return '';

        // Mantém apenas números
        const numbers = value.replace(/\D/g, '');

        // Limita o tamanho
        const limited = numbers.slice(0, 11);

        // Aplica a máscara conforme o tamanho
        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 6) {
            return limited.replace(/(\d{3})(\d{0,3})/, '$1.$2');
        } else if (limited.length <= 9) {
            return limited.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
        } else {
            return limited.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
        }
    }
};