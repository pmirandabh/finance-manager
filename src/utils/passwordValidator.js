export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = password.length >= minLength && hasUpperCase && hasNumber;

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (hasUpperCase) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecialChar) strength += 1;
    if (password.length >= 12) strength += 1;

    const getFeedback = () => {
        if (!password) return '';
        if (password.length < 8) return 'Mínimo 8 caracteres';
        if (!hasUpperCase) return 'Adicione uma letra maiúscula';
        if (!hasNumber) return 'Adicione um número';
        return 'Senha forte';
    };

    return {
        isValid,
        strength: Math.min(strength, 5), // 0-5 scale
        feedback: getFeedback()
    };
};
