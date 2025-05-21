const SW = document.querySelector('.switch');

if (SW) {
    SW.onclick = function() {
        if (SW.classList.contains('active')) {
            SW.classList.remove('active');
            SW.classList.add('deactive');
        } else {
            SW.classList.remove('deactive');
            SW.classList.add('active');
        }
    };
}
