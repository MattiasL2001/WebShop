import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom';
import Modal from "../components/Modal";
import {
  GetUsersAdmin,
  GetProductsAdmin,
  adminCreateUser,
  adminUpdateUser,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminDeleteUser,
} from "../services/webShopServices";

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "products">("users");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [creatingNewItem, setCreatingNewItem] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.role !== 'Admin') {
        navigate('/home');
      }
    };

    checkUserRole();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "products") {
          const productsData = await GetProductsAdmin();
          setProducts(productsData);
        } else if (activeTab === "users") {
          const usersData = await GetUsersAdmin();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [activeTab]);

  if (user?.role != 'Admin') {
    return null;
  }

  const handleTabChange = (tab: "users" | "products") => {
    setActiveTab(tab);
  };

  const handleEdit = (item: any) => {
    setCreatingNewItem(false);
    setEditItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    const defaultItem =
      activeTab === "users"
        ? {
            firstName: "",
            lastName: "",
            password: "",
            email: "",
            birthDate: "",
          }
        : {
            name: "",
            description: "",
            price: 0,
            image: null,
            productAmount: 0,
            productType: 0,
            productColor: 0,
            productGender: 0,
          };
    setEditItem(defaultItem);
    setCreatingNewItem(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
    setCreatingNewItem(false);
  };

  const handleSave = async () => {
    try {
      if (creatingNewItem) {
        if (activeTab === "users") {
          const newUser = await adminCreateUser(editItem);
          setUsers((prevUsers) => [...prevUsers, newUser]);
        } else if (activeTab === "products") {
          const newProduct = await adminCreateProduct(editItem);
          setProducts((prevProducts) => [...prevProducts, newProduct]);
        }
      } else {
        if (activeTab === "users") {
          const updatedUser = await adminUpdateUser(editItem.id, editItem);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === updatedUser.id ? updatedUser : user
            )
          );
        } else if (activeTab === "products") {
          if (!editItem.id) {
            console.error("Product id is missing!");
            return;
          }
          const updatedProduct = await adminUpdateProduct(editItem.id, editItem);
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product
            )
          );
        }
      }
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      handleCloseModal();
    }
  };  

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminDeleteUser(id);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== id)
        );
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminDeleteProduct(id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <main className="admin-main">
        <section className="admin-section">
          <h1>Dashboard</h1>
          <p>
            Welcome to the admin dashboard. Use the navigation above to manage
            the webshop.
          </p>
        </section>
        <div className="tabs">
          <button
            className={activeTab === "users" ? "adminTab active" : "adminTab"}
            onClick={() => handleTabChange("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "products" ? "adminTab active" : "adminTab"}
            onClick={() => handleTabChange("products")}
          >
            Products
          </button>
        </div>

        {activeTab === "users" && (
          <section className="admin-section">
            <h2>Users</h2>
            <button className="create-button" onClick={handleCreate}>
              Create New User
            </button>
            <ul className="item-list">
              {users.map((user) => (
                <li key={user.id} className="item">
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeTab === "products" && (
          <section className="admin-section">
            <h2>Products</h2>
            <button className="create-button" onClick={handleCreate}>
              Create New Product
            </button>
            <ul className="item-list">
              {products.map((product) => (
                <li key={product.id} className="item">
                  <div className="product-details">
                  <h3>{product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name}</h3>
                  <p>{product.description.length > 50 ? product.description.substring(0, 20) + "..." : product.description}</p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {editItem && (
        <Modal show={showModal} onClose={handleCloseModal}>
          <form className="edit-form">
            {Object.keys(editItem)
              .filter((key) => key.toLowerCase() !== "id")
              .map((key) => (
                <div key={key} className="form-group">
                  <label>{key}</label>
                  <input
                    type={
                      key.toLowerCase() === "birthdate"
                        ? "date"
                        : key.toLowerCase() === "password"
                        ? "password"
                        : typeof editItem[key] === "number"
                        ? "number"
                        : "text"
                    }
                    value={editItem[key] ?? ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
          </form>
          <div className="form-actions">
            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
