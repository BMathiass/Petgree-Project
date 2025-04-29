export function setupRequiredAsterisk() {
    document.querySelectorAll('input[required], textarea[required], select[required]').forEach((input) => {
        const label = document.querySelector(`label[for="${input.id}"]`);

        if (label) {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    label.classList.add('filled'); // Remove o "*"
                } else {
                    label.classList.remove('filled'); // Mostra o "*"
                }
            });
        }
    });
}
