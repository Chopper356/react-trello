import classNames from "classnames";
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";

import styles from "./index.module.scss";
import ListsService from "../../lib/ListsService";
import BoardsService from "../../lib/BoardsService";
import CardsService from "../../lib/CardsService";
import Menu from "../../components/DropdownMenu";
import CardCreator from "../../components/CardCreator";
import CardModal from "../../components/CardModal";
import BoardActivityMenu from "../../components/BoardActivityMenu";
import ActivityService from "../../lib/ActivityService";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ChangeMembers, EditBoard, DeleteBoard } from "../../components/forms/BoardForms";
import { DeleteList, EditList } from "../../components/forms/ListForms";

function Board() {
  const userData = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState({});
  const [lists, setLists] = useState([]);
  const [listInputTitle, setListInputTitle] = useState("");
  const [modal, setModal] = useState(null);
  const [openedCard, setOpenedCard] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const getBoards = useCallback(async () => {
    const { data } = await BoardsService.getData({ id }).catch(error => error.response.status === 403 && navigate("/boards"));
    setBoard(data.board);
    setLists(data.lists);
  }, [id, navigate]);
  useEffect(() => {
    getBoards();
  }, [getBoards]);

  const handleChangeTaskInput = (e) => {
    const { value } = e.target;
    setListInputTitle(value);
  };

  const createList = async (event) => {
    event.preventDefault();
    const { data } = await ListsService.create({
      title: listInputTitle,
      author: userData.user._id,
      board: board._id
    });
    setLists([...lists, data.new_list]);
    setListInputTitle("")
  }

  const editList = (list) => {
    const newLists = lists.map((item) => {
      if (item._id === list._id) item.title = list.title;
      return item;
    })

    setLists(newLists);
  }

  const deleteList = (list) => {
    let new_lists = lists;
    let list_idx = new_lists.findIndex((item) => item._id === list._id);
    new_lists.splice(list_idx, 1);

    setLists(new_lists);
  }

  const addCardToList = (card) => {
    const newLists = lists.map((list) => {
      if (list._id === card.list) list.cards.push(card);
      return list;
    })

    setLists(newLists);
  }

  const editCard = (card) => {
    const newLists = lists.map((list) => {
      if (list._id === card.list) {
        const card_idx = list.cards.findIndex((item) => item._id === card._id);
        list.cards[card_idx] = card;
      }
      return list;
    })

    setLists(newLists);
  }

  const deleteCard = (card) => {
    const newLists = lists.map((list) => {
      if (list._id === card.list) {
        const card_idx = list.cards.findIndex((item) => item._id === card._id);
        list.cards.splice(card_idx, 1);
      }
      return list;
    })

    setLists(newLists);
  }

  const onDragEnd = useCallback(async (event) => {
    if (!event.destination || !event.source) return;

    const card = lists.find(l => l._id === event.source.droppableId).cards.find(c => c._id === event.draggableId);
    const cardMoved = { from: "", in: "" }

    const newLists = lists.map((list) => {
      if (list._id === event.source.droppableId) {
        list.cards.splice(event.source.index, 1);
        cardMoved.from = list.title;
      };
      if (list._id === event.destination.droppableId) {
        list.cards.splice(event.destination.index, 0, card);
        cardMoved.to = list.title;
      }
      return list;
    })

    if (event.destination.droppableId !== event.source.droppableId || event.destination.index !== event.source.index) {
      await CardsService.move(event.source.droppableId, event.destination.droppableId, { indexFrom: event.source.index, indexTo: event.destination.index, cardId: event.draggableId });
      await ActivityService.create({
        action: `${userData.user.name} moved card: ${card.title} from ${cardMoved.from} in list ${cardMoved.in}`,
        author: userData.user._id,
        board: board._id
      });
    }

    setLists(newLists);
  }, [lists, userData, board._id]);

  return (
    <div className={classNames(styles.board_page)}>
      {modal === "activity" && <BoardActivityMenu onClose={() => setModal(null)} board={board} />}
      {modal === "members" && <ChangeMembers onClose={() => setModal(null)} changeMembers={(members) => setBoard({ ...board, members })} board={board} />}
      {modal === "edit" && <EditBoard onClose={() => setModal(null)} edit={(id, title) => setBoard({ ...board, title })} board={board} />}
      {modal === "delete" && <DeleteBoard onClose={() => setModal(null)} board={board} />}
      {modal === "edit list" && <EditList onClose={() => setModal(null)} edit={(list) => editList(list)} list={selectedList} />}
      {modal === "delete list" && <DeleteList onClose={() => setModal(null)} delete={(list) => deleteList(list)} list={selectedList} />}

      {openedCard && <CardModal show={openedCard} onClose={() => setOpenedCard(null)} card={openedCard} editCard={(card) => editCard(card)} delete={(card) => deleteCard(card)} />}

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
                < Droppable droppableId={list._id} key={list._id + Date.now()} >
                  {
                    (provided) => (
                      <div className={classNames(styles.task)} {...provided.droppableProps} ref={provided.innerRef}>
                        <div className={classNames(styles.tasks_header, "d-flex justify-content-between pt-2 pb-2")}>
                          <span className="fw-bold">{list.title}</span>

                          <Menu icon={true}>
                            <span className="dropdown-menu-item" onClick={() => { setSelectedList(list); setModal('edit list') }}>Edit List</span>
                            <span className="dropdown-menu-item" onClick={() => { setSelectedList(list); setModal('delete list') }}>Delete List</span>
                          </Menu>
                        </div>
                        <div className={classNames(styles.content)}>
                          {
                            list.cards.map((card, index) => (
                              <Draggable key={card._id} draggableId={card._id} index={index}>
                                {
                                  (provided, snapshot) => (
                                    <div
                                      {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} snapshot={snapshot}
                                      className={classNames(styles.card_item, "p-2 mb-2")} key={card._id} onClick={() => setOpenedCard(card)}
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
                        <CardCreator list={list} addCard={addCardToList} />
                      </div>
                    )
                  }
                </Droppable>
              )) : null
            }
            <div className={classNames(styles.task)}>
              <div className={classNames(styles.task_footer)}>
                <form onSubmit={createList}>
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
