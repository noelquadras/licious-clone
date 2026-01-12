import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedStoreName = localStorage.getItem("storeName");
    const storedPhone = localStorage.getItem("phone");
    const storedAddress = localStorage.getItem("address");
    const storedStatus = localStorage.getItem("status");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedStoreName) setStoreName(storedStoreName);
    if (storedPhone) setPhone(storedPhone);
    if (storedAddress) setAddress(storedAddress);
    if (storedStatus) setStatus(storedStatus);

    setLoading(false);
  }, []);

  if (loading) {
    return <div className={styles.loadingText}>Loading your experience...</div>;
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <p className={styles.loading}>Loading vendor details...</p>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.username}>{username || "Vendor"}</h2>
            <span
              className={`${styles.status} ${
                status === "approved"
                  ? styles.approved
                  : status === "pending"
                  ? styles.pending
                  : styles.rejected
              }`}
            >
              {status || "pending"}
            </span>
          </div>

          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Store Name</span>
              <span className={styles.value}>{storeName || "-"}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{email || "-"}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{phone || "-"}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Address</span>
              <span className={styles.value}>{address || "-"}</span>
            </div>
          </div>

          {status !== "approved" && (
            <div className={styles.notice}>
              <p>
                Your store is currently under review. You will be able to add
                products once approved by admin.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
