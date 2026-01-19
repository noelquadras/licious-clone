import React from "react";
import styles from "./AddressModal.module.css";

const AddressModal = ({
  isOpen,
  title = "Address",
  mode = "add",
  formData,
  setFormData,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form
          className={styles.addressForm}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        >
          <div className={styles.twoCol}>
            <input
              className={styles.input}
              placeholder="Flat No"
              value={formData.flatNo}
              onChange={(e) =>
                setFormData({ ...formData, flatNo: e.target.value })
              }
              required
            />

            <input
              className={styles.input}
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>

          <input
            className={styles.input}
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          <input
            className={styles.input}
            placeholder="Landmark"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            required
          />

          <div className={styles.twoCol}>
            <select
              className={styles.input}
              value={formData.label}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ For Add mode, support custom label input when Other
                if (mode === "add") {
                  setFormData((prev) => ({
                    ...prev,
                    label: value,
                    customLabel: value === "Other" ? "" : prev.customLabel,
                  }));
                  return;
                }

                // ✅ For Edit mode (simple)
                setFormData({ ...formData, label: value });
              }}
              required
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

            {/* ✅ Only in ADD mode show custom label input */}
            {mode === "add" && formData.label === "Other" ? (
              <input
                className={styles.input}
                placeholder="Custom label"
                value={formData.customLabel || ""}
                onChange={(e) =>
                  setFormData({ ...formData, customLabel: e.target.value })
                }
                required
              />
            ) : (
              <button
                className={styles.addBtn}
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) return;

                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setFormData((prev) => ({
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
            )}
          </div>

          {/* ✅ If add mode and custom label is visible, we still need auto location button */}
          {mode === "add" && formData.label === "Other" && (
            <button
              className={styles.addBtnFull}
              type="button"
              onClick={() => {
                if (!navigator.geolocation) return;

                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setFormData((prev) => ({
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
          )}

          <div className={styles.twoCol}>
            <input
              className={styles.input}
              type="number"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              required
            />

            <input
              className={styles.input}
              type="number"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>

            <button className={styles.saveBtn} type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : mode === "add"
                  ? "Save Address"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
