document.addEventListener('DOMContentLoaded', function () {
    const colorLinks = document.querySelectorAll('.color-link');
    colorLinks.forEach(link => {
        link.addEventListener('click', function () {
            const color = this.id;
            switch (color) {
                case 'gulf-blue':
                    document.documentElement.style.setProperty('--primary-color', '#26b3e6');
                    document.documentElement.style.setProperty('--secondary-color', '#1a9bc8');
                    break;
                case 'sunset-purple':
                    document.documentElement.style.setProperty('--primary-color', '#9b59b6');
                    document.documentElement.style.setProperty('--secondary-color', '#8e44ad');
                    break;
                case 'vivid-magenta':
                    document.documentElement.style.setProperty('--primary-color', '#e74c3c');
                    document.documentElement.style.setProperty('--secondary-color', '#c0392b');
                    break;
                case 'lightning-yellow':
                    document.documentElement.style.setProperty('--primary-color', '#f1c40f');
                    document.documentElement.style.setProperty('--secondary-color', '#f39c12');
                    break;
                case 'parrot-green':
                    document.documentElement.style.setProperty('--primary-color', '#2ecc71');
                    document.documentElement.style.setProperty('--secondary-color', '#27ae60');
                    break;
            }
        });
    });
});