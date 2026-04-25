import { deleteSetoran } from "../../services/setoranService";

const SetoranItem = ({ item, onRefresh }) => {
  const handleDelete = async () => {
    try {
      console.log("DELETE ID:", item.id);

      const res = await deleteSetoran(item.id);

      if (res.response) {
        alert("Berhasil hapus ✅");
        onRefresh();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Gagal hapus ❌");
    }
  };

  return (
    <div>
      <p>{item.surah}</p>
      <button onClick={handleDelete}>Hapus</button>
    </div>
  );
};

export default SetoranItem;
