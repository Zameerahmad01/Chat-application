import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/store/auth-slice";
import {
  addCollaborators,
  getProject,
  updateFileTree,
} from "@/store/project-slice";
import { initializeSocket, receiveMessage, sendMessage } from "@/config/socket";
import { getWebContainer } from "../config/webContainer";
import { toast } from "react-toastify";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";

function Project() {
  const location = useLocation();
  const projectId = location.state?.project?._id;

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOPen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFile, setOpenFile] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  const users = useSelector((state) => state.user.allUsers);
  const project = useSelector((state) => state.project.project);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const toggleUserSelection = (userId) => {
    setSelectedUserId((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const addCollaboratorsToProject = () => {
    dispatch(
      addCollaborators({
        projectId,
        users: selectedUserId,
      })
    ).then((result) => {
      if (result.payload.success) {
        toast.success("Collaborators added successfully");
      } else {
        toast.error("Failed to add collaborators");
      }
    });
  };

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  const sendMessageToProject = () => {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessages((prevMessages) => [...prevMessages, { message, sender: user }]);
    setMessage("");
    scrollToBottom();
  };

  const messageBoxRef = useRef(null);

  const displayMessage = (message, sender) => {
    if (sender._id === "ai") {
      try {
        const jsonMessage = JSON.parse(message);
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: jsonMessage.text, sender },
        ]);
      } catch (error) {
        console.error("Error parsing AI message:", error);
        // setMessages((prevMessages) => [...prevMessages, { message, sender }]);
      }
    } else {
      setMessages((prevMessages) => [...prevMessages, { message, sender }]);
    }
    scrollToBottom();
  };

  const saveFileTree = (ft) => {
    dispatch(updateFileTree({ projectId, fileTree: ft }))
      .then((result) => {
        console.log("updated file tree", result);
      })
      .catch((err) => {
        console.log("Error updating file tree:", err);
      });
  };
  useEffect(() => {
    initializeSocket(projectId);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container", container);
      });
    }

    receiveMessage("project-message", (data) => {
      if (data.sender._id === "ai") {
        const message = JSON.parse(data.message);
        message ? setFileTree(message.fileTree) : "";
        webContainer?.mount(message.fileTree);
      }
      displayMessage(data.message, data.sender);
      console.log("Received message:", data);
    });
  }, []);

  useEffect(() => {
    if (projectId) {
      dispatch(getProject(projectId)).then((result) => {
        console.log("result:", result);
        setFileTree(result.payload.data.fileTree);
      });
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(getAllUsers())
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [dispatch]);

  return (
    <main className="h-screen w-screen flex">
      {/* left Sidebar */}
      <section className="left relative h-screen min-w-80  flex flex-col">
        <header className="p-2 px-4 bg-slate-100">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                setIsModalOpen(!isModalOPen);
              }}
              className="bg-transparent hover:bg-slate-200 text-black flex items-center"
            >
              <i className="ri-user-add-line text-xl"></i>
              <p className="font-medium">Add Collaborators</p>
            </Button>

            <Button
              onClick={() => {
                setIsSidePanelOpen(!isSidePanelOpen);
              }}
              className="bg-transparent hover:bg-slate-200"
            >
              <i className="ri-group-fill text-black text-xl"></i>
            </Button>
          </div>
        </header>

        <div className="conversation-container h-full w-full bg-slate-300 flex flex-col relative">
          <div
            ref={messageBoxRef}
            className="message-box flex flex-grow  flex-col p-1 gap-1 overflow-auto scroll-behavior-smooth"
            style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender._id === user._id
                    ? "outgoing-message ml-auto flex flex-col p-2 bg-slate-50 w-fit max-w-60 rounded-md break-words"
                    : "incoming-message flex flex-col p-2 bg-slate-50 w-fit max-w-60 rounded-md break-words"
                }
              >
                <small className="opacity-65 text-xs">
                  {msg.sender._id === user._id ? "You" : msg.sender.email}
                </small>
                {msg.sender._id === "ai" ? (
                  <Markdown className="text-sm overflow-auto bg-black text-white p-2 rounded-md">
                    {msg.message}
                  </Markdown>
                ) : (
                  <p className="text-sm">{msg.message}</p>
                )}
              </div>
            ))}
          </div>
          <div className="inputfield flex items-center justify-between p-2 bg-white  border-t-2 border-black ">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              placeholder="Type a message"
              className="bg-transparent border-none w-full focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={sendMessageToProject}
              className="bg-transparent hover:bg-slate-200"
            >
              <i className="ri-send-plane-fill text-black text-xl"></i>
            </Button>
          </div>
        </div>

        <div
          className={`sidePanel absolute h-full w-full bg-slate-100 flex flex-col transition-all duration-300 ease-in-out ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="header p-2 px-4 bg-slate-50 flex justify-between items-center border-b-2 border-black">
            <h1 className="text-xl text-black font-bold">Members</h1>
            <Button
              onClick={() => {
                setIsSidePanelOpen(!isSidePanelOpen);
              }}
              className="bg-transparent hover:bg-slate-200"
            >
              <i className="ri-close-line text-black text-[1.75rem]"></i>
            </Button>
          </div>

          <div className="body flex-grow p-2 flex flex-col gap-1">
            {project &&
              project.users &&
              project.users.map((collaborator) => (
                <div
                  key={collaborator._id}
                  className="user p-2 px-2 bg-slate-300 flex items-center gap-4 rounded-md hover:bg-slate-400"
                >
                  <div className="image h-10 w-10 flex items-center justify-center border-[1px] border-black rounded-full">
                    <i className="ri-user-line text-black text-xl"></i>
                  </div>
                  <div className="flex flex-col leading-4 font-medium">
                    <p className="text-black ">{collaborator.fullName}</p>
                    <p className="text-black text-sm opacity-70">
                      {collaborator.email}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {isModalOPen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-96 max-h-96 overflow-scroll">
              <div className="flex items-center justify-between border-b-2 border-black p-2">
                <h2 className="text-xl font-bold ">Select Users</h2>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white text-white hover:bg-slate-200"
                >
                  <i className="ri-close-line text-black text-[1.75rem]"></i>
                </Button>
              </div>
              <div className="flex flex-col gap-2 py-2">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center gap-2 p-2 cursor-pointer border-[1px] border-black rounded-md ${
                        selectedUserId.includes(user._id)
                          ? "bg-slate-200"
                          : "bg-white"
                      }`}
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      <div className="image h-10 w-10 flex items-center justify-center border-[1px] border-black rounded-full">
                        <i className="ri-user-line text-black text-xl"></i>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium">{user.fullName}</p>
                        <small className="font-medium">{user.email}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No users available</p>
                )}
              </div>

              <Button
                onClick={() => {
                  // Handle adding collaborators
                  console.log("Selected User IDs:", selectedUserId);
                  setIsModalOpen(false);
                  addCollaboratorsToProject();
                }}
                className="mt-4 bg-blue-500 text-white"
              >
                Add Collaborators
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Right Sidebar */}
      <section className="right flex flex-grow">
        <div className="explorer flex flex-col h-full min-w-60  bg-slate-200">
          <div className="fileTree w-full flex flex-col ">
            {fileTree &&
              Object.keys(fileTree)?.map((fileName, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentFile(fileName);
                    setOpenFile((prevOpenFile) =>
                      prevOpenFile.includes(fileName)
                        ? prevOpenFile
                        : [...prevOpenFile, fileName]
                    );
                  }}
                  className="tree-element w-full bg-slate-300 flex items-center p-2 px-4 cursor-pointer hover:bg-slate-400"
                >
                  <p className="font-semibold">{fileName}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full bg-slate-100">
          <div className="top flex items-center bg-slate-200">
            {openFile &&
              openFile?.map((file) => (
                <div
                  key={file}
                  className={`flex items-center cursor-pointer ${
                    currentFile === file ? "bg-slate-400" : "bg-slate-300"
                  } p-2 px-4  hover:bg-slate-400`}
                  onClick={() => setCurrentFile(file)}
                >
                  <p className="font-semibold">{file}</p>
                </div>
              ))}

            <div
              className="flex p-2 px-4 bg-slate-300 hover:bg-slate-400"
              onClick={async () => {
                await webContainer.mount(fileTree);

                const installProcess = await webContainer.spawn("npm", [
                  "install",
                ]);

                installProcess.output.pipeTo(
                  new WritableStream({
                    write(chunk) {
                      console.log(chunk);
                    },
                  })
                );

                if (runProcess) {
                  runProcess.kill();
                }

                let tempRunProcess = await webContainer.spawn("npm", ["start"]);

                tempRunProcess.output.pipeTo(
                  new WritableStream({
                    write(chunk) {
                      console.log(chunk);
                    },
                  })
                );

                setRunProcess(tempRunProcess);

                webContainer.on("server-ready", (port, url) => {
                  console.log(port, url);
                  setIframeUrl(url);
                });
              }}
            >
              Run
            </div>
          </div>
          <div className="bottom flex flex-grow  max-w-full shrink overflow-auto">
            {currentFile && fileTree[currentFile] && (
              <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50 p-4">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      if (fileTree[currentFile]) {
                        const ft = {
                          ...fileTree,
                          [currentFile]: {
                            file: {
                              contents: updatedContent,
                            },
                          },
                        };
                        setFileTree(ft);
                        saveFileTree(ft);
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: fileTree[currentFile]
                        ? hljs.highlight(fileTree[currentFile].file.contents, {
                            language: "javascript",
                          }).value
                        : "",
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>

        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input
                type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-4 bg-slate-200"
              />
            </div>
            <iframe src={iframeUrl} className="w-full h-full"></iframe>
          </div>
        )}
      </section>
    </main>
  );
}

export default Project;
