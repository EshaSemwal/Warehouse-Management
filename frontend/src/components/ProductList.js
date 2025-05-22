import { useEffect, useState } from "react";
import { getProducts, createProduct } from "../api";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

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

  const currentProducts = products;

  const calculateStatus = (quantity, demand) => {
    const ratio = quantity / (demand || 1);
    if (ratio < 0.5) return 'Critical';
    if (ratio < 1) return 'Low Stock';
    return 'In Stock';
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
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Demand (Past Month)</th>
            <th>Price</th>
            <th>Zone</th>
            <th>Shelf</th>
            <th>Rack</th>
            <th>Individual Weight (kg)</th>
            <th>Total Weight (kg)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.ProductID}>
              <td>{product.ProductID}</td>
              <td>{product.ProductName}</td>
              <td>{product.Category}</td>
              <td>{product.Quantity}</td>
              <td>{product.DemandPastMonth}</td>
              <td>${product.Price.toFixed(2)}</td>
              <td>{product.Zone}</td>
              <td>{product.ShelfLocation}</td>
              <td>{product.RackLocation}</td>
              <td>{product.IndividualWeight_kg} kg</td>
              <td>{product.TotalWeight_kg} kg</td>
              <td>{calculateStatus(product.Quantity, product.DemandPastMonth)}</td>
              <td>
                <Link to={`/products/${product.ProductID}`}>
                  <Button type="primary" size="small">View</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}