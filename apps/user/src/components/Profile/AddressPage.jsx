import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AddressPage.module.css";

const AddressPage = () => {
  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    localStorage.getItem("selectedAddressId") || "",
  );

  const [newAddressForm, setNewAddressForm] = useState({
    address: "",
    flatNo: "",
    landmark: "",
    city: "",
    label: "Home",
    latitude: "",
    longitude: "",
  });

  const [editAddressForm, setEditAddressForm] = useState({
    address: "",
    flatNo: "",
    landmark: "",
    city: "",
    label: "Home",
    latitude: "",
    longitude: "",
  });

  const [addrLoading, setAddrLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addAddress, setAddAddress] = useState(false);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        setAddrLoading(true);

        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res?.data?.user;
        const userAddresses = user?.addresses || [];

        setAddresses(userAddresses);

        if (!selectedAddressId && userAddresses.length > 0) {
          const firstId = userAddresses[0]._id;
          setSelectedAddressId(firstId);
          localStorage.setItem("selectedAddressId", firstId);
        }
      } catch (error) {
        console.error(
          "Error fetching addresses:",
          error.response?.data || error.message,
        );
      } finally {
        setAddrLoading(false);
      }
    };

    fetchUserAddresses();
  }, [token]);

  const handleSelectAddress = async (addr) => {
    try {
      setAddrLoading(true);

      setSelectedAddressId(addr._id);
      localStorage.setItem("selectedAddressId", addr._id);

      localStorage.setItem("selectedAddress", addr.address);
      localStorage.setItem("selectedCity", addr.city);
      localStorage.setItem("selectedFlatNo", addr.flatNo);

      const latitude = addr.location?.coordinates?.[1];
      const longitude = addr.location?.coordinates?.[0];

      if (latitude && longitude) {
        await axios.put(
          "/api/users/location",
          {
            latitude,
            longitude,
            address: addr.address,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    } catch (error) {
      console.log(
        "Select address error:",
        error.response?.data || error.message,
      );
    } finally {
      setAddrLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      setAddrLoading(true);

      const payload = {
        address: newAddressForm.address,
        flatNo: newAddressForm.flatNo,
        landmark: newAddressForm.landmark,
        city: newAddressForm.city,
        label: newAddressForm.label,
        latitude: Number(newAddressForm.latitude),
        longitude: Number(newAddressForm.longitude),
      };

      const res = await axios.post("/api/users/addresses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdAddress = res.data?.address;
      if (createdAddress) {
        setAddresses((prev) => [createdAddress, ...prev]);
      } else {
        const refreshed = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(refreshed.data?.user?.addresses || []);
      }

      setNewAddressForm({
        address: "",
        flatNo: "",
        landmark: "",
        city: "",
        label: "Home",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.log("Add address error:", error.response?.data || error.message);
    } finally {
      setAddrLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setAddrLoading(true);

      await axios.delete(`/api/users/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses((prev) => prev.filter((a) => a._id !== addressId));

      if (selectedAddressId === addressId) {
        setSelectedAddressId("");
        localStorage.removeItem("selectedAddressId");
      }
    } catch (error) {
      console.log(
        "Delete address error:",
        error.response?.data || error.message,
      );
    } finally {
      setAddrLoading(false);
    }
  };

  const openEditModal = (addr) => {
    setEditingAddressId(addr._id);

    setEditAddressForm({
      address: addr.address || "",
      flatNo: addr.flatNo || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      label: addr.label || "Home",
      latitude: addr.location?.coordinates?.[1] || "",
      longitude: addr.location?.coordinates?.[0] || "",
    });

    setEditModalOpen(true);
  };

  const handleEditAddress = async (addressId) => {
    try {
      setAddrLoading(true);

      const payload = {
        address: editAddressForm.address,
        flatNo: editAddressForm.flatNo,
        landmark: editAddressForm.landmark,
        city: editAddressForm.city,
        label: editAddressForm.label,
        latitude: Number(editAddressForm.latitude),
        longitude: Number(editAddressForm.longitude),
      };

      await axios.put(`/api/users/addresses/${addressId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses((prev) =>
        prev.map((addr) =>
          addr._id === addressId
            ? {
                ...addr,
                address: payload.address,
                flatNo: payload.flatNo,
                landmark: payload.landmark,
                city: payload.city,
                label: payload.label,
                location: {
                  type: "Point",
                  coordinates: [payload.longitude, payload.latitude],
                },
              }
            : addr,
        ),
      );

      setEditModalOpen(false);
      setEditingAddressId(null);
    } catch (error) {
      console.log("Edit address error:", error.response?.data || error.message);
    } finally {
      setAddrLoading(false);
    }
  };

  return (
    <div className={styles.addressBox}>
      <h3 className={styles.sectionTitle}>My Addresses</h3>

      {addrLoading && <p className={styles.loadingText}>Updating address...</p>}

      {addresses.length === 0 ? (
        <p className={styles.loadingText}>No addresses saved yet.</p>
      ) : (
        <div className={styles.addressGrid}>
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr._id;

            return (
              <div
                key={addr._id}
                className={`${styles.addressCard} ${
                  isSelected ? styles.addressSelected : ""
                }`}
                onClick={() => handleSelectAddress(addr)}
              >
                <div className={styles.addressTop}>
                  <span className={styles.addressLabel}>{addr.label}</span>

                  <div className={styles.addressActions}>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(addr);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className={styles.addressText}>
                  <strong>{addr.flatNo}</strong>, {addr.address}
                </p>

                <p className={styles.addressMeta}>
                  {addr.landmark}, {addr.city}
                </p>

                {isSelected && (
                  <span className={styles.selectedTag}>Selected</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        className={styles.editBtn}
        onClick={() => setAddAddress(!addAddress)}
      >
        Add New Address
      </button>
      {addAddress && (
        <form className={styles.addressForm} onSubmit={handleAddAddress}>
          <div className={styles.twoCol}>
            <input
              className={styles.input}
              placeholder="Flat No"
              value={newAddressForm.flatNo}
              onChange={(e) =>
                setNewAddressForm({ ...newAddressForm, flatNo: e.target.value })
              }
              required
            />

            <input
              className={styles.input}
              placeholder="City"
              value={newAddressForm.city}
              onChange={(e) =>
                setNewAddressForm({ ...newAddressForm, city: e.target.value })
              }
              required
            />
          </div>

          <input
            className={styles.input}
            placeholder="Address"
            value={newAddressForm.address}
            onChange={(e) =>
              setNewAddressForm({ ...newAddressForm, address: e.target.value })
            }
            required
          />

          <input
            className={styles.input}
            placeholder="Landmark"
            value={newAddressForm.landmark}
            onChange={(e) =>
              setNewAddressForm({ ...newAddressForm, landmark: e.target.value })
            }
            required
          />

          <div className={styles.twoCol}>
            <select
              className={styles.input}
              value={newAddressForm.label}
              onChange={(e) =>
                setNewAddressForm({ ...newAddressForm, label: e.target.value })
              }
              required
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

            <button
              className={styles.addBtn}
              type="button"
              onClick={() => {
                if (!navigator.geolocation) return;

                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setNewAddressForm((prev) => ({
                      ...prev,
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                    }));
                  },
                  (err) => console.log("Location error:", err.message),
                );
              }}
            >
              Auto Location
            </button>
          </div>

          <div className={styles.twoCol}>
            <input
              className={styles.input}
              type="number"
              placeholder="Latitude"
              value={newAddressForm.latitude}
              onChange={(e) =>
                setNewAddressForm({
                  ...newAddressForm,
                  latitude: e.target.value,
                })
              }
              required
            />

            <input
              className={styles.input}
              type="number"
              placeholder="Longitude"
              value={newAddressForm.longitude}
              onChange={(e) =>
                setNewAddressForm({
                  ...newAddressForm,
                  longitude: e.target.value,
                })
              }
              required
            />
          </div>

          <button className={styles.saveAddressBtn} disabled={addrLoading}>
            {addrLoading ? "Saving..." : "Save Address"}
          </button>
        </form>
      )}

      {editModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Address</h3>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={() => setEditModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form
              className={styles.addressForm}
              onSubmit={(e) => {
                e.preventDefault();
                handleEditAddress(editingAddressId);
              }}
            >
              <div className={styles.twoCol}>
                <input
                  className={styles.input}
                  placeholder="Flat No"
                  value={editAddressForm.flatNo}
                  onChange={(e) =>
                    setEditAddressForm({
                      ...editAddressForm,
                      flatNo: e.target.value,
                    })
                  }
                  required
                />
                <input
                  className={styles.input}
                  placeholder="City"
                  value={editAddressForm.city}
                  onChange={(e) =>
                    setEditAddressForm({
                      ...editAddressForm,
                      city: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <input
                className={styles.input}
                placeholder="Address"
                value={editAddressForm.address}
                onChange={(e) =>
                  setEditAddressForm({
                    ...editAddressForm,
                    address: e.target.value,
                  })
                }
                required
              />

              <input
                className={styles.input}
                placeholder="Landmark"
                value={editAddressForm.landmark}
                onChange={(e) =>
                  setEditAddressForm({
                    ...editAddressForm,
                    landmark: e.target.value,
                  })
                }
                required
              />

              <div className={styles.twoCol}>
                <select
                  className={styles.input}
                  value={editAddressForm.label}
                  onChange={(e) =>
                    setEditAddressForm({
                      ...editAddressForm,
                      label: e.target.value,
                    })
                  }
                  required
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>

                <button
                  className={styles.addBtn}
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) return;

                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setEditAddressForm((prev) => ({
                          ...prev,
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude,
                        }));
                      },
                      (err) => console.log("Location error:", err.message),
                    );
                  }}
                >
                  Auto Location
                </button>
              </div>

              <div className={styles.twoCol}>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="Latitude"
                  value={editAddressForm.latitude}
                  onChange={(e) =>
                    setEditAddressForm({
                      ...editAddressForm,
                      latitude: e.target.value,
                    })
                  }
                  required
                />
                <input
                  className={styles.input}
                  type="number"
                  placeholder="Longitude"
                  value={editAddressForm.longitude}
                  onChange={(e) =>
                    setEditAddressForm({
                      ...editAddressForm,
                      longitude: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={addrLoading}
                >
                  {addrLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
