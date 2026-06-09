import { FaEdit, FaTrash } from "react-icons/fa";
import styled from "styled-components";
import { StockListWithCount } from "@/app/api-interface/stockList";
import { Dispatch, SetStateAction, useState } from "react";
import { NewListTagButton } from "../molecules/NewListTagButton";
import { usePost } from "@/app/hooks/usePost";
import { ENDPOINTS } from "@/app/constants/endpointConstants";
import { usePut } from "@/app/hooks/usePut";

const Tab = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ $active }) => ($active ? "#1769ff" : "#fff")};
  border: ${({ $active }) => ($active ? "none" : "1.5px solid #d0d7e2")};
  border-radius: 16px;
  padding: 0.5rem 1.4rem 0.5rem 1.1rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#fff" : "#222b45")};
  cursor: pointer;
  min-width: 0;
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 16px rgba(23,105,255,0.13)" : "none"};
  gap: 10px;
  font-size: 16.5px;
  margin-right: 14px;
  letter-spacing: 0.01em;
  transition:
    box-shadow 0.18s,
    border 0.18s,
    background 0.18s,
    color 0.18s;
`;

const TabBadge = styled.span<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#1769ff" : "#e3e8ef")};
  color: ${({ $active }) => ($active ? "#fff" : "#6b7684")};
  border-radius: 12px;
  font-size: 13.5px;
  padding: 0 10px;
  margin-left: 6px;
  min-width: 22px;
  text-align: center;
  display: inline-block;
  font-weight: 700;
`;

type Props = {
  stockListsWithCount: StockListWithCount[];
  setStockListsWithCount: Dispatch<SetStateAction<StockListWithCount[]>>;
  selectedListId: number | undefined;
  setSelectedListId: Dispatch<SetStateAction<number | undefined>>;
  setShowDeletePopup: Dispatch<SetStateAction<boolean>>;
  refetchStockListsWithCount: () => void;
};

export const StockListTags = ({
  stockListsWithCount,
  setStockListsWithCount,
  selectedListId,
  setSelectedListId,
  setShowDeletePopup,
  refetchStockListsWithCount,
}: Props) => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editingListName, setEditingListName] = useState("");

  const { post: postList, loading: postLoading } = usePost(
    ENDPOINTS.STOCK_LISTS,
  );

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    const res = await postList({ name: newListName.trim(), account_id: 2 });
    if (res) {
      setStockListsWithCount([
        ...stockListsWithCount,
        { id: res.id, name: res.name, count: 0 },
      ]);
      console.log("Created new list:", stockListsWithCount);
      setSelectedListId(res.id);
    }
    setNewListName("");
    setShowAddPopup(false);
  };

  const { put: putListName, loading: putLoading } = usePut(
    editingListId ? `${ENDPOINTS.STOCK_LISTS}/${editingListId}` : "",
  );

  const handleUpdateListName = async (id: number) => {
    if (!editingListName.trim()) return;
    await putListName({ name: editingListName });
    setEditingListId(null);
    setEditingListName("");
    refetchStockListsWithCount();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "2rem 0 1.5rem 0",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {stockListsWithCount.map((list) => (
          <Tab
            key={list.id}
            $active={selectedListId === list.id}
            onClick={() => setSelectedListId(list.id)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {editingListId === list.id ? (
                <>
                  <input
                    type="text"
                    value={editingListName}
                    onChange={(e) => setEditingListName(e.target.value)}
                    style={{
                      fontSize: 15.5,
                      borderRadius: 8,
                      border: "2px solid #3498db",
                      padding: "0.2rem 0.7rem",
                      minWidth: 80,
                      marginRight: 6,
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    style={{
                      background: "#1769ff",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 10,
                      fontSize: 15.5,
                      padding: "0.2rem 0.9rem",
                      minWidth: 36,
                      border: "2px solid #fff",
                      marginRight: 2,
                      marginLeft: 2,
                      boxShadow: "none",
                      letterSpacing: "0.01em",
                      transition: "all 0.18s",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: editingListName.trim()
                        ? "pointer"
                        : "not-allowed",
                      opacity: editingListName.trim() ? 1 : 0.5,
                    }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (editingListName.trim()) {
                        await handleUpdateListName(list.id);
                      }
                    }}
                  >
                    ✓
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: 2 }}
                  >
                    <rect
                      x="3"
                      y="4.5"
                      width="12"
                      height="1.5"
                      rx="0.75"
                      fill={selectedListId === list.id ? "#fff" : "#6b7684"}
                    />
                    <rect
                      x="3"
                      y="8.25"
                      width="12"
                      height="1.5"
                      rx="0.75"
                      fill={selectedListId === list.id ? "#fff" : "#6b7684"}
                    />
                    <rect
                      x="3"
                      y="12"
                      width="12"
                      height="1.5"
                      rx="0.75"
                      fill={selectedListId === list.id ? "#fff" : "#6b7684"}
                    />
                  </svg>
                  {list.name}
                  <TabBadge $active={selectedListId === list.id}>
                    {list.count}
                  </TabBadge>
                </>
              )}
            </span>
            {selectedListId === list.id && editingListId !== list.id && (
              <>
                <FaEdit
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    marginRight: 2,
                    marginLeft: 8,
                    opacity: 1,
                    fontSize: 17,
                  }}
                  size={17}
                  title="Edit List"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingListId(list.id);
                    setEditingListName(list.name);
                  }}
                />
                <FaTrash
                  style={{
                    color: "#fff",
                    marginLeft: 2,
                    fontSize: 17,
                  }}
                  size={17}
                  title="Delete List"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeletePopup(true);
                  }}
                />
              </>
            )}
          </Tab>
        ))}
        <NewListTagButton
          showAddPopup={showAddPopup}
          setShowAddPopup={setShowAddPopup}
          newListName={newListName}
          setNewListName={setNewListName}
          handleAddList={handleAddList}
        />
      </div>
    </div>
  );
};
