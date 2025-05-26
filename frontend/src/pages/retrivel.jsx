import React, { useState, useEffect } from 'react';
import { FaSearch, FaQrcode, FaBox, FaMoneyBillWave, FaChartLine, FaWarehouse, FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaRupeeSign, FaExclamationTriangle, FaInfoCircle, FaTrash, FaPlus, FaMinus, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import './retrivel.css';
import { message, Card, Radio, Button, Steps, Alert, Table, AutoComplete, Spin } from 'antd';

const Retrieval = () => {
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    scanMode: false
  });
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [currentStep, setCurrentStep] = useState(0);
  const [quantityError, setQuantityError] = useState(null);
  const [itemError, setItemError] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/inventory/');
      if (!response.ok) throw new Error('Network error while fetching products');
      const data = await response.json();
      setAllProducts(data);
      updateProductOptions(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      message.error(`Failed to load products: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductOptions = (products) => {
    const options = products.map(product => ({
      value: `${product.ProductName} (ID: ${product.ProductID})`,
      key: product.ProductID,
      label: (
        <div className="product-option">
          <div className="product-option-name">{product.ProductName}</div>
          <div className="product-option-details">
            <span>ID: {product.ProductID}</span>
            <span>Price: ₹{product.Price}</span>
            <span>Stock: {product.Quantity}</span>
          </div>
        </div>
      )
    }));
    setProductOptions(options);
  };

  const handleSearch = (value) => {
    if (!value) {
      updateProductOptions(allProducts);
      return;
    }
    const filteredProducts = allProducts.filter(product =>
      product.ProductName.toLowerCase().includes(value.toLowerCase()) ||
      product.ProductID.toLowerCase().includes(value.toLowerCase())
    );
    updateProductOptions(filteredProducts);
  };

  const handleSelect = (value, option) => {
    setFormData(prev => ({ ...prev, itemId: option.key }));
  };

  const handleScanToggle = () => {
    setFormData({ ...formData, scanMode: !formData.scanMode });
    setItemError(null);
  };

  const validateQuantity = (quantity, availableQuantity) => {
    if (quantity <= 0) {
      return { valid: false, message: 'Quantity must be greater than 0' };
    }
    if (quantity > availableQuantity) {
      return { valid: false, message: `Only ${availableQuantity} units available in stock` };
    }
    return { valid: true };
  };

  const validateItemId = (itemId) => {
    if (!itemId.trim()) {
      return { valid: false, message: 'Please enter a product ID or name' };
    }
    return { valid: true };
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsRetrieving(true);
    setQuantityError(null);
    setItemError(null);

    try {
      const itemValidation = validateItemId(formData.itemId);
      if (!itemValidation.valid) {
        setItemError(itemValidation.message);
        setIsRetrieving(false);
        return;
      }

      const found = allProducts.find(p => p.ProductID === formData.itemId);
      if (!found) {
        setItemError('Product not found. Please check the ID or name and try again.');
        setIsRetrieving(false);
        return;
      }

      const reqQty = Number(formData.quantity);
      const quantityValidation = validateQuantity(reqQty, found.Quantity);
      if (!quantityValidation.valid) {
        setQuantityError(quantityValidation.message);
        setIsRetrieving(false);
        return;
      }

      const existingProductIndex = selectedProducts.findIndex(p => p.ProductID === found.ProductID);
      if (existingProductIndex !== -1) {
        const updatedProducts = [...selectedProducts];
        const newQuantity = updatedProducts[existingProductIndex].retrievedQuantity + reqQty;
        if (newQuantity > found.Quantity) {
          setQuantityError(`Total quantity (${newQuantity}) exceeds available stock (${found.Quantity})`);
          setIsRetrieving(false);
          return;
        }
        updatedProducts[existingProductIndex].retrievedQuantity = newQuantity;
        updatedProducts[existingProductIndex].totalPrice = found.Price * newQuantity;
        setSelectedProducts(updatedProducts);
      } else {
        setSelectedProducts([...selectedProducts, {
          ...found,
          retrievedQuantity: reqQty,
          totalPrice: found.Price * reqQty
        }]);
      }

      message.success('Product added to cart!');
      setFormData({ itemId: '', quantity: 1, scanMode: false });
    } catch (err) {
      message.error(`Error adding product to cart: ${err.message}`);
    }
    setIsRetrieving(false);
  };

  const handleRemoveFromCart = (productId) => {
    const product = selectedProducts.find(p => p.ProductID === productId);
    if (window.confirm(`Remove ${product?.ProductName} from cart?`)) {
      setSelectedProducts(selectedProducts.filter(p => p.ProductID !== productId));
      message.success('Product removed from cart');
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const product = selectedProducts.find(p => p.ProductID === productId);
    if (!product) return;

    const quantityValidation = validateQuantity(newQuantity, product.Quantity);
    if (!quantityValidation.valid) {
      setQuantityError(quantityValidation.message);
      return;
    }

    setSelectedProducts(selectedProducts.map(p =>
      p.ProductID === productId
        ? { ...p, retrievedQuantity: newQuantity, totalPrice: p.Price * newQuantity }
        : p
    ));
  };

  const handleProceedToPayment = () => {
    if (selectedProducts.length === 0) {
      message.error('Please add products to cart first');
      return;
    }
    setCurrentStep(1);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      for (const product of selectedProducts) {
        const updated = {
          Quantity: product.Quantity - product.retrievedQuantity,
          DemandPastMonth: (product.DemandPastMonth || 0) + product.retrievedQuantity
        };
        const response = await fetch(`http://localhost:8000/api/inventory/${product.ProductID}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        if (!response.ok) {
          throw new Error(`Failed to update inventory for product ${product.ProductID}`);
        }
      }

      message.loading('Processing payment...', 1.5);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCurrentStep(2);
      message.success('Payment successful!');
      setTimeout(() => {
        setSelectedProducts([]);
        setCurrentStep(0);
        setPaymentMethod('card');
        setIsProcessingPayment(false);
      }, 2000);
    } catch (err) {
      message.error(`Error processing payment: ${err.message}`);
      console.error('Payment error:', err);
      setIsProcessingPayment(false);
    }
  };

  const handleStepChange = (step) => {
    if (step === 0 && currentStep > 0) {
      message.warning('Cannot go back to selection after payment has started');
      return;
    }
    if (step === 2) {
      message.warning('Please complete the payment process first');
      return;
    }
    setCurrentStep(step);
  };

  const CartTable = () => {
    const columns = [
      {
        title: 'Product',
        dataIndex: 'ProductName',
        key: 'ProductName',
        render: (text, record) => (
          <div className="product-cell">
            <span className="product-name">{text}</span>
            <span className="product-id">ID: {record.ProductID}</span>
          </div>
        ),
      },
      {
        title: 'Location',
        key: 'location',
        render: (record) => `Zone ${record.Zone} - Shelf ${record.ShelfLocation}`,
      },
      {
        title: 'Unit Price',
        dataIndex: 'Price',
        key: 'Price',
        render: (price) => `₹${price.toFixed(2)}`,
      },
      {
        title: 'Quantity',
        key: 'quantity',
        render: (record) => (
          <div className="quantity-controls">
            <Button
              icon={<FaMinus />}
              onClick={() => handleUpdateQuantity(record.ProductID, record.retrievedQuantity - 1)}
              disabled={record.retrievedQuantity <= 1}
              title="Decrease quantity"
            />
            <span>{record.retrievedQuantity}</span>
            <Button
              icon={<FaPlus />}
              onClick={() => handleUpdateQuantity(record.ProductID, record.retrievedQuantity + 1)}
              disabled={record.retrievedQuantity >= record.Quantity}
              title="Increase quantity"
            />
          </div>
        ),
      },
      {
        title: 'Total',
        key: 'total',
        render: (record) => `₹${record.totalPrice.toFixed(2)}`,
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => (
          <Button
            type="text"
            danger
            icon={<FaTrash />}
            onClick={() => handleRemoveFromCart(record.ProductID)}
            title="Remove from cart"
          />
        ),
      },
    ];

    return (
      <div className="cart-section">
        <h2>Selected Products</h2>
        <Table
          columns={columns}
          dataSource={selectedProducts}
          rowKey="ProductID"
          pagination={false}
          className="cart-table"
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
        />
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (18% GST):</span>
            <span>₹{(selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0) * 0.18).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{(selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0) * 1.18).toFixed(2)}</span>
          </div>
          <Button
            type="primary"
            size="large"
            className="proceed-btn"
            onClick={handleProceedToPayment}
            disabled={selectedProducts.length === 0}
            title="Proceed to payment"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  };

  const PaymentSection = () => {
    const totalAmount = selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0) * 1.18;

    return (
      <Card className="payment-card">
        <div className="payment-header">
          <h2>Payment Details</h2>
          <div className="total-amount">
            <FaRupeeSign className="rupee-icon" />
            <span>{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="payment-methods">
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-options"
          >
            <Radio.Button value="card" className="payment-option" title="Pay with Credit/Debit Card">
              <FaCreditCard /> Credit/Debit Card
            </Radio.Button>
            <Radio.Button value="paypal" className="payment-option" title="Pay with PayPal">
              <FaPaypal /> PayPal
            </Radio.Button>
            <Radio.Button value="gpay" className="payment-option" title="Pay with Google Pay">
              <FaGooglePay /> Google Pay
            </Radio.Button>
            <Radio.Button value="apple" className="payment-option" title="Pay with Apple Pay">
              <FaApplePay /> Apple Pay
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="payment-summary">
          <div className="summary-item">
            <span>Subtotal</span>
            <span>₹{selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0).toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax (18% GST)</span>
            <span>₹{(selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0) * 0.18).toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="retrieval-container">
      {isLoading && (
        <div className="loading-overlay">
          <Spin indicator={<FaSpinner className="spinner" size={48} />} tip="Loading products..." />
        </div>
      )}
      <header className="retrieval-header">
        <h1><FaBox /> Item Retrieval</h1>
        <p>Retrieve products by name or ID with ease</p>
      </header>
      <Steps
        current={currentStep}
        items={[
          { title: 'Select Items', description: 'Add products to cart' },
          { title: 'Payment', description: 'Complete payment' },
          { title: 'Done', description: 'Transaction complete' },
        ]}
        className="retrieval-steps"
        onChange={handleStepChange}
      />
      <div className="retrieval-content">
        {currentStep === 0 && (
          <>
            <section className="retrieval-form-section">
              {itemError && (
                <Alert
                  message="Product Not Found"
                  description={itemError}
                  type="error"
                  showIcon
                  icon={<FaInfoCircle />}
                  className="item-error-alert"
                  closable
                  onClose={() => setItemError(null)}
                />
              )}
              {quantityError && (
                <Alert
                  message="Quantity Error"
                  description={quantityError}
                  type="error"
                  showIcon
                  icon={<FaExclamationTriangle />}
                  className="quantity-error-alert"
                  closable
                  onClose={() => setQuantityError(null)}
                />
              )}
              <form onSubmit={handleAddToCart}>
                <div className="form-group">
                  <label>
                    <FaSearch /> Item ID/Name
                    <button
                      type="button"
                      className="scan-toggle"
                      onClick={handleScanToggle}
                      title={formData.scanMode ? 'Switch to manual entry' : 'Scan QR code'}
                    >
                      <FaQrcode /> {formData.scanMode ? 'Manual Entry' : 'Scan QR'}
                    </button>
                  </label>
                  {formData.scanMode ? (
                    <div className="qr-scan-placeholder">
                      <div className="qr-scanner">
                        <FaQrcode size={64} />
                        <p>Point camera at QR code</p>
                      </div>
                    </div>
                  ) : (
                    <AutoComplete
                      options={productOptions}
                      onSearch={handleSearch}
                      onSelect={handleSelect}
                      value={formData.itemId}
                      onChange={(value) => {
                        setFormData({ ...formData, itemId: value });
                        setItemError(null);
                      }}
                      placeholder="Search by product name or ID"
                      className={itemError ? 'error-input' : ''}
                      style={{ width: '100%' }}
                      dropdownClassName="product-dropdown"
                      aria-label="Search product by name or ID"
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData({ ...formData, quantity: e.target.value });
                      setQuantityError(null);
                    }}
                    required
                    className={quantityError ? 'error-input' : ''}
                    aria-label="Enter quantity"
                  />
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isRetrieving}
                  title="Add product to cart"
                >
                  {isRetrieving ? 'Adding...' : 'Add to Cart'}
                </button>
              </form>
            </section>
            <CartTable />
          </>
        )}
        {currentStep === 1 && (
          <div className="payment-section">
            <PaymentSection />
            <div className="payment-actions">
              <Button
                type="default"
                size="large"
                onClick={() => setCurrentStep(0)}
                className="back-btn"
                disabled={isProcessingPayment}
                title="Return to cart"
              >
                Back to Cart
              </Button>
              <Button
                type="primary"
                size="large"
                className="pay-button"
                onClick={handlePayment}
                disabled={isProcessingPayment}
                title="Complete payment"
              >
                {isProcessingPayment ? (
                  <span className="loading-payment">
                    <FaSpinner className="spinner" /> Processing Payment...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="success-section">
            <div className="success-content">
              <FaCheckCircle size={64} color="#2ecc71" />
              <h2>Payment Successful!</h2>
              <p>Your order has been processed successfully.</p>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setSelectedProducts([]);
                  setCurrentStep(0);
                  setPaymentMethod('card');
                }}
                title="Start a new order"
              >
                Start New Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Retrieval;