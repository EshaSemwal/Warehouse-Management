const API_BASE = "http://localhost:8000/api";

export const getInventory = async () => {
  const response = await fetch(`${API_BASE}/inventory`);
  if (!response.ok) {
    throw new Error("Failed to fetch inventory data");
  }
  return await response.json();
};
export { getInventory as getProducts };


export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE}/inventory/${id}`);
  if (!response.ok) {
    throw new Error(`Product with ID ${id} not found`);
  }
  return await response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return await response.json();
};
