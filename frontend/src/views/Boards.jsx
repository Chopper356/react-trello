import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";

import "../styles/boards.scss";
import testBg from "../imgs/test-bg.jpg";
import BoardsService from "../lib/BoardsService";

function Boards() {
  const [boards, setBoards] = useState([]);

  const getBoards = async () => {
    let { data } = await BoardsService.getAll();
    setBoards(data);
  }

  useEffect(() => {
    getBoards();
  }, []);

  return (
    <div className="boards-tab mt-5">
      <Tabs
        defaultActiveKey="all"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="all" title="All Boards">
          <div className="boards">
            <div className="row justify-content-start">
              {
                boards.map((board) => {
                  return (
                    <div className='col-sm-4 mb-2' key={board._id}>
                      <div className="board">
                        <img src={testBg} alt="bg" />
                        <div className='title'>{board.title}</div>

                        <div className='menu'>
                          <Dropdown>
                            <Dropdown.Toggle id="dropdown-start" drop="start">
                              <i className="far fa-ellipsis-h"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              <div className='col-sm-4 mb-2'>
                <div className="board create-board">
                  <div>Create new board...</div>
                </div>
              </div>
            </div>

          </div>
        </Tab>
        <Tab eventKey="profile" title="My Boards">
          йцуйцуйцуйц
        </Tab>
      </Tabs>
    </div >
  );
}

export default Boards;
