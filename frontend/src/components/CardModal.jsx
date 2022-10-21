import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import dayjs from "dayjs";
import "../styles/card-modal.scss";

import CommentService from "../lib/CommentsService";
import ActivityService from "../lib/ActivityService";
import Menu from "./DropdownMenu";
import { editCard, deleteCard } from "../store/boardData";

function CardModal({ listId, cardId, show, onClose }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const userData = useSelector((state) => state.user);
  const lists = useSelector((state) => state.board.lists);

  const card = useMemo(() => {
    return lists.find((item) => item._id === listId)
      .cards.find((item) => item._id === cardId);
  }, [listId, cardId, lists]);

  const [showDetails, setShowDetails] = useState(true);
  const [editDesc, setEditDesc] = useState(false);
  const [editValues, setEditValues] = useState({ title: card.title, description: card.description });
  const [deleteTab, setDeleteTab] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [activity, setActivity] = useState([]);

  const descriptionSave = async () => {
    dispatch(editCard({ id: card._id, data: { title: card.title, description: editValues.description } }))
    setEditDesc(false);
    setActivity([...activity, await ActivityService.create({ action: `Edit ${card.title} description`, author: userData._id, card: card._id })]);
  };

  const sendComment = async () => {
    const new_comment = await CommentService.create({ author: userData._id, card: card._id, list: card.list, content: comment });

    setComments([...comments, new_comment]);
  };

  useEffect(() => {
    const cardInfo = async () => {
      setComments(await CommentService.all(card._id));
      setActivity(await ActivityService.cardActivity(id, card._id));
    }
    cardInfo();
  }, [card._id, id]);

  const cardDelete = async () => {
    onClose();
    dispatch(deleteCard(card));
  }

  const deleteComment = async (id) => {
    await CommentService.delete(id);
    setComments(comments.filter(item => item._id !== id));
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="card-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="card-header d-flex fs-5">
          <i className="far fa-scroll fix-width fs-5"></i>
          <span className="card-title">
            {card.title}
            <br />
            <span className="list-name fs-6 fw-normal">in list <span className="text-decoration-underline">Aboba</span></span>
          </span>

          <span className="mobile-menu">
            <Menu icon={true}>
              <span className="dropdown-menu-item" onClick={() => setDeleteTab(true)}>Remove</span>
            </Menu>
          </span>

        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex">
          <div className="content flex-grow-1">
            <span className="d-flex">
              {!card.description || editDesc ? <div className="fix-width"></div> : null}
              {
                !editDesc && !card.description ?
                  <span className="input-group-text flex-grow-1" id="inputGroup-sizing-sm w-100">
                    <i className="fas fa-align-left fs-5"></i>
                    <span className="ms-3 text-decoration-underline" onClick={() => setEditDesc(true)}>Edit the description</span>
                  </span>
                  : editDesc ? <div className="form-floating flex-grow-1">
                    <textarea className="form-control" onChange={(event) => setEditValues({ ...editValues, description: event.target.value })} value={editValues.description} placeholder="Leave a description here" id="floatingTextarea2"></textarea>
                    <label htmlFor="floatingTextarea2">Description</label>

                    <div className="d-flex align-items-center mt-2">
                      <button type="button" className="btn btn-secondary fw-semibold" onClick={descriptionSave}>Save</button>
                      <i className="fal fa-times fs-3 ms-2" onClick={() => setEditDesc(null)}></i>
                    </div>
                  </div> : null


              }
              {
                card.description && !editDesc ?
                  <div className="description d-flex">
                    <i className="fas fa-align-left fs-5 fix-width"></i>
                    <span>
                      <span className="fs-5 fw-semibold">
                        Description
                        <button className="main-btn desc-edit-btn ms-2" onClick={() => setEditDesc(true)}>Edit</button>
                      </span>
                      <br />
                      <span>{card.description}</span>
                    </span>
                  </div> : null
              }
            </span>

            <div className="comments mt-3">
              <div className="comments-header">
                <i className="far fa-comment-alt fix-width fs-5"></i>
                <span className="fw-bold fs-5">Add Comment</span>
              </div>

              <div className="comments-content d-flex">
                <span className="user-image me-2 fs-4">{userData.name[0]}</span>

                <div className="form-floating flex-grow-1">
                  <textarea className="form-control" onChange={(event) => setComment(event.target.value)} placeholder="Leave a comment here" id="floatingTextarea2"></textarea>
                  <label htmlFor="floatingTextarea2">Your Comment</label>

                  <button className="main-btn mt-2" onClick={sendComment}>Send</button>
                </div>
              </div>
            </div>

            <div className="activity-block mt-3">
              <div className="activity-header d-flex justify-content-between">
                <div>
                  <i className="far fa-align-center fix-width fs-5"></i>
                  <span className="fw-bold fs-5">Activity</span>
                </div>

                <div className="text-decoration-underline" onClick={() => setShowDetails(!showDetails)}>{!showDetails ? "Show" : "Hide"} Details</div>
              </div>

              {
                showDetails &&
                <div className="activity-content">
                  {
                    activity.map(({ author, date, _id, action }) => (
                      <div className="activity-comment d-flex mb-3" key={_id}>
                        <span className="user-image me-2 fs-4">{author.name[0]}</span>
                        <span className="text">
                          <span className="fw-bold fs-6">{author.name}</span>
                          <span className="fw-semibold ms-2">{action}</span>
                          <br />
                          <span className="time">{dayjs(date).format("YYYY-MM-DD H:mm:ss")}</span>
                        </span>
                      </div>
                    ))
                  }

                  {
                    comments.map(({ _id, date, content, author }) => (
                      <div className="comment d-flex mb-3" key={_id}>
                        <span className="user-image me-2 fs-4">{author.name[0]}</span>
                        <span className="text">
                          <span className="comment-top">
                            <span className="fw-bold fs-6">{author.name}</span>
                            <span className="time ms-2">{dayjs(date).format("YYYY-MM-DD H:mm:ss")}</span>
                            <span className="delete-btn" onClick={() => deleteComment(_id)}>Delete</span>
                          </span>
                          <div className="comment-text fw-semibold">
                            {content}
                          </div>
                        </span>
                      </div>
                    ))
                  }
                </div>
              }
            </div>
          </div>

          <div className="actions ps-4">
            <div className="fw-bold fs-5">Actions</div>
            <button className="mt-2" onClick={() => setDeleteTab(true)}>
              <i className="far fa-trash"></i>
              <span className="fw-bold fs-6">Remove</span>
            </button>
          </div>
        </div>
      </Modal.Body>

      {
        deleteTab &&
        <div className="delete">
          <div className="tab-content">
            <i className="far fa-exclamation-circle delete-icon mb-3"></i>
            <div className="fs-4 mb-3">Are you sure you want to delete the card: {card.title}?</div>

            <div className="delete-actions">
              <button type="button" className="btn btn-primary me-3" onClick={() => setDeleteTab(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={cardDelete}>Delete</button>
            </div>
          </div>
        </div>
      }

    </Modal>
  );
}

export default CardModal;