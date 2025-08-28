document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const cartIcon = document.getElementById('cartIcon');
            const cartCount = document.getElementById('cartCount');
            const cartModal = document.getElementById('cartModal');
            const checkoutModal = document.getElementById('checkoutModal');
            const closeCart = document.getElementById('closeCart');
            const closeCheckout = document.getElementById('closeCheckout');
            const cartItems = document.getElementById('cartItems');
            const cartSubtotal = document.getElementById('cartSubtotal');
            const shippingCost = document.getElementById('shippingCost');
            const cartTotal = document.getElementById('cartTotal');
            const checkoutButton = document.getElementById('checkoutButton');
            const backToCart = document.getElementById('backToCart');
            const toPayment = document.getElementById('toPayment');
            const backToCustomer = document.getElementById('backToCustomer');
            const completeOrder = document.getElementById('completeOrder');
            const backToShopping = document.getElementById('backToShopping');
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            // Checkout steps
            const step1 = document.getElementById('step1');
            const step2 = document.getElementById('step2');
            const step3 = document.getElementById('step3');
            const step4 = document.getElementById('step4');
            
            // Checkout forms
            const customerForm = document.getElementById('customerForm');
            const paymentForm = document.getElementById('paymentForm');
            const confirmationScreen = document.getElementById('confirmationScreen');
            
            // Payment methods
            const paymentMethods = document.querySelectorAll('.payment-method');
            const creditCardForm = document.getElementById('creditCardForm');
            
            // Cart data
            let cart = [];
            const shippingFee = 15000;
            
            // Add event listeners to all buy buttons
            document.querySelectorAll('.buy-button').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseInt(this.getAttribute('data-price'));
                    const image = this.getAttribute('data-image');
                    
                    addToCart(id, name, price, image);
                    showToast('Produk ditambahkan ke keranjang');
                });
            });
            
            // Cart icon click
            cartIcon.addEventListener('click', function() {
                updateCartDisplay();
                cartModal.style.display = 'flex';
            });
            
            // Close modals
            closeCart.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });
            
            closeCheckout.addEventListener('click', function() {
                checkoutModal.style.display = 'none';
            });
            
            // Checkout button
            checkoutButton.addEventListener('click', function() {
                if (cart.length === 0) {
                    showToast('Keranjang belanja kosong');
                    return;
                }
                
                cartModal.style.display = 'none';
                checkoutModal.style.display = 'flex';
                resetCheckoutSteps();
            });
            
            // Navigation in checkout
            backToCart.addEventListener('click', function() {
                checkoutModal.style.display = 'none';
                cartModal.style.display = 'flex';
            });
            
            toPayment.addEventListener('click', function() {
                // Simple validation
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                
                if (!name || !email || !phone || !address) {
                    showToast('Harap isi semua field');
                    return;
                }
                
                customerForm.classList.remove('form-active');
                paymentForm.classList.add('form-active');
                step2.classList.remove('active');
                step3.classList.add('active');
            });
            
            backToCustomer.addEventListener('click', function() {
                paymentForm.classList.remove('form-active');
                customerForm.classList.add('form-active');
                step3.classList.remove('active');
                step2.classList.add('active');
            });
            
            completeOrder.addEventListener('click', function() {
                paymentForm.classList.remove('form-active');
                confirmationScreen.classList.add('form-active');
                step3.classList.remove('active');
                step4.classList.add('active');
            });
            
            backToShopping.addEventListener('click', function() {
                checkoutModal.style.display = 'none';
                cart = [];
                updateCartCount();
                resetCheckoutSteps();
                document.getElementById('customerForm').reset();
                
                // Reset to first step
                customerForm.classList.add('form-active');
                paymentForm.classList.remove('form-active');
                confirmationScreen.classList.remove('form-active');
            });
            
            // Payment method selection
            paymentMethods.forEach(method => {
                method.addEventListener('click', function() {
                    // Remove selected class from all methods
                    paymentMethods.forEach(m => m.classList.remove('selected'));
                    
                    // Add selected class to clicked method
                    this.classList.add('selected');
                    
                    // Show credit card form if credit card is selected
                    if (this.getAttribute('data-method') === 'credit-card') {
                        creditCardForm.style.display = 'block';
                    } else {
                        creditCardForm.style.display = 'none';
                    }
                });
            });
            
            // Functions
            function addToCart(id, name, price, image) {
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                updateCartCount();
            }
            
            function updateCartCount() {
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
            
            function updateCartDisplay() {
                cartItems.innerHTML = '';
                
                if (cart.length === 0) {
                    cartItems.innerHTML = '<p>Keranjang belanja kosong</p>';
                    checkoutButton.disabled = true;
                    checkoutButton.style.opacity = '0.7';
                } else {
                    checkoutButton.disabled = false;
                    checkoutButton.style.opacity = '1';
                    
                    cart.forEach(item => {
                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `
                            <img src="${item.image}" alt="${item.name}" width="50">
                            <div class="cart-item-info">
                                <div class="cart-item-title">${item.name}</div>
                                <div class="cart-item-price">Rp ${formatNumber(item.price)}</div>
                            </div>
                            <div class="cart-item-quantity">
                                <div class="quantity-btn" data-id="${item.id}" data-action="decrease">-</div>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <div class="quantity-btn" data-id="${item.id}" data-action="increase">+</div>
                            </div>
                            <div class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </div>
                        `;
                        cartItems.appendChild(cartItem);
                    });
                    
                    // Add event listeners to quantity buttons and remove buttons
                    document.querySelectorAll('.quantity-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            const action = this.getAttribute('data-action');
                            updateItemQuantity(id, action);
                        });
                    });
                    
                    document.querySelectorAll('.quantity-input').forEach(input => {
                        input.addEventListener('change', function() {
                            const id = this.getAttribute('data-id');
                            const newQuantity = parseInt(this.value);
                            
                            if (newQuantity < 1) {
                                this.value = 1;
                                updateItemQuantity(id, 'set', 1);
                            } else {
                                updateItemQuantity(id, 'set', newQuantity);
                            }
                        });
                    });
                    
                    document.querySelectorAll('.remove-item').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            removeFromCart(id);
                        });
                    });
                }
                
                // Update totals
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const total = subtotal + (cart.length > 0 ? shippingFee : 0);
                
                cartSubtotal.textContent = `Rp ${formatNumber(subtotal)}`;
                shippingCost.textContent = cart.length > 0 ? `Rp ${formatNumber(shippingFee)}` : 'Rp 0';
                cartTotal.textContent = `Rp ${formatNumber(total)}`;
            }
            
            function updateItemQuantity(id, action, value = null) {
                const item = cart.find(item => item.id === id);
                
                if (item) {
                    if (action === 'increase') {
                        item.quantity += 1;
                    } else if (action === 'decrease') {
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                        } else {
                            removeFromCart(id);
                            return;
                        }
                    } else if (action === 'set' && value !== null) {
                        item.quantity = value;
                    }
                    
                    updateCartCount();
                    updateCartDisplay();
                }
            }
            
            function removeFromCart(id) {
                cart = cart.filter(item => item.id !== id);
                updateCartCount();
                updateCartDisplay();
            }
            
            function showToast(message) {
                toastMessage.textContent = message;
                toast.classList.add('show');
                
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
            
            function resetCheckoutSteps() {
                step1.classList.add('completed');
                step2.classList.add('active');
                step3.classList.remove('active');
                step4.classList.remove('active');
                
                customerForm.classList.add('form-active');
                paymentForm.classList.remove('form-active');
                confirmationScreen.classList.remove('form-active');
                
                // Reset payment method selection
                paymentMethods.forEach(m => m.classList.remove('selected'));
                creditCardForm.style.display = 'none';
            }
            
            function formatNumber(num) {
                return new Intl.NumberFormat('id-ID').format(num);
            }
            
            // Close modals when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === cartModal) {
                    cartModal.style.display = 'none';
                }
                if (event.target === checkoutModal) {
                    checkoutModal.style.display = 'none';
                }
            });
        });