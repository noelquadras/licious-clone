import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import styles from "./QuantityButton.module.css";

const QuantityButton = ({ qty, onAdd, onRemove }) => {
  const [quantity, setQuantity] = useState(qty);

  const handleAdd = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onAdd(newQty);
  };

  const handleRemove = () => {
    if (quantity === 1) {
      setQuantity(0);
      onRemove(0);
    } else {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onRemove(newQty);
    }
  };

  // Default state → only plus
  if (quantity === 0) {
    return (
        <button className={styles.addBtn} onClick={handleAdd}>
          <Plus size={20} />
        </button>
    );
  }

  // Quantity selector state
  return (
    <div className={styles.counter}>
      <button onClick={handleRemove} className={styles.iconBtn}>
        <Minus size={20} />
      </button>

      <span className={styles.count}>{quantity}</span>

      <button onClick={handleAdd} className={styles.iconBtn}>
        <Plus size={20} />
      </button>
    </div>
  );
};

export default QuantityButton;
