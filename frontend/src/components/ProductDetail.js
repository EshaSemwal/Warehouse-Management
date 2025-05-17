import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct } from "../api";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProduct(productId);
      setProduct(data);
    };
    loadProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.ProductName}</h1>
      <p>ID: {product.ProductID}</p>
      <p>Category: {product.Category}</p>
      <p>Stock: {product.Quantity}</p>
    </div>
  );
}