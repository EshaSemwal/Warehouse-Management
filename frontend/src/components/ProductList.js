import { useEffect, useState } from "react";
import { getProducts, createProduct } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ProductID: "",
    ProductName: "",
    Category: "",
    Quantity: 0,
    DemandPastMonth: 0,
    Price: 0,
    Zone: "",
    ShelfLocation: "",
    RackLocation: "",
    IndividualWeight_kg: 0,
    TotalWeight_kg: 0
});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(newProduct);
    await loadProducts(); // Refresh list
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={newProduct.ProductID}
          onChange={(e) => setNewProduct({...newProduct, ProductID: e.target.value})}
          placeholder="Product ID"
          required
        />
        {/* Add other input fields similarly */}
        <button type="submit">Add Product</button>
      </form>

      <h2>Product Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Demand</th>
            <th>Price</th>
            <th>Zone</th>
            <th>Shelf</th>
            <th>Rack</th>
            <th>Unit Wt</th>
            <th>Total Wt</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductID}>
              <td>{product.ProductID}</td>
              <td>{product.ProductName}</td>
              <td>{product.Category}</td>
              <td>{product.Quantity}</td>
              <td>${product.Price.toFixed(2)}</td>
              <td>{product.ShelfLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}