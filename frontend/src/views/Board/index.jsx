import classNames from "classnames";
import { useState, useCallback, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";

import styles from "./index.module.scss";
import Menu from "../../components/DropdownMenu";
import CardCreator from "../../components/CardCreator";
import CardModal from "../../components/CardModal";
import BoardActivityMenu from "../../components/BoardActivityMenu";
import ActivityService from "../../lib/ActivityService";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ChangeMembers, EditBoard, DeleteBoard } from "../../components/forms/BoardForms";
import { DeleteList, EditList } from "../../components/forms/ListForms";
import { setNotification } from "../../store/notificationData";
import { getBoard, createList, moveCard } from "../../store/boardData";

function Board() {
  const userData = useSelector((state) => state.user);
  const { id } = useParams();
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const board = useSelector((state) => state.board);
  const lists = useSelector((state) => state.board.lists);
  const [listInputTitle, setListInputTitle] = useState("");
  const [modal, setModal] = useState(null);
  const [openedCard, setOpenedCard] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const notification = useCallback((obj) => {
    dispatch(setNotification(obj));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBoard(id));
  }, [dispatch, id]);

  const handleChangeTaskInput = (e) => {
    const { value } = e.target;
    setListInputTitle(value);
  };

  const listCreate = async (event) => {
    event.preventDefault();
    dispatch(createList({
      title: listInputTitle,
      author: userData._id,
      board: board._id
    }));
    setListInputTitle("")
    notification({ title: "List create successfull!", text: "You have successfully created a list", type: "successfull" });
  }

  const onDragEnd = useCallback(async (event) => {
    if (!event.destination || !event.source) return;
    const card = lists.find(l => l._id.toString() === event.source.droppableId).cards.find(c => c._id.toString() === event.draggableId);
    const cardMovedFrom = lists.find(l => l._id.toString() === event.source.droppableId).title;
    const cardMovedTo = lists.find(l => l._id.toString() === event.destination.droppableId).title;

    if (event.destination.droppableId !== event.source.droppableId || event.destination.index !== event.source.index) {
      dispatch(moveCard({ listIdFrom: event.source.droppableId, listIdTo: event.destination.droppableId, data: { indexFrom: event.source.index, indexTo: event.destination.index, cardId: event.draggableId } }));
      await ActivityService.create({
        action: `${userData.name} moved card: ${card.title} from ${cardMovedFrom} in list ${cardMovedTo}`,
        author: userData._id,
        board: board._id
      });
      notification({ title: "Card moved!", text: "You have successfully moved the card", type: "successfull" });
    }

  }, [lists, userData, board._id, dispatch, notification]);

  return (
    <div className={classNames(styles.board_page)}>
      {modal === "activity" && <BoardActivityMenu onClose={() => setModal(null)} board={board} />}
      {modal === "members" && <ChangeMembers onClose={() => setModal(null)} board={board} />}
      {modal === "edit" && <EditBoard onClose={() => setModal(null)} board={board} />}
      {modal === "delete" && <DeleteBoard onClose={() => setModal(null)} board={board} />}
      {modal === "edit list" && <EditList onClose={() => setModal(null)} listId={selectedList} />}
      {modal === "delete list" && <DeleteList onClose={() => setModal(null)} listId={selectedList} />}

      {openedCard && <CardModal show={openedCard} onClose={() => setOpenedCard(null)} listId={openedCard.listId} cardId={openedCard.cardId} />}

      <div className={classNames(styles.page_content, "pt-3")}>
        <div className={classNames(styles.page_header, "d-flex justify-content-between")}>
          <span className={classNames(styles.text)}>{board.title}</span>

          <Menu menuText="Show Menu" icon={true}>
            <span className="dropdown-menu-item" onClick={() => setModal('activity')}>Activity</span>
            <span className="dropdown-menu-item" onClick={() => setModal('members')}>Members {board.members && <span className="ms-2">{board.members.length}</span>}</span>
            <span className="dropdown-menu-item" onClick={() => setModal('edit')}>Edit Board</span>
            <span className="dropdown-menu-item" onClick={() => setModal('delete')}>Delete Board</span>
          </Menu>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classNames(styles.tasks_list, "d-flex mt-3")}>
            {
              lists.length ? lists.map((list) => (
                <Droppable droppableId={list._id.toString()} key={list._id + Date.now()} >
                  {
                    (provided) => (
                      <div className={classNames(styles.task)} {...provided.droppableProps} ref={provided.innerRef}>
                        <div className={classNames(styles.tasks_header, "d-flex justify-content-between pt-2 pb-2")}>
                          <span className="fw-bold">{list.title}</span>

                          <Menu icon={true}>
                            <span className="dropdown-menu-item" onClick={() => { setSelectedList(list._id); setModal('edit list') }}>Edit List</span>
                            <span className="dropdown-menu-item" onClick={() => { setSelectedList(list._id); setModal('delete list') }}>Delete List</span>
                          </Menu>
                        </div>
                        <div className={classNames(styles.content)}>
                          {
                            list.cards.map((card, index) => (
                              <Draggable key={card._id} draggableId={card._id.toString()} index={index}>
                                {
                                  (provided, snapshot) => (
                                    <div
                                      {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} snapshot={snapshot}
                                      className={classNames(styles.card_item, "p-2 mb-2")} key={card._id} onClick={() => { setOpenedCard({ listId: list._id, cardId: card._id }) }}
                                    >
                                      {card.title}
                                    </div>
                                  )
                                }
                              </Draggable>
                            ))
                          }
                          {provided.placeholder}
                        </div>
                        <CardCreator list={list} />
                      </div>
                    )
                  }
                </Droppable>
              )) : null
            }
            <div className={classNames(styles.task)}>
              <div className={classNames(styles.task_footer)}>
                <form onSubmit={listCreate}>
                  <input type="text" required value={listInputTitle} onChange={handleChangeTaskInput} name="title" className="w-100 mb-2" placeholder="Add a list..." />
                  <div className={classNames(styles.card_add_actions, "d-flex justify-content-between")}>
                    <span>
                      <button type="submit">Create</button>
                    </span>
                  </div>
                </form>
              </div>
            </div>
            {lists.length <= 0 ? <div className={classNames(styles.lists_empty, "mt-5")}>Nothing here yet 🙁</div> : null}
          </div>
        </DragDropContext>

      </div >
    </div >
  );
}

export default Board;
