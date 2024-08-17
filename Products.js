import React, { useEffect, useState } from 'react';
import './App.css'
const productsData = [
  {
    id: 1,
    name: 'Laptop',
    description: 'A high-performance laptop for work and play.',
    price: 999.99,
    category: 'Electronics',
    purchaseLimit:5
  },
  {
    id: 2,
    name: 'Smartphone',
    description: 'A latest-gen smartphone with cutting-edge features.',
    price: 699.99,
    category: 'Electronics',
    purchaseLimit:4
  },
  {
    id: 3,
    name: 'Running Shoes',
    description: 'Comfortable running shoes for all terrains.',
    price: 59.99,
    category: 'Sportswear',
    purchaseLimit:6
  }
];

const inventoryData = [
  {
    productId: 1,
    quantity: 5
  },
  {
    productId: 2,
    quantity: 100
  },
  {
    productId: 3,
    quantity: 200
  }
];

const App = () => {
  const [view, setView] = useState(() => {
    const savedView = localStorage.getItem('view');
    return savedView ? savedView : 'table';
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const toggleView = () => {
    setView(view === 'table' ? 'grid' : 'table');
  };

  const addToCart = (productId) => {
    const product = productsData.find(p => p.id === productId);
    const productInventory = inventoryData.find(item => item.productId === productId);
    const cartCount = cart.filter(id => id === productId).length;

    if (cartCount < product.purchaseLimit && cartCount < productInventory.quantity) {
      setCart([...cart, productId]);
    } else if (cartCount >= productInventory.quantity) {
      alert(`Only ${productInventory.quantity} of ${product.name} left in inventory`);
    } else {
      alert(`You can only purchase ${product.purchaseLimit} of ${product.name}`);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((id, index) => {
      return index !== cart.lastIndexOf(productId);
    }));
  };
  const getTotalItems = () => {
    return cart.length;
  };
  const getTotalPrice = () => {
    return cart.reduce((total, productId) => {
      const product = productsData.find(p => p.id === productId);
      return total + product.price;
    }, 0);
  };
  const getCartCount = (productId) => {
    return cart.filter(id => id === productId).length;
  };

  const isLowInventory = (productId) => {
    const productInventory = inventoryData.find(item => item.productId === productId);
    return productInventory.quantity <= 3; // Define what "low" inventory means
  };

  return (
    <div className="App">
    <button onClick={toggleView} >
      Switch to {view === 'table' ? 'Grid View' : 'Table View'}
    </button>
    {view === 'table' ? (
      <TableView products={productsData} inventory={inventoryData} addToCart={addToCart}  removeFromCart={removeFromCart} getCartCount={getCartCount} isLowInventory={isLowInventory}/>
    ) : (
      <GridView products={productsData} inventory={inventoryData} addToCart={addToCart} removeFromCart={removeFromCart} getCartCount={getCartCount} isLowInventory={isLowInventory}/>
    )}
    <CartSummary cart={cart} products={productsData}  getTotalItems={getTotalItems} getTotalPrice={getTotalPrice}/>

  </div>
  );
};
const TableView = ({ products, inventory,addToCart,removeFromCart, getCartCount ,isLowInventory }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Purchase Limit</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => {
          const productInventory = inventory.find(item => item.productId === product.id);
          return (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>{productInventory ? productInventory.quantity : 'N/A'}{isLowInventory(product.id) && <span className="warning"> (Low Stock)</span>}</td>
              <td>{product.purchaseLimit}</td>
              <td>
                <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                <button onClick={() => removeFromCart(product.id)}>Remove from Cart</button>
                <span> ({getCartCount(product.id)})</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
const GridView = ({ products, inventory ,addToCart, removeFromCart,getCartCount ,isLowInventory }) => {
  return (
    <div className="grid-container">
      {products.map(product => {
        const productInventory = inventory.find(item => item.productId === product.id);
        return (
          <div key={product.id} className="grid-item">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>Quantity: {productInventory ? productInventory.quantity : 'N/A'}{isLowInventory(product.id) && <span className="warning"> (Low Stock)</span>}</p>
            <p>Purchase Limit: {product.purchaseLimit}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            <button onClick={() => removeFromCart(product.id)}>Remove from Cart</button>
            <span> ({getCartCount(product.id)})</span>
          </div>
        );
      })}
    </div>
  );
};
const CartSummary = ({ cart, products, getTotalItems, getTotalPrice }) => {
  const cartItems = cart.reduce((acc, productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      if (!acc[productId]) {
        acc[productId] = { ...product, count: 0 };
      }
      acc[productId].count += 1;
    }
    return acc;
  }, {});

  return (
    <div className="cart-summary">
      <h2>Cart Summary</h2>
      <p>Total Items: {getTotalItems()}</p>
      <p>Total Price: ${getTotalPrice()}</p>
      {Object.values(cartItems).map(item => (
        <div key={item.id}>
          <p>{item.name} x {item.count}</p>
        </div>
      ))}
    </div>
  );
};
export default App;