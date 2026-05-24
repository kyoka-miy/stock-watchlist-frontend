import { Dispatch, SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";

type NewListTagButtonProps = {
  showAddPopup: boolean;
  setShowAddPopup: Dispatch<SetStateAction<boolean>>;
  newListName: string;
  setNewListName: Dispatch<SetStateAction<string>>;
  handleAddList: () => Promise<void>;
};

export const NewListTagButton = ({
  showAddPopup,
  setShowAddPopup,
  newListName,
  setNewListName,
  handleAddList,
}: NewListTagButtonProps) => {
  if (!showAddPopup) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "2px dashed #bfc8d6",
          borderRadius: 14,
          background: "#fff",
          color: "#222b45",
          fontWeight: 700,
          fontSize: 16,
          padding: "0.5rem 1.3rem",
          gap: 8,
          cursor: "pointer",
          transition: "all 0.18s",
          boxShadow: "none",
          letterSpacing: "0.01em",
        }}
        onClick={() => setShowAddPopup(true)}
        aria-label="新規リスト"
      >
        <FaPlus color="#1769ff" style={{ marginRight: 6, fontSize: 18 }} />{" "}
        新規リスト
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff",
        borderRadius: 18,
        border: "1.5px solid #e3e8ef",
        padding: "0.3rem 0.7rem 0.3rem 1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <input
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        style={{
          padding: "0.45rem 1.1rem",
          borderRadius: 8,
          border: "2px solid #3498db",
          fontSize: 15.5,
          minWidth: 140,
          outline: "none",
          background: "#fff",
          color: "#222",
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}
        placeholder="リスト名"
        autoFocus
      />
      <button
        onClick={handleAddList}
        type="button"
        disabled={!newListName.trim()}
        style={{
          background: !newListName.trim() ? "#e3e8ef" : "#1abc9c",
          color: !newListName.trim() ? "#bfc8d6" : "#fff",
          fontWeight: 700,
          borderRadius: 10,
          fontSize: 15.5,
          padding: "0.4rem 1.1rem",
          minWidth: 56,
          border: "none",
          boxShadow: "none",
          letterSpacing: "0.01em",
          transition: "all 0.18s",
        }}
      >
        作成
      </button>
      <button
        onClick={() => {
          setShowAddPopup(false);
          setNewListName("");
        }}
        type="button"
        style={{
          background: "#f0f1f4",
          color: "#222b45",
          fontWeight: 700,
          borderRadius: 10,
          fontSize: 15.5,
          padding: "0.4rem 1.1rem",
          minWidth: 56,
          border: "none",
          boxShadow: "none",
          letterSpacing: "0.01em",
          transition: "all 0.18s",
        }}
      >
        キャンセル
      </button>
    </div>
  );
};