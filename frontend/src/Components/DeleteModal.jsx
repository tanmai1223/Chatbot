import style from "../Style/chat.module.css";

function DeleteModal({ chat, onCancel, onDelete }) {
  if (!chat) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modal}>
        <h2>Delete Chat</h2>

        <p>
          Are you sure you want to delete
          <br />
          <b>{chat.title}</b> ?
        </p>

        <div className={style.modalButtons}>
          <button className={style.cancelBtn} onClick={onCancel}>
            Cancel
          </button>

          <button
            className={style.deleteBtn}
            onClick={() => onDelete(chat._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
