// cap nhat so luong trong gio hang
const inputsQantity = document.querySelectorAll("input[name='quantity']");
console.log(inputsQantity);
if (inputsQantity.length > 0) {
    inputsQantity.forEach(input => {
        input.addEventListener("change", () => {
            const productId = input.getAttribute("product-id");
            const quantity = input.value;

            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}