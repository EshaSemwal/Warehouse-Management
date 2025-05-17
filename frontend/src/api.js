const API_BASE = "http://localhost:8000";

export const getProducts = async () => {
  const response = await fetch(`${API_BASE}/products/`);
  return await response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE}/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  return await response.json();
};