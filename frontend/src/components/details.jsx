import { useLocation } from "react-router-dom";

const ProductDetails = () => {
  const location = useLocation();

  const product = location.state;

  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          display: "flex",
          gap: "20px",
          padding: "20px",
          border: "1px solid black",
          borderRadius: "5px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ flex: 1.5 }}>
          <img
            src={`https://loremflickr.com/800/500/${product.category}?lock=${product.id}`}
            alt={product.name}
            style={{
              width: "100%",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2>{product.name}</h2>
          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>
          <p>
            <strong>Description:</strong>
            {product.description}
          </p>
          <p>
            <strong>Rating:</strong>
            {product.rating}
          </p>
          <p>
            <strong>Stock:</strong>
            {product.stock}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
