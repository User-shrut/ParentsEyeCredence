import { useState } from 'react'
import './ChatBot.css'

export default function Component() {
  const [activeChats, setActiveChats] = useState([
    {
      id: '1',
      name: 'John Doe',
      role: 'Salesman',
      lastMessage: 'Thank you for your help',
      date: '08/15/2024',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Manager',
      lastMessage: 'How can I assist you?',
      date: '08/14/2024',
    },
  ])

  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hello, I need some assistance with a client.',
      timestamp: '10:30 AM',
    },
    { id: '2', sender: 'You', content: 'Sure, what can I help you with?', timestamp: '10:32 AM' },
  ])

  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    const newMsg = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMsg])
    setNewMessage('')
  }

  return (
    <>
      <div className="container fs-5">
        <div className="row">
          <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
            <div className="p-3">
              <div className="input-group rounded mb-3">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <span className="input-group-text border-0" id="search-addon">
                  search
                </span>
              </div>
              <div
                data-mdb-perfect-scrollbar-init
                className="overflow-y-scroll"
                style={{ height: '70vh' }}
              >
                <ul className="list-unstyled mb-0">
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Marie Horwitz</p>
                          <p className="small text-muted">Hello, Are you there?</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Just now</p>
                        <span className="badge bg-danger rounded-pill float-end">3</span>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Alexa Chung</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">5 mins ago</p>
                        <span className="badge bg-danger rounded-pill float-end">2</span>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Danny McChain</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-danger badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Ashley Olsen</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                  <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-warning badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Kate Moss</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>

                  <li className="p-2">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        <div>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width={60}
                          />
                          <span className="badge bg-success badge-dot" />
                        </div>
                        <div className="pt-1">
                          <p className="fw-bold mb-0">Ben Smith</p>
                          <p className="small text-muted">Lorem ipsum dolor sit.</p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Yesterday</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-7 col-xl-8">
            <div className="flex flex-column ">
              <div className="d-flex flex-row bg-body-tertiary p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 1"
                  style={{ width: 45, height: '100%' }}
                />
                <div>
                  <p className="fw-bold p-2 ms-3 mb-1 ">Lorem ipsum dolor</p>
                </div>
              </div>
              <div
                className="pt-3 px-3 overflow-y-scroll"
                data-mdb-perfect-scrollbar-init
                style={{ height: '60vh' }}
              >
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p className=" fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat.
                    </p>
                    <p className="fs-6 me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                      eu fugiat nulla pariatur.
                    </p>
                    <p className="fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt mollit anim id est laborum.
                    </p>
                    <p className="small me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                      veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <p className="fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                      sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                    <p className="fs-6 me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
                <div className="d-flex flex-row justify-content-start">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                  <div>
                    <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">
                      Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                      adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                      dolore magnam aliquam quaerat voluptatem.
                    </p>
                    <p className="fs-6 ms-3 mb-3 rounded-3 text-muted float-end">
                      12:00 PM | Aug 13
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <div>
                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                      Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
                      laboriosam, nisi ut aliquid ex ea commodi consequatur?
                    </p>
                    <p className="fs-6 me-3 mb-3 rounded-3 text-muted">12:00 PM | Aug 13</p>
                  </div>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar 1"
                    style={{ width: 45, height: '100%' }}
                  />
                </div>
              </div>
              <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 3"
                  style={{ width: 40, height: '100%' }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg ms-2"
                  id="exampleFormControlInput2"
                  placeholder="Type message"
                />
                <a className="ms-1 text-muted" href="#!">
                  <i className="fas fa-paperclip" />
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <i className="fas fa-smile" />
                </a>
                <a className="ms-3" href="#!">
                  <i className="fas fa-paper-plane" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
